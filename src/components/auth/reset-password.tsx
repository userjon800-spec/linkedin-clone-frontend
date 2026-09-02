"use client";

import { useState, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { api } from "@/lib/https";
import axios from "axios";
import Link from "next/link";
import { Button } from "../ui/button";
const PasswordInput = ({ id, label, value, setValue, show, setShow }: any) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5"
    >
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        required
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="••••••••"
        className="w-full px-3.5 py-2.5 pr-11 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent text-sm transition"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-neutral-400 dark:hover:text-neutral-200 transition p-1"
        aria-label={show ? "Yashirish" : "Ko'rsatish"}
      >
        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  </div>
);

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Token topilmadi yoki havola eskirgan.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Kiritilgan parollar bir-biriga mos kelmadi.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post(`/auth/reset-password`, {
        token,
        password: newPassword,
      });

      if (data.success || data) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/role");
        }, 1500);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Server bilan bog'lanishda xatolik yuz berdi.",
        );
      } else {
        setError("Kutilmagan xatolik yuz berdi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f2ef] dark:bg-neutral-950 px-4 transition-colors duration-200">
      <Link href="/auth/role" className="absolute top-4 left-4">
        <Button variant="outline">
          <ArrowLeft className="mr-1 h-4 w-4" />
          <span>Back</span>
        </Button>
      </Link>
      <div className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-xl shadow-md dark:shadow-2xl p-8 border border-gray-200 dark:border-neutral-800">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full text-[#0a66c2] mb-3 bg-blue-50 dark:bg-neutral-800/50">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Yangi parol o'rnatish
          </h1>
          <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
            Xavfsiz parolingizni kiriting va tasdiqlang.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-200 text-sm rounded-lg flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="p-6 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-500 mx-auto" />
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-200">
              Parol yangilandi!
            </h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              Akkauntingiz xavfsiz holatda. Keyingi sahifaga yo'naltirilasiz...
            </p>
          </div>
        ) : (
          /* Form UI */
          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordInput
              id="new-password"
              label="Yangi parol"
              value={newPassword}
              setValue={setNewPassword}
              show={showNewPassword}
              setShow={setShowNewPassword}
            />

            <PasswordInput
              id="confirm-password"
              label="Parolni tasdiqlang"
              value={confirmPassword}
              setValue={setConfirmPassword}
              show={showConfirmPassword}
              setShow={setShowConfirmPassword}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0a66c2] hover:bg-[#084e96] text-white font-semibold py-2.5 px-4 rounded-full transition duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed shadow-sm mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saqlanmoqda...</span>
                </>
              ) : (
                <>
                  <span>Parolni yangilash</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
