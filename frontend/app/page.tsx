import CertificateForm from "@/services/certificate/components/CertificateForm";
import ContactInfoForm from "@/services/contact-info/components/ContactInfoForm";
import ExperienceForm from "@/services/experience/components/ExperienceForm";
import ResumeForm from "@/services/resume/components/ResumeForm";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <ResumeForm />
    </div>
  );
}
