import { Suspense } from "react";
import ResetPasswordForm from "@/services/auth/components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center font-sans">
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
