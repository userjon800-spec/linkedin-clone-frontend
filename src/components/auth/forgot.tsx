"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/https";
import { toast } from "../ui/toast";

type ForgotPasswordFormData = {
  email: string;
};

export default function Forgot() {
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await api.post(`/auth/forgot-password`, data);
      setSuccess(true);
    } catch (error: any) {
      console.error(error);
      toast.add({
        type: "error",
        description: error.response.data.message,
        priority: "high",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-8">
          {!success ? (
            <>
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-7 w-7 text-primary" />
                </div>

                <h1 className="text-2xl font-bold">Forgot Password</h1>

                <p className="mt-2 text-sm text-muted-foreground">
                  Email manzilingizni kiriting. Parolni tiklash havolasini
                  yuboramiz.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <Input
                    type="email"
                    placeholder="Email manzilingizni kiriting"
                    {...register("email", {
                      required: "Email kiritilishi shart",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Email formati noto'g'ri",
                      },
                    })}
                  />

                  {errors.email && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Yuborilmoqda...
                    </>
                  ) : (
                    "Reset Link Yuborish"
                  )}
                </Button>
              </form>

              <Link
                href="/auth/role"
                className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Login sahifasiga qaytish
              </Link>
            </>
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <h2 className="text-2xl font-bold">Email yuborildi</h2>

              <p className="mt-3 text-muted-foreground">
                Agar email mavjud bo'lsa, parolni tiklash havolasi yuborildi.
              </p>

              <Button className="mt-6 w-full" onClick={() => setSuccess(false)}>
                Boshqa email yuborish
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
