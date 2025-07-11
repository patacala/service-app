import { ConfirmationResult } from 'firebase/auth';

let confirmationResult: ConfirmationResult | null = null;

export const setOtpConfirmationResult = (result: ConfirmationResult) => {
  confirmationResult = result;
};

export const getOtpConfirmationResult = (): ConfirmationResult | null => {
  return confirmationResult;
};