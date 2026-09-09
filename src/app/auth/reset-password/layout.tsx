import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Auth Reset Password",
};
export default async function RootLayout({ children }: LayoutProps<"/">) {
  return <main>{children}</main>;
}