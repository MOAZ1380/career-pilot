import Auth from "@/services/auth/components/Auth";
import LoginForm from "@/services/auth/components/LoginForm";
import RegisterForm from "@/services/auth/components/RegisterForm";
import ResetPasswordForm from "@/services/auth/components/ResetPasswordForm";
import CertificateForm from "@/services/certificate/components/CertificateForm";
import ContactInfoForm from "@/services/contact-info/components/ContactInfoForm";
import ExperienceForm from "@/services/experience/components/ExperienceForm";
import ProfileForm from "@/services/profile/components/ProfileForm";
import ResumeForm from "@/services/resume/components/ResumeForm";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <ProfileForm />
    </div>
  );
}
