"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  DollarSign,
  Clock,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  ChevronRight,
  Briefcase,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import { api } from "@/lib/https";
import { IVacancy } from "@/types";
import { Input } from "@/components/ui/input";

export default function JobsPage() {
  const router = useRouter();

  // Barcha vakansiyalar
  const [vacancies, setVacancies] = useState<IVacancy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  // Inputlardagi vaqtinchalik (form) qiymatlari
  const [searchInput, setSearchInput] = useState("");
  const [selectedTypeInput, setSelectedTypeInput] = useState<string>("ALL");
  const [minSalaryInput, setMinSalaryInput] = useState<string>("");
  const [selectedCurrencyInput, setSelectedCurrencyInput] =
    useState<string>("ALL");

  // Haqiqiy qidiruv uchun qo'llaniladigan (applied) qiymatlar
  const [appliedFilters, setAppliedFilters] = useState({
    searchQuery: "",
    selectedType: "ALL",
    minSalary: "",
    selectedCurrency: "ALL",
  });

  const fetchVacancies = async () => {
    try {
      setLoading(true);
      const res = await api.get("/vacancy/all");
      const data = res.data?.vacancy || res.data?.vacancies;
      setVacancies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Vakansiyalarni yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchVacancies();
  }, []);

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

  // Qidiruv va Filtrlashni qo'llash (Enter yoki Qidiruv tugmasi bosilganda)
  const handleApplyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAppliedFilters({
      searchQuery: searchInput,
      selectedType: selectedTypeInput,
      minSalary: minSalaryInput,
      selectedCurrency: selectedCurrencyInput,
    });
  };

  // Filtrlarni tozalash
  const handleResetFilters = () => {
    setSearchInput("");
    setSelectedTypeInput("ALL");
    setMinSalaryInput("");
    setSelectedCurrencyInput("ALL");

    setAppliedFilters({
      searchQuery: "",
      selectedType: "ALL",
      minSalary: "",
      selectedCurrency: "ALL",
    });
  };

  // Qidiruv natijalarini filtrlash
  const filteredVacancies = useMemo(() => {
    const { searchQuery, selectedType, minSalary, selectedCurrency } =
      appliedFilters;

    return vacancies.filter((item) => {
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
  }, [vacancies, appliedFilters]);
  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border dark:border-zinc-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
              <Briefcase className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground dark:text-zinc-100">
              Mavjud Ish O'rinlari
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground dark:text-zinc-400 pl-1">
            O'zingizga mos keladigan vakansiyalarni izlang va arizalaringizni
            topshiring.
          </p>
        </div>

        {/* Saqlanganlar indikatori */}
        <div className="text-xs text-muted-foreground flex items-center gap-1.5 self-end sm:self-auto bg-card dark:bg-zinc-900 border border-border dark:border-zinc-800 px-3 py-2 rounded-xl">
          <Bookmark className="w-4 h-4 text-amber-500" />
          <span>
            Saqlanganlar:{" "}
            <strong className="text-foreground">{savedIds.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter va Qidiruv Formasi (Enter yoki Tugma orqali ishlaydi) */}
      <form
        onSubmit={handleApplyFilters}
        className="bg-card dark:bg-zinc-900 p-4 border border-border dark:border-zinc-800 rounded-2xl shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-500" />
            <span>Qidiruv Filtrlari</span>
          </div>

          {(searchInput ||
            selectedTypeInput !== "ALL" ||
            minSalaryInput ||
            selectedCurrencyInput !== "ALL") && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs text-rose-500 hover:underline font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Filtrlarni tozalash
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Nomi yoki ko'nikmalar..."
              className="pl-9 w-full bg-background dark:bg-zinc-950 text-xs sm:text-sm"
            />
          </div>

          {/* Employment Type */}
          <select
            value={selectedTypeInput}
            onChange={(e) => setSelectedTypeInput(e.target.value)}
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
              value={minSalaryInput}
              onChange={(e) => setMinSalaryInput(e.target.value)}
              placeholder="Min. maosh miqdori"
              className="pl-9 w-full bg-background dark:bg-zinc-950 text-xs sm:text-sm"
            />
          </div>

          {/* Currency Filter */}
          <select
            value={selectedCurrencyInput}
            onChange={(e) => setSelectedCurrencyInput(e.target.value)}
            className="w-full text-xs sm:text-sm bg-background dark:bg-zinc-950 border border-input dark:border-zinc-800 rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Barcha valyutalar</option>
            <option value="UZS">UZS (So'm)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>

        {/* Action Trigger Button */}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all duration-200"
          >
            <Search className="w-4 h-4" />
            <span>Qidirish</span>
          </button>
        </div>
      </form>

      {/* Vacancy Cards Grid */}
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
      ) : filteredVacancies.length === 0 ? (
        <div className="p-12 text-center bg-card dark:bg-zinc-900 border border-border dark:border-zinc-800 rounded-2xl space-y-3">
          <Sparkles className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="font-semibold text-base text-foreground">
            Siz kiritgan parametrlar bo'yicha vakansiyalar topilmadi
          </h3>
          <p className="text-xs text-muted-foreground">
            Filtrlarni o'zgartirib qayta "Qidirish" tugmasini bosing.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVacancies.map((item) => {
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

                    {/* Bookmark Button */}
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
                  </div>

                  {/* Salary Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-semibold">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{formatSalary(item.salary)}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground dark:text-zinc-400 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Footer & Skills */}
                <div className="pt-3 border-t border-border dark:border-zinc-800 space-y-3">
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
      )}
    </div>
  );
}
