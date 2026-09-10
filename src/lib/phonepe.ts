import crypto from 'crypto';

export const isProd = 
  process.env.PHONEPE_ENV === 'PROD' || 
  process.env.PHONEPE_ENV === 'production' ||
  (process.env.PHONEPE_ENV !== 'UAT' && 
   process.env.PHONEPE_ENV !== 'SANDBOX' && 
   process.env.PHONEPE_MERCHANT_ID && 
   !process.env.PHONEPE_MERCHANT_ID.startsWith('PGTEST'));

export const PHONEPE_ENV = isProd ? 'PROD' : 'UAT';

export const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || (isProd ? 'M22DED07QHZJP_2606151144' : 'PGTESTPAYUAT');
export const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY || (isProd ? 'NmNmZTE5YTgtN2E4Mi00ZjA1LThmOTAtOTE2N2U2NDg3NGUy' : '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399');
export const PHONEPE_SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';

export const PHONEPE_BASE_URL = process.env.PHONEPE_BASE_URL || (isProd
  ? 'https://api.phonepe.com/apis/hermes' 
  : 'https://api-preprod.phonepe.com/apis/pg-sandbox');

/**
 * Generates the X-VERIFY checksum for PhonePe API
 */
export function generateChecksum(payloadBase64: string, endpoint: string): string {
  const stringToHash = payloadBase64 + endpoint + PHONEPE_SALT_KEY;
  const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
  return `${sha256}###${PHONEPE_SALT_INDEX}`;
}
