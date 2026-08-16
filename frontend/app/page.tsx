import Auth from "@/services/auth/components/Auth";
import RegisterForm from "@/services/auth/components/RegisterForm";
import ResetPasswordForm from "@/services/auth/components/ResetPasswordForm";
import CertificateForm from "@/services/certificate/components/CertificateForm";
import ContactInfoForm from "@/services/contact-info/components/ContactInfoForm";
import ExperienceForm from "@/services/experience/components/ExperienceForm";
import ResumeForm from "@/services/resume/components/ResumeForm";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <ResetPasswordForm />
    </div>
  );
}
