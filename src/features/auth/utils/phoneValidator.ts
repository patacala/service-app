/**
 * Single Responsibility: Validate phone numbers
 */
export class PhoneValidator {
  private static readonly US_PHONE_REGEX = /^\d{10}$/;
  private static readonly COUNTRY_CODE = '+1';

  static validateUSPhone(phone: string): { isValid: boolean; error?: string } {
    const cleaned = phone.replace(/\D/g, '');

    if (!cleaned) {
      return { isValid: false, error: 'Phone number is required' };
    }

    if (!this.US_PHONE_REGEX.test(cleaned)) {
      return { isValid: false, error: 'Phone number must be 10 digits' };
    }

    return { isValid: true };
  }

  static formatWithCountryCode(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    return `${this.COUNTRY_CODE}${cleaned}`;
  }

  static sanitize(input: string): string {
    return input.replace(/\D/g, '').slice(0, 10);
  }
}

