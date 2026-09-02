"use client";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  ArrowLeft,
  Search,
  Users,
  Briefcase,
  MessageCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
export default function NotFound() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#f3f2ef] dark:bg-[#1a1a1a] flex items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-[#242424] w-full max-w-125 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.5)] p-8 md:p-10 transition-colors duration-300">
        {/* LinkedIn Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="https://static.vecteezy.com/system/resources/previews/018/930/480/non_2x/linkedin-logo-linkedin-icon-transparent-free-png.png"
            alt="LinkedIn Logo"
            width={64}
            height={64}
            className="object-contain dark:brightness-0 dark:invert"
            priority
          />
        </div>

        {/* 404 Illustration */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-[#f3f6f9] dark:bg-[#333333] flex items-center justify-center transition-colors duration-300">
              <span className="text-6xl font-bold text-[#0a66c2] dark:text-[#4d8fd4]">
                404
              </span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-[#0a66c2] dark:bg-[#4d8fd4] flex items-center justify-center shadow-lg">
              <Search className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] dark:text-[#e0e0e0] mb-3 transition-colors duration-300">
            Page Not Found
          </h1>

          <p className="text-[#8f8f8f] dark:text-[#a0a0a0] text-base md:text-lg mb-2 transition-colors duration-300">
            Oops! The page you&apos;re looking for
          </p>
          <p className="text-[#8f8f8f] dark:text-[#a0a0a0] text-base md:text-lg mb-6 transition-colors duration-300">
            doesn&apos;t exist or has been moved.
          </p>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <Link
              href="/"
              className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-[#f3f6f9] dark:hover:bg-[#333333] transition-all duration-200 group"
            >
              <Home className="h-6 w-6 text-[#0a66c2] dark:text-[#4d8fd4] group-hover:scale-110 transition-transform" />
              <span className="text-xs text-[#0a0a0a] dark:text-[#e0e0e0] font-medium">
                Home
              </span>
            </Link>

            <Link
              href="/network"
              className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-[#f3f6f9] dark:hover:bg-[#333333] transition-all duration-200 group"
            >
              <Users className="h-6 w-6 text-[#0a66c2] dark:text-[#4d8fd4] group-hover:scale-110 transition-transform" />
              <span className="text-xs text-[#0a0a0a] dark:text-[#e0e0e0] font-medium">
                Network
              </span>
            </Link>

            <Link
              href="/jobs"
              className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-[#f3f6f9] dark:hover:bg-[#333333] transition-all duration-200 group"
            >
              <Briefcase className="h-6 w-6 text-[#0a66c2] dark:text-[#4d8fd4] group-hover:scale-110 transition-transform" />
              <span className="text-xs text-[#0a0a0a] dark:text-[#e0e0e0] font-medium">
                Jobs
              </span>
            </Link>

            <Link
              href="/messages"
              className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-[#f3f6f9] dark:hover:bg-[#333333] transition-all duration-200 group"
            >
              <MessageCircle className="h-6 w-6 text-[#0a66c2] dark:text-[#4d8fd4] group-hover:scale-110 transition-transform" />
              <span className="text-xs text-[#0a0a0a] dark:text-[#e0e0e0] font-medium">
                Messages
              </span>
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0a66c2] hover:bg-[#004182] dark:bg-[#0a66c2] dark:hover:bg-[#004182] text-white font-semibold rounded-full transition-all duration-200 hover:scale-[1.02]"
            >
              <Home className="h-5 w-5" />
              Go to Homepage
            </Link>

            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#8f8f8f] dark:border-[#555555] hover:border-[#0a66c2] dark:hover:border-[#0a66c2] hover:bg-[#f3f6f9] dark:hover:bg-[#333333] text-[#0a0a0a] dark:text-[#e0e0e0] font-semibold rounded-full transition-all duration-200 hover:scale-[1.02]"
            >
              <ArrowLeft className="h-5 w-5" />
              Go Home
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-[#f3f6f9] dark:bg-[#333333] rounded-lg transition-colors duration-300">
            <p className="text-sm text-[#8f8f8f] dark:text-[#a0a0a0] transition-colors duration-300">
              💡 Need help? Visit our{" "}
              <Link
                href="/help"
                className="text-[#0a66c2] dark:text-[#4d8fd4] hover:underline font-medium transition-colors"
              >
                Help Center
              </Link>{" "}
              or contact{" "}
              <Link
                href="/support"
                className="text-[#0a66c2] dark:text-[#4d8fd4] hover:underline font-medium transition-colors"
              >
                Support
              </Link>
            </p>
          </div>

          {/* Footer Links */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-[#8f8f8f] dark:text-[#888888] transition-colors duration-300">
            <Link
              href="/"
              className="hover:text-[#0a66c2] dark:hover:text-[#4d8fd4] transition-colors"
            >
              LinkedIn
            </Link>
            <span>•</span>
            <Link
              href="/about"
              className="hover:text-[#0a66c2] dark:hover:text-[#4d8fd4] transition-colors"
            >
              About
            </Link>
            <span>•</span>
            <Link
              href="/privacy"
              className="hover:text-[#0a66c2] dark:hover:text-[#4d8fd4] transition-colors"
            >
              Privacy
            </Link>
            <span>•</span>
            <Link
              href="/about/terms"
              className="hover:text-[#0a66c2] dark:hover:text-[#4d8fd4] transition-colors"
            >
              Terms
            </Link>
            <span>•</span>
            <span>© {new Date().getFullYear()} </span>
          </div>
        </div>
      </div>
    </div>
  );
}
