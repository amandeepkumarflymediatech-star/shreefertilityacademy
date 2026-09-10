import crypto from 'crypto';

export const isProd = 
  process.env.PHONEPE_ENV === 'PROD' || 
  process.env.PHONEPE_ENV === 'production';

export const PHONEPE_ENV = isProd ? 'PROD' : 'UAT';

// Credentials (supports both V2 naming and legacy naming)
export const PHONEPE_CLIENT_ID = 
  process.env.PHONEPE_CLIENT_ID || 
  process.env.PHONEPE_MERCHANT_ID || 
  (isProd ? 'SU2605261940037980801824' : 'PGTESTPAYUAT86');

export const PHONEPE_CLIENT_SECRET = 
  process.env.PHONEPE_CLIENT_SECRET || 
  process.env.PHONEPE_SALT_KEY || 
  (isProd ? '7f82a661-e5cc-4dca-afd4-150d3f67e557' : '96434309-7796-489d-8924-ab56988a6076');

export const PHONEPE_CLIENT_VERSION = 
  process.env.PHONEPE_CLIENT_VERSION || 
  process.env.PHONEPE_SALT_INDEX || 
  '1';

// Legacy exports for backward compatibility
export const PHONEPE_MERCHANT_ID = PHONEPE_CLIENT_ID;
export const PHONEPE_SALT_KEY = PHONEPE_CLIENT_SECRET;
export const PHONEPE_SALT_INDEX = PHONEPE_CLIENT_VERSION;

// PhonePe V2 Endpoints
export const PHONEPE_AUTH_URL = isProd
  ? 'https://api.phonepe.com/apis/identity-manager/v1/oauth/token'
  : 'https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token';

export const PHONEPE_CHECKOUT_URL = isProd
  ? 'https://api.phonepe.com/apis/pg/checkout/v2/pay'
  : 'https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay';

export const PHONEPE_STATUS_BASE_URL = isProd
  ? 'https://api.phonepe.com/apis/pg/checkout/v2/order'
  : 'https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order';

// In-memory OAuth token cache
let cachedToken: { accessToken: string; expiresAt: number } | null = null;

/**
 * Retrieves a valid PhonePe V2 OAuth Access Token (with caching)
 */
export async function getPhonePeAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60000) {
    return cachedToken.accessToken;
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', PHONEPE_CLIENT_ID);
  params.append('client_secret', PHONEPE_CLIENT_SECRET);
  params.append('client_version', PHONEPE_CLIENT_VERSION);

  const res = await fetch(PHONEPE_AUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const data = await res.json();

  if (!res.ok || !data.access_token) {
    console.error('PhonePe OAuth Token Error:', { status: res.status, data });
    throw new Error(data.message || data.error_description || 'Failed to authenticate with PhonePe');
  }

  const expiresInMs = (data.expires_in || 3600) * 1000;
  cachedToken = {
    accessToken: data.access_token,
    expiresAt: now + expiresInMs,
  };

  return data.access_token;
}

/**
 * Initiates a PhonePe V2 Checkout Session
 */
export async function createPhonePePayment(options: {
  merchantOrderId: string;
  amountInPaise: number;
  redirectUrl: string;
  callbackUrl?: string;
  message?: string;
}) {
  const token = await getPhonePeAccessToken();

  const payload = {
    merchantOrderId: options.merchantOrderId,
    amount: options.amountInPaise,
    paymentFlow: {
      type: 'PG_CHECKOUT',
      message: options.message || 'Course & Mentorship Enrollment',
      merchantUrls: {
        redirectUrl: options.redirectUrl,
        callbackUrl: options.callbackUrl || options.redirectUrl,
      },
    },
  };

  const res = await fetch(PHONEPE_CHECKOUT_URL, {
    method: 'POST',
    headers: {
      'Authorization': `O-Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok || !data.redirectUrl) {
    console.error('PhonePe V2 Checkout Error:', { status: res.status, data, payload });
    throw new Error(data.message || data.error || 'Failed to initiate PhonePe V2 payment');
  }

  return data;
}

/**
 * Checks the status of a PhonePe V2 Order
 */
export async function getPhonePeOrderStatus(merchantOrderId: string) {
  const token = await getPhonePeAccessToken();
  const url = `${PHONEPE_STATUS_BASE_URL}/${merchantOrderId}/status`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `O-Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  const data = await res.json();
  return { status: res.status, data };
}

/**
 * Legacy checksum generator for V1 compatibility if needed
 */
export function generateChecksum(payloadBase64: string, endpoint: string): string {
  const stringToHash = payloadBase64 + endpoint + PHONEPE_SALT_KEY;
  const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
  return `${sha256}###${PHONEPE_SALT_INDEX}`;
}
