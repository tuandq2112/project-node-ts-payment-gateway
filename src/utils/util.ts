import * as crypto from 'crypto';

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export const generateRandomString = (length: number): string => {
  // Create cryptographic random bytes
  const buffer = crypto.randomBytes(Math.ceil(length / 2));

  // Convert to hex string
  const hexString = buffer.toString('hex').slice(0, length);

  return hexString;
};

export function replaceAll(str: string, search: string, replace: string) {
  return str.split(search).join(replace);
}
