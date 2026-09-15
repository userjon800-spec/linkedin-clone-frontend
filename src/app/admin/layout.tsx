import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Admin Dashboard",
  icons: {
    icon: "https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/privacy-security/admin-panel-settings-yhpo6ni3cq2fiib17o9or.png/admin-panel-settings-qovd03kufxq43atuow2n6q.png?_a=DATAiZAAZAA0",
  },
};
export default async function RootLayout({ children }: LayoutProps<"/">) {
  return <main>{children}</main>;
}
