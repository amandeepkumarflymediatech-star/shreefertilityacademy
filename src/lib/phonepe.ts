import crypto from 'crypto';

export const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || 'PGTESTPAYUAT';
export const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
export const PHONEPE_SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';
export const PHONEPE_ENV = process.env.PHONEPE_ENV || 'UAT'; // 'UAT' or 'PROD'

export const PHONEPE_BASE_URL = 
  (PHONEPE_ENV === 'PROD' || PHONEPE_ENV === 'production')
    ? 'https://api.phonepe.com/apis/hermes' 
    : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

/**
 * Generates the X-VERIFY checksum for PhonePe API
 */
export function generateChecksum(payloadBase64: string, endpoint: string): string {
  const stringToHash = payloadBase64 + endpoint + PHONEPE_SALT_KEY;
  const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
  return `${sha256}###${PHONEPE_SALT_INDEX}`;
}
