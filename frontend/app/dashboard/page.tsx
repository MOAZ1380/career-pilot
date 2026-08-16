import CurrentUserCard from "@/services/auth/components/CurrentUserCard";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center font-sans">
      <CurrentUserCard />
    </div>
  );
}
