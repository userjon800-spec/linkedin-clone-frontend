"use client";

import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Briefcase,
  Plus,
  X,
  MapPin,
  DollarSign,
  Building2,
  Sparkles,
  BadgeCheck,
  Search,
} from "lucide-react";
import { IVacancy } from "@/types";
import { api } from "@/lib/https";
import { toast } from "../ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Global cache: Backend'dan kelgan skill'larni qayta-qayta request qilmaslik uchun
let cachedSkillsList: string[] | null = null;

export default function VacancyCreateModal({
  className,
}: {
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
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

  // Skills fetch & cache logic
  useEffect(() => {
    if (cachedSkillsList) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAvailableSkills(cachedSkillsList);
      return;
    }

    api
      .get("/vacancy/skills")
      .then((res) => {
        const fetched = res.data?.skills || res.data || [];
        if (Array.isArray(fetched)) {
          // Set orqali takrorlangan skill'larni olib tashlaymiz
          const cleanSkills = Array.from(
            new Set(
              fetched.map((s: any) => (typeof s === "string" ? s : s.name)),
            ),
          );
          cachedSkillsList = cleanSkills;
          setAvailableSkills(cleanSkills);
        }
      })
      .catch((err) => {
        console.error("Skills fetch error:", err);
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setSkills([]);
    setSkillInput("");
    setIsDropdownOpen(false);
    reset();
  };

  const handleAddSkill = (skillName: string) => {
    const trimmed = skillName.trim();
    if (!trimmed) return;

    if (skills.includes(trimmed)) {
      setSkillInput("");
      setIsDropdownOpen(false);
      return;
    }

    const isExisting = availableSkills.some(
      (s) => s.toLowerCase() === trimmed.toLowerCase(),
    );

    setSkills((prev) => Array.from(new Set([...prev, trimmed])));
    setSkillInput("");
    setIsDropdownOpen(false);

    if (!isExisting) {
      toast.add({
        type: "info",
        description: `"${trimmed}" maxsus (custom) ko'nikma sifatida qo'shildi va moderatorlar tomonidan tekshiriladi.`,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (skillInput.trim()) {
        handleAddSkill(skillInput);
      }
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Faqat foydalanuvchi yozganda ishlaydigan search filtratsiyasi
  const searchQuery = skillInput.trim().toLowerCase();
  const filteredSkills = searchQuery
    ? availableSkills.filter(
        (s) => s.toLowerCase().includes(searchQuery) && !skills.includes(s),
      )
    : [];

  // Dropdown faqat foydalanuvchi matn kiritgandagina va dropdown ochiq bo'lsa ko'rinadi
  const showDropdown = isDropdownOpen && searchQuery.length > 0;

  const onSubmit = async (data: IVacancy) => {
    try {
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

      const res = await api.post("/vacancy/create", payload);
      if (res.data.success) {
        toast.add({
          type: "success",
          description: res.data.message,
        });
      }
    } catch (error: any) {
      console.error(error);
      toast.add({
        type: "error",
        description: error.response.data.message,
        priority: "high",
      });
    } finally {
      handleClose();
    }
  };

  return (
    <>
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

        <div className={`mt-4 pt-4 gap-2 border-t border-border dark:border-zinc-800 flex justify-between ${className}`}>
          <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-zinc-400">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Tezkor e'lon berish va nomzodlarni jalb qilish</span>
          </div>

          <Button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Vakansiya yaratish</span>
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-background dark:bg-zinc-900 border border-border dark:border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border dark:border-zinc-800 flex items-center justify-between bg-muted/30 dark:bg-zinc-800/30">
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="font-semibold text-lg text-foreground dark:text-zinc-100">
                  Yangi vakansiya e'lon qilish
                </h2>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex-1 overflow-y-auto p-6 space-y-5"
            >
              <div>
                <label className="block text-xs font-semibold text-foreground dark:text-zinc-200 mb-1.5">
                  Vakansiya nomi <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Masalan: Senior Frontend Engineer (React/Next.js)"
                  {...register("title", {
                    required: "Vakansiya nomini kiriting",
                  })}
                  className="w-full"
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground dark:text-zinc-200 mb-1.5">
                    Bandlik turi (Employment Type)
                  </label>
                  <Controller
                    name="employmentType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Bandlik turini tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FULL_TIME">
                            To'liq stavka (Full-time)
                          </SelectItem>
                          <SelectItem value="PART_TIME">
                            Yarim stavka (Part-time)
                          </SelectItem>
                          <SelectItem value="CONTRACT">
                            Shartnoma asosida (Contract)
                          </SelectItem>
                          <SelectItem value="INTERN">
                            Stajirovka (Intern)
                          </SelectItem>
                          <SelectItem value="FREELANCE">
                            Frilans (Freelance)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground dark:text-zinc-200 mb-1.5">
                    Ish tartibi (Location Type)
                  </label>
                  <Controller
                    name="locationType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Ish tartibini tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ON_SITE">
                            Ofisda (On-site)
                          </SelectItem>
                          <SelectItem value="HYBRID">
                            Gibrid (Hybrid)
                          </SelectItem>
                          <SelectItem value="REMOTE">
                            Masofaviy (Remote)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground dark:text-zinc-200 mb-1.5">
                    Joylashuv (Location)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-3 text-muted-foreground z-10" />
                    <Input
                      type="text"
                      placeholder="Toshkent, O'zbekiston"
                      {...register("location")}
                      className="w-full pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground dark:text-zinc-200 mb-1.5">
                    Tajriba darajasi (Experience Level)
                  </label>
                  <Controller
                    name="experienceLevel"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Darajani tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="JUNIOR">Junior</SelectItem>
                          <SelectItem value="MIDDLE">Middle</SelectItem>
                          <SelectItem value="SENIOR">Senior</SelectItem>
                          <SelectItem value="EXPERT">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

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
                    <Input
                      type="number"
                      placeholder="1000"
                      {...register("salary.min")}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] text-muted-foreground mb-1">
                      Max maosh
                    </span>
                    <Input
                      type="number"
                      placeholder="2500"
                      {...register("salary.max")}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] text-muted-foreground mb-1">
                      Valyuta
                    </span>
                    <Controller
                      name="salary.currency"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Valyuta" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="UZS">UZS (so'm)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="RUB">RUB (₽)</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] text-muted-foreground mb-1">
                      Davriyligi
                    </span>
                    <Controller
                      name="salary.period"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Davr" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Oylik</SelectItem>
                            <SelectItem value="yearly">Yillik</SelectItem>
                            <SelectItem value="hourly">Soatbay</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Search & Custom Skill Input */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-xs font-semibold text-foreground dark:text-zinc-200 mb-1.5">
                  Talab qilinadigan ko'nikmalar (Skills)
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground z-10" />
                  <Input
                    type="text"
                    value={skillInput}
                    onChange={(e) => {
                      setSkillInput(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Ko'nikma nomini yozing (masalan: React, Node.js)..."
                    className="w-full pl-9 pr-20"
                  />
                  {skillInput.trim() && (
                    <Button
                      type="button"
                      onClick={() => handleAddSkill(skillInput)}
                      variant="ghost"
                      className="absolute right-1 top-1 h-8 px-3 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                    >
                      Qo'shish
                    </Button>
                  )}
                </div>

                {/* Dropdown: Faqat foydalanuvchi matn kiritganidagina chiqadi */}
                {showDropdown && (
                  <div className="absolute left-0 right-0 mt-1 max-h-52 overflow-y-auto bg-card dark:bg-zinc-900 border border-border dark:border-zinc-800 rounded-xl shadow-lg z-50 p-1 space-y-0.5">
                    {filteredSkills.map((skill, index) => (
                      <button
                        key={`${skill}-${index}`}
                        type="button"
                        onClick={() => handleAddSkill(skill)}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-foreground dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors flex items-center justify-between"
                      >
                        <span>{skill}</span>
                        <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    ))}

                    {/* Agar kiritilgan matn mavjud bazada bo'lmasa, custom sifatida qo'shish imkoniyati */}
                    {!availableSkills.some(
                      (s) =>
                        s.toLowerCase() === skillInput.trim().toLowerCase(),
                    ) && (
                      <button
                        type="button"
                        onClick={() => handleAddSkill(skillInput)}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors flex items-center justify-between"
                      >
                        <span>
                          "{skillInput.trim()}" maxsus skill sifatida qo'shish
                        </span>
                        <Plus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      </button>
                    )}
                  </div>
                )}

                {/* Tanlangan Skill'lar ro'yxati */}
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2.5">
                    {skills.map((skill, index) => (
                      <span
                        key={`selected-${skill}-${index}`}
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

              <div>
                <label className="block text-xs font-semibold text-foreground dark:text-zinc-200 mb-1.5">
                  Vakansiya tavsifi va talablar (Description){" "}
                  <span className="text-red-500">*</span>
                </label>
                <Textarea
                  rows={4}
                  placeholder="Loyiha haqida, nomzoddan kutilayotgan asosiy vazifalar va sharoitlar..."
                  {...register("description", {
                    required: "Tavsif yozishingiz shart",
                  })}
                  className="w-full resize-y"
                />
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-border dark:border-zinc-800 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  className="text-sm font-medium"
                >
                  Bekor qilish
                </Button>
                <Button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all active:scale-[0.98]"
                >
                  <BadgeCheck className="w-4 h-4" />
                  <span>Chop etish (Submit)</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
