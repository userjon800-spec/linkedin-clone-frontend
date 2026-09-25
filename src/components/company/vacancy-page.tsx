"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Bookmark,
  BookmarkCheck,
  Building2,
  Users,
  Layers,
  Sparkles,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { api } from "@/lib/https";
import { IVacancy } from "@/types";
import VacancyCreateModal from "@/components/company/vacancy-create-modal";
import { Input } from "@/components/ui/input";

type TabType = "all" | "my" | "candidates";

export default function VacancyPage({ role }: { role: "company" | "user" }) {
  const router = useRouter();
  const [neVacancies, setNeVacancies] = useState<IVacancy[]>([]);
  const [vacancies, setVacancies] = useState<IVacancy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabType>("all");

  // Qidiruv va filtrlar
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [minSalary, setMinSalary] = useState<string>("");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("ALL");
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchVacancies();
  }, []);

  const fetchVacancies = async () => {
    try {
      setLoading(true);
      const res = await api.get("/vacancy/vacancies");
      const neData = res.data?.neVacancy || res.data?.vacancies;
      const data = res.data?.vacancy || res.data?.vacancies;
      setNeVacancies(Array.isArray(neData) ? neData : []);
      setVacancies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Vakansiyalarni yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  // Saqlash (Bookmark) toggle
  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };
  // Maoshni formatlash
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

  // Filtrlash funksiyasi
  const filterList = (list: IVacancy[]) => {
    return list.filter((item) => {
      const titleMatch = item.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const descMatch = item.description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const skillMatch = item.skills?.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      const matchesSearch = titleMatch || descMatch || skillMatch;
      const matchesType =
        selectedType === "ALL" || item.employmentType === selectedType;

      // Maosh va Valyuta bo'yicha filtr
      const salaryAmount = item.salary?.min || item.salary?.max || 0;
      const matchesMinSalary = minSalary
        ? salaryAmount >= Number(minSalary)
        : true;
      const matchesCurrency =
        selectedCurrency === "ALL" ||
        item.salary?.currency === selectedCurrency;

      return (
        matchesSearch && matchesType && matchesMinSalary && matchesCurrency
      );
    });
  };

  const filteredNeVacancies = useMemo(
    () => filterList(neVacancies),
    [neVacancies, searchQuery, selectedType, minSalary, selectedCurrency],
  );

  const filteredMyVacancies = useMemo(
    () => filterList(vacancies),
    [vacancies, searchQuery, selectedType, minSalary, selectedCurrency],
  );

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Header Section - Modaldan ajratilgan yengil stil */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border dark:border-zinc-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
              <Briefcase className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground dark:text-zinc-100">
              Vakansiyalar Markazi
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground dark:text-zinc-400 pl-1">
            Mavjud vakansiyalarni ko'ring, arizalarni boshqaring va e'lonlar
            joylang.
          </p>
        </div>

        {/* Modal Trigger - Alohida ajratilgan Action block */}
        <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
          <VacancyCreateModal />
        </div>
      </div>

      {/* 2. Custom Tabs & Nav Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-border dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("all")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === "all"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-muted-foreground hover:bg-muted dark:hover:bg-zinc-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Barcha vakansiyalar</span>
            <span className="ml-1 px-2 py-0.5 text-[10px] rounded-full bg-white/20 dark:bg-zinc-800 font-bold">
              {neVacancies.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("my")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === "my"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-muted-foreground hover:bg-muted dark:hover:bg-zinc-800"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Mening vakansiyalarim</span>
            <span className="ml-1 px-2 py-0.5 text-[10px] rounded-full bg-white/20 dark:bg-zinc-800 font-bold">
              {vacancies.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("candidates")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === "candidates"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-muted-foreground hover:bg-muted dark:hover:bg-zinc-800"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Nomzodlar (Candidates)</span>
          </button>
        </div>

        {/* Saved Count Indicator */}
        {role !== "company" && (
          <div className="text-xs text-muted-foreground flex items-center gap-1.5 self-end sm:self-auto">
            <Bookmark className="w-3.5 h-3.5 text-amber-500" />
            <span>
              Saqlanganlar:{" "}
              <strong className="text-foreground">{savedIds.length}</strong>
            </span>
          </div>
        )}
      </div>

      {/* 3. Kengaytirilgan Filter paneli (Qidiruv, Bandlik turi, Maosh va Valyuta) */}
      {(activeTab === "all" || activeTab === "my") && (
        <div className="bg-card dark:bg-zinc-900 p-4 border border-border dark:border-zinc-800 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-500" />
            <span>Filtrlash va izlash</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative lg:col-span-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nomi yoki ko'nikmalar..."
                className="pl-9 w-full bg-background dark:bg-zinc-950 text-xs sm:text-sm"
              />
            </div>

            {/* Employment Type */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full text-xs sm:text-sm bg-background dark:bg-zinc-950 border border-input dark:border-zinc-800 rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Barcha bandlik turlari</option>
              <option value="FULL_TIME">Full-Time (To'liq)</option>
              <option value="PART_TIME">Part-Time (Yarim)</option>
              <option value="REMOTE">Masofaviy (Remote)</option>
              <option value="CONTRACT">Shartnoma asosida</option>
            </select>

            {/* Min Salary Input */}
            <div className="relative">
              <DollarSign className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                type="number"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                placeholder="Min. maosh miqdori"
                className="pl-9 w-full bg-background dark:bg-zinc-950 text-xs sm:text-sm"
              />
            </div>

            {/* Currency Filter */}
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full text-xs sm:text-sm bg-background dark:bg-zinc-950 border border-input dark:border-zinc-800 rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Barcha valyutalar</option>
              <option value="UZS">UZS (So'm)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>
      )}

      {/* 4. Tab Contents */}
      {activeTab === "candidates" && (
        <div className="p-12 text-center bg-card dark:bg-zinc-900 border border-border dark:border-zinc-800 rounded-2xl space-y-3">
          <Users className="w-10 h-10 text-muted-foreground mx-auto" />
          <h3 className="font-semibold text-lg">Nomzodlar arizalari bo'limi</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Vakansiyalaringizga kelib tushgan barcha nomzodlar rezyumelari va
            statuslarini shu yerda boshqarishingiz mumkin.
          </p>
        </div>
      )}

      {/* 5. Vacancy Cards Grid Generator Component */}
      {(activeTab === "all" || activeTab === "my") && (
        <>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-card dark:bg-zinc-900 rounded-2xl border border-border dark:border-zinc-800 p-5 animate-pulse space-y-4"
                >
                  <div className="h-6 bg-muted rounded-md w-3/4" />
                  <div className="h-4 bg-muted rounded-md w-1/2" />
                  <div className="h-16 bg-muted rounded-md w-full" />
                  <div className="h-8 bg-muted rounded-md w-full" />
                </div>
              ))}
            </div>
          ) : (
            (() => {
              const currentDisplayList =
                activeTab === "all" ? filteredNeVacancies : filteredMyVacancies;

              if (currentDisplayList.length === 0) {
                return (
                  <div className="p-12 text-center bg-card dark:bg-zinc-900 border border-border dark:border-zinc-800 rounded-2xl space-y-3">
                    <Sparkles className="w-10 h-10 text-amber-500 mx-auto" />
                    <h3 className="font-semibold text-base text-foreground">
                      Hozircha mos vakansiyalar topilmadi
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Qidiruv parametrlarini o'zgartiring yoki yangi vakansiya
                      e'lon qiling.
                    </p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {currentDisplayList.map((item) => {
                    const vacancyId = (item as any)._id;
                    const isSaved = savedIds.includes(vacancyId);

                    return (
                      <div
                        key={vacancyId}
                        onClick={() => router.push(`/vacancy/${vacancyId}`)}
                        className="group bg-card dark:bg-zinc-900 border border-border dark:border-zinc-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 relative"
                      >
                        {/* Card Header */}
                        <div className="space-y-2.5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1 pr-6">
                              <h2 className="font-bold text-base text-foreground dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                                {item.title}
                              </h2>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {item.location || "O'zbekiston"}
                                </span>
                                <span>•</span>
                                <span className="uppercase text-[10px] font-semibold tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                                  {item.employmentType || "FULL_TIME"}
                                </span>
                              </div>
                            </div>

                            {/* Save Button */}
                            {role !== "company" && (
                              <button
                                type="button"
                                onClick={(e) => toggleSave(e, vacancyId)}
                                className="absolute top-5 right-5 p-1.5 text-muted-foreground hover:text-amber-500 rounded-lg transition-colors"
                              >
                                {isSaved ? (
                                  <BookmarkCheck className="w-5 h-5 text-amber-500 fill-amber-500" />
                                ) : (
                                  <Bookmark className="w-5 h-5" />
                                )}
                              </button>
                            )}
                          </div>

                          {/* Salary Badge */}
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-semibold">
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>{formatSalary(item.salary)}</span>
                          </div>

                          {/* Description Snippet */}
                          <p className="text-xs text-muted-foreground dark:text-zinc-400 line-clamp-3 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {/* Card Footer & Skills */}
                        <div className="pt-3 border-t border-border dark:border-zinc-800 space-y-3">
                          {/* Skills list */}
                          {item.skills && item.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {item.skills.slice(0, 3).map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] px-2 py-0.5 bg-muted dark:bg-zinc-800 text-foreground dark:text-zinc-300 rounded-md font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                              {item.skills.length > 3 && (
                                <span className="text-[10px] px-1.5 py-0.5 text-muted-foreground font-medium">
                                  +{item.skills.length - 3}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                            <span className="flex items-center gap-1 text-[11px]">
                              <Clock className="w-3 h-3" />
                              Yangi e'lon
                            </span>

                            <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform text-xs">
                              Batafsil
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()
          )}
        </>
      )}
    </div>
  );
}
