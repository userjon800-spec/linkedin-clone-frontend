import dymamic from "next/dynamic";
const AdminLogin = dymamic(() => import("./_components/login"));
export default function Page() {
  return <AdminLogin />;
}
