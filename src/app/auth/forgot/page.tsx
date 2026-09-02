import dynamic from "next/dynamic";
const Forgot = dynamic(() => import("@/components/auth/forgot"));
export default function Page() {
  return <Forgot />
}
