"use client";

import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/https";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "../ui/toast";
type UserRegisterFormData = {
  firstName: string;
  lastName: string;
  age: number;
  job: string;
  email: string;
  password: string;
};

export default function UserRegisterForm() {
  const [jobs, setJobs] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UserRegisterFormData>();

  const onSubmit = async (data: UserRegisterFormData) => {
    try {
      await api.post(`/auth/user/register`, data);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      toast.add({
        type: "success",
        description: "Tizimdan muaffaqiyatli ro'yxatdan o'tdingiz",
      });
    } catch (error: any) {
      console.error(error);
      toast.add({
        type: "error",
        description: error.response?.data?.message,
        priority: "high",
      });
    }
  };
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_URL}/api/auth/jobs/list`)
      .then((res) => {
        setJobs(res.data.jobs);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
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

        <Controller
          name="job"
          control={control}
          rules={{ required: "Job is required" }}
          render={({ field }) => {
            return (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a job" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {jobs.map((item, i) => (
                      <SelectItem key={i} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            );
          }}
        />
        {errors.job && <p className="text-red-500 text-sm">Job is required</p>}

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
