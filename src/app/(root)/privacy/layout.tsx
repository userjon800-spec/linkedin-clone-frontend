import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Linkedin Privacy",
};
export default async function RootLayout({ children }: LayoutProps<"/">) {
  return <main>{children}</main>;
}