"use client";

import axios from "axios";
import { useEffect, useState } from "react";

import { resendVerificationOtp } from "../api/auth.service";

type ResendVerificationOtpProps = {
  email: string;
};

const RESEND_COOLDOWN = 60;

export default function ResendVerificationOtp({
  email,
}: ResendVerificationOtpProps) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isDisabled = secondsLeft > 0;

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((current) => current - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleResend = async () => {
    if (isDisabled || !email) return;

    setMessage("");
    setError("");

    try {
      const response = await resendVerificationOtp({ email });

      setMessage(response.message || "Verification code sent.");
      setSecondsLeft(RESEND_COOLDOWN);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message;

        setError(
          typeof serverMessage === "string"
            ? serverMessage
            : "Failed to resend verification code.",
        );

        return;
      }

      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="text-center">
      <p className="text-sm text-gray-600">Didn't receive the code?</p>

      <button
        type="button"
        onClick={handleResend}
        disabled={isDisabled}
        className="mt-2 text-sm font-medium text-black underline disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isDisabled
          ? `Resend code in ${secondsLeft}s`
          : "Resend verification code"}
      </button>

      {message && <p className="mt-2 text-sm text-green-600">{message}</p>}

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
