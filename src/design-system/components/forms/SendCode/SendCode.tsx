import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { SendCodeProps } from './types';
import { Button } from '@/design-system';
import { useTranslation } from 'react-i18next';

export const SendCode = forwardRef(({
  delaySeconds = 60,
  maxAttempts = 3,
  lockDurationSeconds = 120,
  onSend,
  initialLabel
}: SendCodeProps, ref) => {
  const { t } = useTranslation('auth');
  const [counter, setCounter] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [lockedOut, setLockedOut] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (counter > 0) {
      timer = setTimeout(() => setCounter(prev => prev - 1), 1000);
    }

    return () => clearTimeout(timer);
  }, [counter]);

  useEffect(() => {
    let unlockTimer: ReturnType<typeof setTimeout>;

    if (lockedOut) {
      unlockTimer = setTimeout(() => {
        setLockedOut(false);
        setAttempts(0);
      }, lockDurationSeconds * 1000);
    }

    return () => clearTimeout(unlockTimer);
  }, [lockedOut, lockDurationSeconds]);

  const handleSend = async () => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    try {
      await onSend?.();

      if (nextAttempts > maxAttempts) {
        setLockedOut(true);
        return;
      }

      setCounter(delaySeconds);
    } catch {
      // Don't start counter if onSend failed
    }
  };

  // Expose stop method via ref
  useImperativeHandle(ref, () => ({
    stop: () => setCounter(0)
  }));

  const isWaiting = counter > 0;
  const isButtonDisabled = lockedOut || isWaiting;

  const getLabel = () => {
    if (lockedOut) return t('otp.limitreached');
    if (isWaiting) return `${t('otp.resendcodein')} ${counter}s`;
    return initialLabel || t('otp.resendcode');
  };

  return (
    <Button
      variant="ghostWithout"
      label={getLabel()}
      onPress={handleSend}
      disabled={isButtonDisabled}
    />
  );
});
