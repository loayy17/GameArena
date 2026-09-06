interface IOtpFormProps {
  email: string;
  onSuccess: (otp: string) => void;
  onResend?: () => Promise<unknown>;
  validateOnly?: boolean;
}

export type { IOtpFormProps };
