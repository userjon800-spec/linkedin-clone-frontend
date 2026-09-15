import dynamic from "next/dynamic";
const LinkedInFooter = dynamic(
  () => import("@/components/shared/linkedin-footer"),
);
const List = dynamic(() => import("./_components/list"));
export default function Page() {
  return (
    <div className="flex gap-4 w-full h-fit mt-4 p-2">
      <List />
      <LinkedInFooter />
    </div>
  );
}
