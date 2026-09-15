import { getUsersServer } from "@/lib/request.server";
import { IUser } from "@/types";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
const Skeleton = dynamic(() => import("@/components/shared/linkedin-skeleton"));
const LinkedInFooter = dynamic(
  () => import("@/components/shared/linkedin-footer"),
);
const ManageMyNetwork = dynamic(
  () => import("@/components/user/manage-my-network"),
);
const SuggestionsUsers = dynamic(
  () => import("@/components/user/suggestions-users"),
);
const RequestedUser = dynamic(() => import("@/components/user/requested-user"));
export default async function Page() {
  const authData = await getUsersServer();
  if (!authData) {
    return <Skeleton />;
  }
  if (!authData || !authData.user || authData.role !== "user") {
    redirect("/auth/role");
  }
  const user = authData.user as IUser;
  return (
    <div className="w-full flex mt-4 gap-3 h-full p-2">
      <div className="w-[25%] h-fit flex flex-col gap-3">
        <ManageMyNetwork user={user} />
        <LinkedInFooter />
      </div>
      <div className="w-[70%] h-fit flex flex-col gap-3">
        <RequestedUser />
        <SuggestionsUsers connections={user.connections} />
      </div>
    </div>
  );
}
