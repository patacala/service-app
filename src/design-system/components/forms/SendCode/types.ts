export type SendCodeVariant = 'default';

export interface SendCodeProps {
  delaySeconds?: number;
  maxAttempts?: number;
  lockDurationSeconds?: number;
  onSend?: () => void;
  initialLabel?: string;
}

export interface SendCodeRef {
  stop: () => void;
}
  
  