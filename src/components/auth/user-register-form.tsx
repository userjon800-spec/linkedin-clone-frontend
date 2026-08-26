"use client";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/https";

type UserRegisterFormData = {
  firstName: string;
  lastName: string;
  age: number;
  job: string;
  email: string;
  password: string;
};

export default function UserRegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserRegisterFormData>();

  const onSubmit = async (data: UserRegisterFormData) => {
    try {
      await api.post(
        `/auth/user/register`,
        data,
      );

      console.log("User created");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">User Register</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          placeholder="First name"
          {...register("firstName", {
            required: true,
          })}
        />

        <Input
          placeholder="Last name"
          {...register("lastName", {
            required: true,
          })}
        />

        <Input
          type="number"
          placeholder="Age"
          {...register("age", {
            required: true,
            valueAsNumber: true,
          })}
        />

        <Input
          placeholder="Job"
          {...register("job", {
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

        <Button className="w-full" disabled={isSubmitting}>
          Register
        </Button>
      </form>
    </div>
  );
}
