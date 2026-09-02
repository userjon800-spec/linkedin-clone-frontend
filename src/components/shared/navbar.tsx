"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Users,
  Briefcase,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  MessageCircle,
  Plus,
  FileText,
  Clock,
  UserCircle,
  Settings,
  Award,
  LayoutGrid,
  Building2,
} from "lucide-react";
import { IUser, ICompany } from "@/types";
import { Button } from "../ui/button";
import { api } from "@/lib/https";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "../ui/toast";
import { FaLinkedin } from "react-icons/fa";
import { AuthAccount } from "@/lib/request.server";

export const businessTools = [
  { name: "Post a job", icon: Plus, href: "/jobs/post" },
  { name: "Advertise", icon: FileText, href: "/advertise" },
  { name: "Analytics", icon: Clock, href: "/analytics" },
];

export const profileMenu = [
  { name: "Profile", icon: UserCircle, href: "/profile" },
  { name: "Settings & Privacy", icon: Settings, href: "/settings" },
  { name: "Try Premium", icon: Award, href: "/premium" },
  { name: "Help", icon: FileText, href: "/help" },
];

export default function Navbar({ user }: { user: AuthAccount }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const isCompany = user?.role === "company";
  const userAccount = user as IUser;
  const companyAccount = user as ICompany;

  // Foydalanuvchi yoki Kompaniya ma'lumotlarini ajratib olish
  const displayName = isCompany
    ? companyAccount?.companyName || "Company"
    : `${userAccount?.firstName || ""} ${userAccount?.lastName || ""}`.trim() ||
      "User";

  const avatarSrc = isCompany ? companyAccount?.logo : userAccount?.avatar;

  const displayFallback = isCompany
    ? companyAccount?.companyName?.charAt(0)?.toUpperCase() || "C"
    : userAccount?.firstName?.charAt(0)?.toUpperCase() || "U";

  const badgeText = isCompany ? "Company Account" : "Free Plan";

  // Rolga mos navigatsiya menyusi
  const navItems = [
    { name: "Home", href: "/", icon: Home },
    {
      name: isCompany ? "Candidates" : "My Network",
      href: isCompany ? "/candidates" : "/network",
      icon: Users,
    },
    {
      name: isCompany ? "Vacancy" : "Jobs",
      href: isCompany ? "/vacancy" : "/jobs",
      icon: Briefcase,
    },
    { name: "Messaging", href: "/messages", icon: MessageCircle },
    { name: "Notifications", href: "/notifications", icon: Bell },
  ];

  const logout = async () => {
    try {
      const res = await api.post("/auth/logout");
      if (res.data.success) {
        toast.add({
          type: "success",
          description: res.data.message,
        });
        setTimeout(() => {
          router.push("/auth/role");
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#1a1a1a] border-b border-[#e0e0e0] dark:border-[#333333] transition-colors duration-300 sticky top-0 z-50 py-0.5">
      <div className="max-w-[1600px] mx-auto px-2 md:px-4 h-fit md:h-13 flex items-center justify-between gap-2 md:gap-4">
        {/* Left Section - Logo & Search */}
        <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
          <Link href="/" className="shrink-0">
            <FaLinkedin className="h-8 w-8 md:h-9 md:w-9 text-[#0a66c2] dark:text-[#4d8fd4]" />
          </Link>

          <div className="hidden md:flex items-center flex-1 max-w-70 bg-[#f3f2ef] dark:bg-[#333333] rounded-full px-3 py-1.5 transition-colors duration-300">
            <Search className="h-4 w-4 text-[#8f8f8f] dark:text-[#888888] mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-transparent text-[#0a0a0a] dark:text-[#e0e0e0] placeholder:text-[#8f8f8f] dark:placeholder:text-[#888888] text-sm focus:outline-none"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

          <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
            <DialogTrigger className="md:hidden h-9 w-9 rounded-full flex items-center justify-center hover:bg-[#f3f2ef] dark:hover:bg-[#333333] transition-colors">
              <Search className="h-5 w-5 text-[#8f8f8f] dark:text-[#888888]" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25 top-[10%] translate-y-0">
              <DialogHeader>
                <DialogTitle>Search</DialogTitle>
              </DialogHeader>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-[#8f8f8f] dark:text-[#888888] shrink-0" />
                <Input
                  ref={searchInputRef}
                  placeholder="Search on LinkedIn"
                  className="flex-1"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Center Section - Navbar Items */}
        <div className="flex items-center gap-0 md:gap-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center justify-center px-2 md:px-3 py-1 rounded-lg hover:bg-[#f3f2ef] dark:hover:bg-[#333333] transition-all duration-200 group relative min-w-13 md:min-w-16"
              >
                <item.icon
                  className={`h-5 w-5 ${
                    isActive
                      ? "text-[#0a0a0a] dark:text-[#e0e0e0]"
                      : "text-[#8f8f8f] dark:text-[#888888]"
                  } group-hover:text-[#0a0a0a] dark:group-hover:text-[#e0e0e0] transition-colors`}
                />
                <span
                  className={`text-[9px] md:text-[10px] ${
                    isActive
                      ? "text-[#0a0a0a] dark:text-[#e0e0e0]"
                      : "text-[#8f8f8f] dark:text-[#888888]"
                  } group-hover:text-[#0a0a0a] dark:group-hover:text-[#e0e0e0] transition-colors mt-0.5 truncate max-w-12.5 md:max-w-full`}
                >
                  {item.name}
                </span>
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#0a66c2] dark:bg-[#4d8fd4] transition-all duration-300 ${
                    isActive ? "w-[60%]" : "w-0 group-hover:w-[60%]"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          {/* Profile / Company Dropdown */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center flex-col gap-1 px-2 py-1 rounded-lg hover:bg-[#f3f2ef] dark:hover:bg-[#333333] transition-all duration-200 group cursor-pointer outline-none">
                <Avatar className="h-7 w-7 md:h-8 md:w-8 border border-gray-200 dark:border-gray-700">
                  <AvatarImage
                    src={avatarSrc}
                    alt={displayName}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-[#0a66c2] dark:bg-[#4d8fd4] text-white text-xs font-semibold">
                    {isCompany ? (
                      <Building2 className="h-4 w-4" />
                    ) : (
                      displayFallback
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-row gap-1">
                  <div className="hidden lg:flex flex-col items-start">
                    <span className="text-xs text-[#0a0a0a] dark:text-[#e0e0e0] font-medium leading-none truncate max-w-20">
                      Me
                    </span>
                  </div>
                  <ChevronDown className="hidden lg:block h-3 w-3 text-[#8f8f8f] dark:text-[#888888] group-hover:text-[#0a0a0a] dark:group-hover:text-[#e0e0e0] transition-colors" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-60">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-[#0a0a0a] dark:text-[#e0e0e0] truncate">
                        {displayName}
                      </p>
                      <p className="text-xs leading-none text-[#8f8f8f] dark:text-[#888888] truncate">
                        {user?.email}
                      </p>
                      <Badge
                        variant="secondary"
                        className="mt-1 w-fit text-[10px] bg-[#f3f6f9] dark:bg-[#333333]"
                      >
                        {badgeText}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  {profileMenu.map((item) => (
                    <DropdownMenuItem
                      key={item.name}
                      className="p-0 cursor-pointer"
                    >
                      <Link
                        href={
                          isCompany && item.href === "/profile"
                            ? "/company/profile"
                            : item.href
                        }
                        className="flex items-center gap-2 w-full px-2 py-1.5"
                      >
                        <item.icon className="h-4 w-4 text-[#8f8f8f] dark:text-[#888888]" />
                        <span>{item.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem className="text-red-600">
                    <Button
                      onClick={logout}
                      className="w-full bg-transparent dark:text-red-400 cursor-pointer hover:bg-transparent justify-start p-0 h-auto font-normal text-sm"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="hidden lg:block w-px h-8 bg-[#e0e0e0] dark:bg-[#333333]" />

          {/* Business Dropdown */}
          <div className="hidden lg:flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#f3f2ef] dark:hover:bg-[#333333] transition-all duration-200 group cursor-pointer outline-none">
                <LayoutGrid className="h-5 w-5 text-[#8f8f8f] dark:text-[#888888] group-hover:text-[#0a0a0a] dark:group-hover:text-[#e0e0e0] transition-colors" />
                <span className="text-xs text-[#8f8f8f] dark:text-[#888888] group-hover:text-[#0a0a0a] dark:group-hover:text-[#e0e0e0] transition-colors font-medium hidden xl:inline">
                  Business
                </span>
                <ChevronDown className="h-3 w-3 text-[#8f8f8f] dark:text-[#888888] group-hover:text-[#0a0a0a] dark:group-hover:text-[#e0e0e0] transition-colors hidden xl:inline" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-50">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <span className="text-sm font-medium text-[#0a0a0a] dark:text-[#e0e0e0]">
                      Business Tools
                    </span>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  {businessTools.map((item) => (
                    <DropdownMenuItem
                      key={item.name}
                      className="p-0 cursor-pointer"
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-2 w-full px-2 py-1.5"
                      >
                        <item.icon className="h-4 w-4 text-[#8f8f8f] dark:text-[#888888]" />
                        <span>{item.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Link
            href="/premium"
            className="hidden lg:flex items-center text-xs text-[#915907] dark:text-[#d4a26a] font-medium hover:underline transition-colors px-2 whitespace-nowrap"
          >
            Try Premium
          </Link>
        </div>
      </div>
    </div>
  );
}
