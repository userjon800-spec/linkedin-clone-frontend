import type { Metadata } from "next";
import { Roboto, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toast";
const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Linkedin",
  description: "Linkedin clone app created by Javohir Xamdamboyev",
  icons: {
    icon: "/logo.png",
  }
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  if (typeof window !== "undefined") {
    return null;
  }
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        roboto.variable,
        "font-sans",
        figtree.variable,
      )}
    >
      <body className="min-h-full flex flex-col" cz-shortcut-listen="true">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main>{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
