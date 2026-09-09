import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Select Role",
};
export default async function RootLayout({ children }: LayoutProps<"/">) {
  return <main>{children}</main>;
}
