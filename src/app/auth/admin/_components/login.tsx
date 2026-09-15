"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || "";
      const res = await fetch(`${baseUrl}/api/admin/dashboard/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Muvaffaqiyatli kirilsa Admin Dashboard sahifasiga o'tkaziladi
        router.push("/admin/dashboard");
      } else {
        // Agar xatolik bo'lsa yoki admin bo'lmasa xabarni ko'rsatamiz
        setError(data.message || "Email yoki parol xato kiritildi!");

        // Agar ruxsatsiz kirish urinishi bo me'yoriy taqiqlangan bo'lsa 2 soniyadan so'ng /auth/role ga qaytarish
        if (res.status === 401 || res.status === 403) {
          setTimeout(() => {
            router.push("/auth/role");
          }, 2000);
        }
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Server bilan bog'lanishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Ortga qaytish tugmasi */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/auth/role")}
          className="mb-6 hover:bg-transparent text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Rollar sahifasiga qaytish
        </Button>

        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Tizimi</CardTitle>
            <CardDescription>
              Boshqaruv paneliga kirish uchun ma'lumotlaringizni kiriting
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email kiritish */}
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              {/* Parol kiritish */}
              <div className="space-y-2">
                <Label htmlFor="password">Parol</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-9"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Kirish tugmasi */}
              <Button
                type="submit"
                className="w-full mt-2 cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Tekshirilmoqda...
                  </>
                ) : (
                  "Tizimga kirish"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
