"use client";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/https";
import { toast } from "../ui/toast";

type CompanyRegisterFormData = {
  companyName: string;
  email: string;
  password: string;
};

export default function CompanyRegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CompanyRegisterFormData>();

  const onSubmit = async (data: CompanyRegisterFormData) => {
    try {
      await api.post(
        `/auth/company/register`,
        data,
      );
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error:any) {
      console.error(error);
      toast.add({
        type: "error",
        description: error.response.data.message,
        priority: "high",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Company Register</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          placeholder="Company name"
          {...register("companyName", {
            required: true,
          })}
        />

        <Input
          type="email"
          placeholder="Email"
          {...register("email", {
            required: true,
          })}
        />

        <Input
          type="password"
          placeholder="Password"
          {...register("password", {
            required: true,
            minLength: 6,
          })}
        />

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          Register
        </Button>
      </form>
    </div>
  );
}
