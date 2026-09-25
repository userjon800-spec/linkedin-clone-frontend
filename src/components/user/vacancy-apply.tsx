"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  DollarSign,
  Clock,
  CheckCircle2,
  FileText,
  Send,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Loader2,
  BadgeCheck,
} from "lucide-react";
import { api } from "@/lib/https";
import { IVacancy } from "@/types";

interface IResume {
  _id: string;
  title?: string;
  fullName?: string;
  fileUrl?: string;
  skills?: string[];
  createdAt?: string;
  [key: string]: any;
}

export default function VacancyApply({ vacancy }: { vacancy: IVacancy[] }) {
  const router = useRouter();

  // Props o'zgaruvchidan birinchi vakansiyani ajratib olish
  const vacancyData = Array.isArray(vacancy) ? vacancy[0] : vacancy;

  const [resumes, setResumes] = useState<IResume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [loadingResumes, setLoadingResumes] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [appliedSuccess, setAppliedSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoadingResumes(true);
      const res = await api.get("/resume/get");
      const resumeList = Array.isArray(res.data?.resume) ? res.data.resume : [];
      setResumes(resumeList);

      if (resumeList.length > 0) {
        setSelectedResumeId(resumeList[0]._id);
      }
    } catch (err) {
      console.error("Rezyumelarni yuklashda xatolik:", err);
    } finally {
      setLoadingResumes(false);
    }
  };

  // Ariza topshirish funksiyasi
  const handleApply = async () => {
    if (!vacancyData?._id) {
      setErrorMessage("Vakansiya ID topilmadi");
      return;
    }

    if (!selectedResumeId) {
      setErrorMessage("Iltimos, ariza topshirish uchun rezyume tanlang");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage("");

      const payload = {
        vacancyId: vacancyData._id,
        resumeId: selectedResumeId,
      };

      console.log("Arizaga yuborilayotgan payload:", payload);

      const res = await api.post("/applications/apply", payload);
      console.log("Arizaga kelgan javob:", res.data);

      setAppliedSuccess(true);
    } catch (err: any) {
      console.error("Ariza topshirishda xatolik:", err);
      setErrorMessage(
        err?.response?.data?.message ||
          "Ariza topshirishda xatolik yuz berdi. Qayta urinib ko'ring.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Maoshni chiroyli formatlash
  const formatSalary = (salary?: IVacancy["salary"]) => {
    if (!salary || (!salary.min && !salary.max))
      return "Maosh kelishilgan holda";

    const symbol =
      salary.currency === "UZS"
        ? "so'm"
        : salary.currency === "EUR"
          ? "€"
          : "$";

    const period =
      salary.period === "yearly"
        ? "/yil"
        : salary.period === "hourly"
          ? "/soat"
          : "/oy";

    if (salary.min && salary.max) {
      return `${salary.min.toLocaleString()} - ${salary.max.toLocaleString()} ${symbol} ${period}`;
    }
    if (salary.min)
      return `${salary.min.toLocaleString()} ${symbol}+ ${period}`;
    return `${salary.max ? salary.max.toLocaleString() : 0} ${symbol} gacha ${period}`;
  };

  if (!vacancyData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-2" />
        <h2 className="text-lg font-semibold">
          Vakansiya ma'lumotlari topilmadi
        </h2>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm"
        >
          Orqaga qaytish
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Navigation */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Vakansiyalarga qaytish</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chap Tomon: Vakansiya Tafsilotlari (2 ustun) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card dark:bg-zinc-900 border border-border dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
            {/* Header info */}
            <div className="space-y-3 border-b border-border dark:border-zinc-800 pb-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 rounded-lg">
                  {vacancyData.employmentType || "CONTRACT"}
                </span>
                {vacancyData.locationType && (
                  <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 rounded-lg">
                    {vacancyData.locationType}
                  </span>
                )}
                {vacancyData.experienceLevel && (
                  <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg">
                    {vacancyData.experienceLevel}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground dark:text-zinc-100">
                {vacancyData.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  {vacancyData.location || "Toshkent"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                  {vacancyData.createdAt
                    ? new Date(vacancyData.createdAt).toLocaleDateString()
                    : "Yaqinda joylandi"}
                </span>
              </div>
            </div>

            {/* Maosh bloki */}
            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 rounded-xl flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  Taklif etilayotgan maosh
                </p>
                <p className="text-lg sm:text-xl font-bold text-emerald-700 dark:text-emerald-300">
                  {formatSalary(vacancyData.salary)}
                </p>
              </div>
              <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            {/* Tavsifi */}
            <div className="space-y-2">
              <h3 className="font-semibold text-base text-foreground">
                Vakansiya tavsifi
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {vacancyData.description || "Tavsif kiritilmagan."}
              </p>
            </div>

            {/* Talab etiladigan ko'nikmalar */}
            {vacancyData.skills && vacancyData.skills.length > 0 && (
              <div className="space-y-2 border-t border-border dark:border-zinc-800 pt-4">
                <h3 className="font-semibold text-base text-foreground">
                  Talab qilinadigan ko'nikmalar
                </h3>
                <div className="flex flex-wrap gap-2">
                  {vacancyData.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-muted dark:bg-zinc-800 text-foreground dark:text-zinc-200 text-xs font-medium rounded-lg border border-border dark:border-zinc-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* O'ng Tomon: Rezyume Tanlash va Ariza Yuborish Formasi (1 ustun) */}
        <div className="space-y-6">
          <div className="bg-card dark:bg-zinc-900 border border-border dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-5 sticky top-6">
            <div className="flex items-center gap-2 border-b border-border dark:border-zinc-800 pb-3">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <h2 className="font-bold text-base text-foreground">
                Ariza topshirish
              </h2>
            </div>

            {appliedSuccess ? (
              <div className="p-6 text-center space-y-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="font-bold text-emerald-700 dark:text-emerald-300 text-base">
                  Ariza muvaffaqiyatli topshirildi!
                </h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  Kompaniya arizangizni ko'rib chiqqach siz bilan bog'lanadi.
                </p>
                <button
                  onClick={() => router.push("/jobs")}
                  className="mt-2 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Boshqa vakansiyalarni ko'rish
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Ushbu vakansiyaga topshirish uchun kerakli rezyumengizni
                  tanlang:
                </p>

                {/* Rezyumelar Ro'yxati */}
                {loadingResumes ? (
                  <div className="flex items-center justify-center p-6 text-muted-foreground text-xs gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Rezyumelar yuklanmoqda...</span>
                  </div>
                ) : resumes.length === 0 ? (
                  <div className="p-4 border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 rounded-xl text-center space-y-2">
                    <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      Sizda hali yaratilgan rezyume topilmadi.
                    </p>
                    <button
                      onClick={() => router.push("/resume")}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      + Rezyume yaratish
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {resumes.map((resume) => {
                      const isSelected = selectedResumeId === resume._id;
                      return (
                        <div
                          key={resume._id}
                          onClick={() => setSelectedResumeId(resume._id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-600"
                              : "border-border dark:border-zinc-800 bg-background dark:bg-zinc-950 hover:border-zinc-400"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <FileText
                              className={`w-4 h-4 shrink-0 ${
                                isSelected
                                  ? "text-blue-600"
                                  : "text-muted-foreground"
                              }`}
                            />
                            <div className="truncate">
                              <p className="text-xs font-semibold truncate text-foreground">
                                {resume.title ||
                                  resume.fullName ||
                                  "Mening Rezyumem"}
                              </p>
                              {resume.skills && (
                                <p className="text-[10px] text-muted-foreground truncate">
                                  {resume.skills.join(", ")}
                                </p>
                              )}
                            </div>
                          </div>

                          {isSelected && (
                            <BadgeCheck className="w-4 h-4 text-blue-600 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Xatolik xabari */}
                {errorMessage && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="button"
                  disabled={submitting || resumes.length === 0}
                  onClick={handleApply}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Yuborilmoqda...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Arizani yuborish</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
