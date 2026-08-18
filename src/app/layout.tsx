import type { Metadata } from "next";
import { Roboto, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Linkedin",
  description: "Linkedin clone app created by Javohir Xamdamboyev",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", roboto.variable, "font-sans", figtree.variable)}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
