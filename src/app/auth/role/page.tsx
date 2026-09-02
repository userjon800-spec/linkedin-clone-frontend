import dynamic from "next/dynamic";
const Role = dynamic(() => import("./_components/role"));
export default function Page() {
  return <Role />
}
