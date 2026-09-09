"use client";

import UserRegisterForm from "./user-register-form";
import CompanyRegisterForm from "./company-register-form";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export default function Register() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get("role");

  useEffect(()=>{
    if (!role) {
    router.push("/auth/role");
  };
  },[])

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <Link href="/auth/role" className="absolute top-4 left-4">
        <Button variant="outline">
          <ArrowLeft className="mr-1 h-4 w-4" />
          <span>Back</span>
        </Button>
      </Link>
      {role === "user" && <UserRegisterForm />}
      {role === "company" && <CompanyRegisterForm />}
    </div>
  );
}