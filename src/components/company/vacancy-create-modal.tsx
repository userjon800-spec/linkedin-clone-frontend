"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Briefcase,
  Plus,
  X,
  MapPin,
  DollarSign,
  Building2,
  Sparkles,
  BadgeCheck,
} from "lucide-react";
import { IVacancy } from "@/types";


export default function VacancyCreateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IVacancy>({
    defaultValues: {
      title: "",
      description: "",
      employmentType: "FULL_TIME",
      locationType: "ON_SITE",
      location: "",
      experienceLevel: "MIDDLE",
      salary: {
        min: null,
        max: null,
        currency: "USD",
        period: "monthly",
      },
      skills: [],
      applicantsCount: 0,
      isActive: true,
    },
  });

  // Modalni yopish va formani tozalash
  const handleClose = () => {
    setIsOpen(false);
    setSkills([]);
    setSkillInput("");
    reset();
  };

  // Skill qo'shish
  const handleAddSkill = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && "key" in e && e.key !== "Enter") return;
    e?.preventDefault();

    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  // Skill o'chirish
  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Form submit bo'lganda ishlaydigan funksiya
  const onSubmit = (data: IVacancy) => {
    const payload = {
      ...data,
      salary: {
        min: data.salary.min ? Number(data.salary.min) : undefined,
        max: data.salary.max ? Number(data.salary.max) : undefined,
        currency: data.salary.currency || "USD",
        period: data.salary.period || "monthly",
      },
      skills: skills,
    };

    console.log("🚀 Vacancy Payload (API uchun tayyor):", payload);

    // Xabar berish va modalni yopish
    alert("Vakansiya ma'lumotlari konsolga chiqarildi!");
    handleClose();
  };

  return (
    <>
      {/* 🟢 1. SAHIFADAGI WIDGET / CARD (AddExperience o'rniga ishlaydi) */}
      <div className="bg-card dark:bg-zinc-900 border border-border dark:border-zinc-800 rounded-xl p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900/40">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-foreground dark:text-zinc-100">
                Yangi vakansiya joylash
              </h3>
              <p className="text-sm text-muted-foreground dark:text-zinc-400 mt-0.5">
                Kompaniyangiz uchun mos iqtidorli mutaxassislarni toping
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-zinc-400">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Tezkor e'lon berish va nomzodlarni jalb qilish</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Vakansiya yaratish</span>
          </button>
        </div>
      </div>

      {/* 🔴 2. CREATE VACANCY MODAL DIALOG */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-background dark:bg-zinc-900 border border-border dark:border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border dark:border-zinc-800 flex items-center justify-between bg-muted/30 dark:bg-zinc-800/30">
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="font-semibold text-lg text-foreground dark:text-zinc-100">
                  Yangi vakansiya e'lon qilish
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex-1 overflow-y-auto p-6 space-y-5"
            >
              {/* Vacancy Title */}
              <div>
                <label className="block text-xs font-semibold text-foreground dark:text-zinc-200 mb-1.5">
                  Vakansiya nomi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Senior Frontend Engineer (React/Next.js)"
                  {...register("title", {
                    required: "Vakansiya nomini kiriting",
                  })}
                  className="w-full px-3.5 py-2.5 text-sm bg-background dark:bg-zinc-800/80 border border-input dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/40 focus:border-blue-600 transition-all placeholder:text-muted-foreground/60"
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Grid 1: Employment Type & Location Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground dark:text-zinc-200 mb-1.5">
                    Bandlik turi (Employment Type)
                  </label>
                  <select
                    {...register("employmentType")}
                    className="w-full px-3.5 py-2.5 text-sm bg-background dark:bg-zinc-800/80 border border-input dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/40 focus:border-blue-600 transition-all"
                  >
                    <option value="FULL_TIME">To'liq stavka (Full-time)</option>
                    <option value="PART_TIME">Yarim stavka (Part-time)</option>
                    <option value="CONTRACT">
                      Shartnoma asosida (Contract)
                    </option>
                    <option value="INTERN">Stajirovka (Intern)</option>
                    <option value="FREELANCE">Frilans (Freelance)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground dark:text-zinc-200 mb-1.5">
                    Ish tartibi (Location Type)
                  </label>
                  <select
                    {...register("locationType")}
                    className="w-full px-3.5 py-2.5 text-sm bg-background dark:bg-zinc-800/80 border border-input dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/40 focus:border-blue-600 transition-all"
                  >
                    <option value="ON_SITE">Ofisda (On-site)</option>
                    <option value="HYBRID">Gibrid (Hybrid)</option>
                    <option value="REMOTE">Masofaviy (Remote)</option>
                  </select>
                </div>
              </div>

              {/* Location & Experience Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground dark:text-zinc-200 mb-1.5">
                    Joylashuv (Location)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Toshkent, O'zbekiston"
                      {...register("location")}
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-background dark:bg-zinc-800/80 border border-input dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/40 focus:border-blue-600 transition-all placeholder:text-muted-foreground/60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground dark:text-zinc-200 mb-1.5">
                    Tajriba darajasi (Experience Level)
                  </label>
                  <select
                    {...register("experienceLevel")}
                    className="w-full px-3.5 py-2.5 text-sm bg-background dark:bg-zinc-800/80 border border-input dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/40 focus:border-blue-600 transition-all"
                  >
                    <option value="JUNIOR">Junior</option>
                    <option value="MIDDLE">Middle</option>
                    <option value="SENIOR">Senior</option>
                    <option value="EXPERT">Expert</option>
                  </select>
                </div>
              </div>

              {/* Salary Section */}
              <div className="p-4 rounded-xl bg-muted/40 dark:bg-zinc-800/40 border border-border dark:border-zinc-800 space-y-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-semibold text-foreground dark:text-zinc-200">
                    Maosh diapazoni (Ixtiyoriy)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="block text-[11px] text-muted-foreground mb-1">
                      Min maosh
                    </span>
                    <input
                      type="number"
                      placeholder="1000"
                      {...register("salary.min")}
                      className="w-full px-3 py-2 text-sm bg-background dark:bg-zinc-800 border border-input dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] text-muted-foreground mb-1">
                      Max maosh
                    </span>
                    <input
                      type="number"
                      placeholder="2500"
                      {...register("salary.max")}
                      className="w-full px-3 py-2 text-sm bg-background dark:bg-zinc-800 border border-input dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] text-muted-foreground mb-1">
                      Valyuta
                    </span>
                    <select
                      {...register("salary.currency")}
                      className="w-full px-2.5 py-2 text-sm bg-background dark:bg-zinc-800 border border-input dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="UZS">UZS (so'm)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="RUB">RUB (₽)</option>
                    </select>
                  </div>
                  <div>
                    <span className="block text-[11px] text-muted-foreground mb-1">
                      Davriyligi
                    </span>
                    <select
                      {...register("salary.period")}
                      className="w-full px-2.5 py-2 text-sm bg-background dark:bg-zinc-800 border border-input dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                    >
                      <option value="monthly">Oylik</option>
                      <option value="yearly">Yillik</option>
                      <option value="hourly">Soatbay</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Skills Tag Input */}
              <div>
                <label className="block text-xs font-semibold text-foreground dark:text-zinc-200 mb-1.5">
                  Talab qilinadigan ko'nikmalar (Skills)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="Masalan: TypeScript, Next.js, TailWind CSS"
                    className="flex-1 px-3.5 py-2 text-sm bg-background dark:bg-zinc-800/80 border border-input dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/40 focus:border-blue-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3.5 py-2 bg-muted hover:bg-muted/80 text-foreground text-xs font-medium rounded-lg border border-border dark:border-zinc-700 transition-colors"
                  >
                    Qo'shish
                  </button>
                </div>

                {/* Skill Badges */}
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 rounded-md text-xs font-medium"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-foreground dark:text-zinc-200 mb-1.5">
                  Vakansiya tavsifi va talablar (Description){" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Loyiha haqida, nomzoddan kutilayotgan asosiy vazifalar va sharoitlar..."
                  {...register("description", {
                    required: "Tavsif yozishingiz shart",
                  })}
                  className="w-full px-3.5 py-2.5 text-sm bg-background dark:bg-zinc-800/80 border border-input dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/40 focus:border-blue-600 transition-all placeholder:text-muted-foreground/60 resize-y"
                />
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Footer Actions inside Form */}
              <div className="pt-4 border-t border-border dark:border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all active:scale-[0.98]"
                >
                  <BadgeCheck className="w-4 h-4" />
                  <span>Chop etish (Submit)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
