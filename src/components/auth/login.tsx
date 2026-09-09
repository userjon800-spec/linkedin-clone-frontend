"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail, Lock, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { api } from "@/lib/https";
import { toast } from "../ui/toast";

export default function Login() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const role = searchParams.get("role");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!role) {
      router.push("/auth/role");
    }
  }, []);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const endpoint =
        role === "company" ? "/auth/company/login" : "/auth/user/login";
      await api.post(`${endpoint}`, {
        email,
        password,
      });
      toast.add({
        type: "success",
        description: "Tizimga muvaffaqiyatli kirdingiz",
      });
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error: any) {
      toast.add({
        type: "error",
        description: error?.response?.data.message || error,
      });
      console.error(error?.response?.data.message || error);
    } finally {
      setLoading(false);
    }
  };

  if (!role) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 w-full">
      <Link href="/auth/role" className="absolute top-4 left-4">
        <Button variant="outline">
          <ArrowLeft className="mr-1 h-4 w-4" />
          <span>Back</span>
        </Button>
      </Link>
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold">
              {role === "user" ? "User Login" : "Company Login"}
            </h1>

            <p className="text-muted-foreground mt-2">
              Tizimga kirish uchun ma'lumotlarni kiriting
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <Input
                type="email"
                placeholder="Email"
                className="pl-10"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <Input
                type="password"
                placeholder="Password"
                className="pl-10"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
              />
            </div>

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
          <div className="flex justify-between items-center my-2.5 flex-col gap-2 w-full h-fit mx-auto">
            <Link href={`/auth/role/register?role=${role}`}>
              Ro'yxatdan o'tish
            </Link>
            <Link href="/auth/forgot">Parolni unutdingizmi ?</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
