import { Suspense } from "react";
import VerifyResetOtpForm from "@/services/auth/components/VerifyResetOtpForm";

export default function VerifyResetOtpPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center font-sans">
      <Suspense>
        <VerifyResetOtpForm />
      </Suspense>
    </div>
  );
}
