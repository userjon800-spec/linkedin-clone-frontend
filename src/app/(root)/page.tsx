import { redirect } from "next/navigation";
import { getUsersServer } from "@/lib/request.server";
import dynamic from "next/dynamic";
const AddExperience = dynamic(
  () => import("@/components/shared/add-experience"),
);
const AddConnection = dynamic(
  () => import("@/components/shared/add-connection"),
);
const StartAddPost = dynamic(
  () => import("@/components/shared/start-add-post"),
);
export default async function Page() {
  const authData = await getUsersServer();

  if (!authData || !authData.user) {
    redirect("/auth/role");
  }
  return (
    <div className="max-w-[1600px] mx-auto mt-4 w-full h-full border border-white flex items-center justify-between gap-3">
      <AddExperience />
      <div className="w-[55%] flex flex-col gap-3">
        <StartAddPost user={authData.user} />
        post scroll area
      </div>
      <AddConnection />
    </div>
  );
}
