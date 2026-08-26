import dynamic from "next/dynamic";
const Register = dynamic(() => import("@/components/auth/register"));
export default function Page() {
  return <Register />;
}
