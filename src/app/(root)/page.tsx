import { redirect } from "next/navigation";
import { getUsersServer } from "@/lib/request.server";
import dynamic from "next/dynamic";
const AddExperience = dynamic(() => import("@/components/user/add-experience"));
const AddConnection = dynamic(
  () => import("@/components/shared/add-connection"),
);
const StartAddPost = dynamic(
  () => import("@/components/shared/start-add-post"),
);
const VacancyCreateModal = dynamic(
  () => import("@/components/company/vacancy-create-modal"),
);
const VacancyApplied = dynamic(
  () => import("@/components/company/vacancy-applied"),
);
export default async function Page() {
  const authData = await getUsersServer();
  if (!authData || !authData.user) {
    redirect("/auth/role");
  }
  return (
    <div className="mt-4 w-full h-full p-2 flex items-start justify-between gap-3">
      {authData.role === "user" ? <AddExperience /> : <VacancyCreateModal className="flex-col" />}
      <div className="w-full flex flex-col gap-3">
        <StartAddPost user={authData.user} />
        post scroll area
      </div>
      {authData.role === "user" ? <AddConnection /> : <VacancyApplied />}
    </div>
  );
}
