"use client";

import { useRouter } from "next/navigation";
import { Briefcase, User, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Role() {
  const router = useRouter();

  const handleSelectRole = (role: "user" | "company") => {
    router.push(`/auth/role/login?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">
            Siz kim sifatida davom etmoqchisiz?
          </h1>

          <p className="text-muted-foreground mt-3 text-lg">
            Hisobingiz turini tanlang va davom eting
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card
            onClick={() => handleSelectRole("user")}
            className="group cursor-pointer border-2 transition-all duration-300 hover:border-primary hover:shadow-xl hover:-translate-y-1"
          >
            <CardContent className="p-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <User className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-2xl font-bold mb-3">Men ish qidiruvchiman</h2>

              <p className="text-muted-foreground mb-6">
                Vakansiyalarni ko'ring, kompaniyalarga murojaat qiling va
                professional profilingizni yarating.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm">
                  ✅ Ish topish
                </li>
                <li className="flex items-center gap-2 text-sm">
                  ✅ Resume yaratish
                </li>
                <li className="flex items-center gap-2 text-sm">
                  ✅ Kompaniyalar bilan bog'lanish
                </li>
              </ul>

              <Button
                className="w-full group-hover:bg-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectRole("user");
                }}
              >
                Davom etish
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* COMPANY CARD */}
          <Card
            onClick={() => handleSelectRole("company")}
            className="group cursor-pointer border-2 transition-all duration-300 hover:border-primary hover:shadow-xl hover:-translate-y-1"
          >
            <CardContent className="p-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Briefcase className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-2xl font-bold mb-3">Men kompaniyaman</h2>

              <p className="text-muted-foreground mb-6">
                Vakansiyalar joylang, nomzodlarni qidiring va jamoangizni
                kengaytiring.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm">
                  ✅ Vakansiya yaratish
                </li>
                <li className="flex items-center gap-2 text-sm">
                  ✅ Nomzodlarni boshqarish
                </li>
                <li className="flex items-center gap-2 text-sm">
                  ✅ Recruiting dashboard
                </li>
              </ul>

              <Button
                className="w-full group-hover:bg-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectRole("company");
                }}
              >
                Davom etish
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Keyingi bosqichda login yoki ro'yxatdan o'tish imkoniyati beriladi.
        </p>
      </div>
    </div>
  );
}
