import dynamic from "next/dynamic";
const JobsPage = dynamic(() => import("@/components/user/jobs-page"));
export default function Page() {
  return <JobsPage />
}
