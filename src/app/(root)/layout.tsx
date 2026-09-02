import type { Metadata } from "next";
import { getUsersServer } from "@/lib/request.server";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
const Navbar = dynamic(() => import("@/components/shared/navbar"));

export const metadata: Metadata = {
  title: "Linkedin Home",
  description: "Linkedin clone app created by Javohir Xamdamboyev",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
    const authData = await getUsersServer();

  if (!authData || !authData.user) {
    redirect("/auth/role");
  }
  return (
   <>
    
        <Navbar user={authData.user} />
          <main>{children}</main>
   </>

  );
}
