import dynamic from "next/dynamic";
const ResetPasswordPage = dynamic(
  () => import("@/components/auth/reset-password"),
);
export default function Page() {
  return <ResetPasswordPage />;
}
