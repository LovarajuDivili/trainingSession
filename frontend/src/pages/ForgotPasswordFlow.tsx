import * as React from 'react';
import ForgotPasswordRequest from './ForgotPasswordRequest';
import ForgotPasswordReset from './ForgotPasswordReset';

const ForgotPasswordFlow: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [step, setStep] = React.useState<'request' | 'reset'>('request');

  const handleOTPSent = (email: string) => {
    setEmail(email);
    setStep('reset');
  };

  const handleResetComplete = () => {
    window.location.href = '/';
  };

  return (
    <>
      {step === 'request' ? (
        <ForgotPasswordRequest onOTPSent={handleOTPSent} />
      ) : (
        <ForgotPasswordReset email={email} onResetComplete={handleResetComplete} />
      )}
    </>
  );
};

export default ForgotPasswordFlow;
