import { getUsersServer } from "@/lib/request.server";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
const VacancyPage = dynamic(() => import("@/components/company/vacancy-page"));
export default async function Page() {
  const company = await getUsersServer();
  if (!company) {
    redirect("/auth/role");
  } else if (company.role !== "company") {
    redirect("/");
  }
  return (
    <div>
      <VacancyPage />
    </div>
  );
}
