"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Bookmark, Users, Newspaper, Calendar } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IUser, IExperience } from "@/types";

interface AddExperienceProps {
  user?: Partial<IUser>;
}

export default function AddExperience({ user }: AddExperienceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !position.trim() || !startDate) return;

    setLoading(true);

    const experienceData: IExperience = {
      company: company.trim(),
      position: position.trim(),
      startDate: new Date(startDate),
      endDate: currentlyWorking || !endDate ? new Date() : new Date(endDate),
      description: description.trim(),
    };

    console.log("Yig'ilgan Experience Ma'lumotlari:", experienceData);

    // Formani tozalash va modalni yopish
    setCompany("");
    setPosition("");
    setStartDate("");
    setEndDate("");
    setCurrentlyWorking(false);
    setDescription("");
    setLoading(false);
    setIsOpen(false);
  };

  const displayName =
    `${user?.firstName || "Javohir"} ${user?.lastName || "Xamdamboyev"}`.trim();
  const displayFallback = user?.firstName?.charAt(0).toUpperCase() || "J";

  return (
    <div className="w-[18%] max-w-xs sm:max-w-sm flex flex-col gap-2 text-white font-sans">
      {/* Profile Sidebar Card */}
      <div className="bg-[#1d2226] border border-[#38434f] rounded-xl overflow-hidden">
        {/* Top Banner (Next Image) */}
        <div className="h-14 bg-linear-to-r from-slate-800 to-slate-900 relative w-full overflow-hidden">
          {user?.backgroundImage && (
            <Image
              src={user.backgroundImage}
              alt="Banner"
              fill
              unoptimized
              className="object-cover"
            />
          )}
        </div>

        {/* Profile Info & Avatar (Next Image) */}
        <div className="px-4 pb-4 pt-0 relative flex flex-col items-start">
          <div className="relative h-16 w-16 -mt-8 mb-2 rounded-full overflow-hidden border-2 border-[#1d2226] ring-2 ring-[#05b472]/40 bg-[#0a66c2] flex items-center justify-center shrink-0">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={displayName}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-lg">
                {displayFallback}
              </span>
            )}
          </div>

          <h2 className="font-bold text-base hover:underline cursor-pointer leading-tight text-gray-100">
            {displayName}
          </h2>
          <p className="text-xs text-gray-300 mt-1 leading-snug">
            {user?.job || "Студент(ка) в уч. заведении IT Park University"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {user?.company || "Tashkent"}
          </p>

          {/* + Experience Button */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-full mt-3 py-1.5 px-3 border border-dashed border-[#5e6063] hover:border-gray-300 hover:bg-[#282c31] rounded-md text-xs font-semibold text-gray-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Experience</span>
          </button>
        </div>
      </div>

      {/* Static Premium CTA */}
      <div className="bg-[#1d2226] border border-[#38434f] rounded-xl p-3 text-xs space-y-1">
        <p className="text-gray-400">Gain exclusive tools & insights</p>
        <button
          type="button"
          className="flex items-center gap-1.5 font-bold text-gray-200 hover:text-[#0a66c2] transition-colors cursor-pointer"
        >
          <span className="w-3 h-3 bg-[#c37d16] rounded-xs inline-block" />
          Redeem Premium for €0
        </button>
      </div>

      {/* Static Analytics */}
      <div className="bg-[#1d2226] border border-[#38434f] rounded-xl p-3 text-xs space-y-2">
        <div className="flex justify-between items-center font-semibold text-gray-300">
          <span>Profile viewers</span>
          <span className="text-[#0a66c2]">18</span>
        </div>
        <p className="font-semibold text-gray-300 hover:underline cursor-pointer">
          View all analytics
        </p>
      </div>

      {/* Static Navigation Links */}
      <div className="bg-[#1d2226] border border-[#38434f] rounded-xl p-2 text-xs space-y-1">
        <button
          type="button"
          className="w-full flex items-center gap-3 p-2 hover:bg-[#282c31] rounded-lg text-gray-300 font-semibold transition-colors"
        >
          <Bookmark className="h-4 w-4 text-gray-400" />
          <span>Saved items</span>
        </button>
        <button
          type="button"
          className="w-full flex items-center gap-3 p-2 hover:bg-[#282c31] rounded-lg text-gray-300 font-semibold transition-colors"
        >
          <Users className="h-4 w-4 text-gray-400" />
          <span>Groups</span>
        </button>
        <button
          type="button"
          className="w-full flex items-center gap-3 p-2 hover:bg-[#282c31] rounded-lg text-gray-300 font-semibold transition-colors"
        >
          <Newspaper className="h-4 w-4 text-gray-400" />
          <span>Newsletters</span>
        </button>
        <button
          type="button"
          className="w-full flex items-center gap-3 p-2 hover:bg-[#282c31] rounded-lg text-gray-300 font-semibold transition-colors"
        >
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>Events</span>
        </button>
      </div>

      {/* Add Experience Modal (Shadcn UI) */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg bg-[#1d2226] text-white border-[#38434f] p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b border-[#38434f] flex flex-row items-center justify-between space-y-0">
            <DialogTitle className="text-lg font-bold text-gray-100">
              Add a role to your profile
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSave}
            className="p-4 space-y-4 max-h-[75vh] overflow-y-auto"
          >
            {/* Position */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300">
                Job title<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Example: Senior Product Manager"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full bg-[#1d2226] border border-[#4d555e] rounded-lg p-2.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#0a66c2]"
              />
            </div>

            {/* Company */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300">
                Organization<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Example: Microsoft"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-[#1d2226] border border-[#4d555e] rounded-lg p-2.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#0a66c2]"
              />
            </div>

            {/* Currently work checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="currentlyWorking"
                checked={currentlyWorking}
                onChange={(e) => setCurrentlyWorking(e.target.checked)}
                className="h-4 w-4 rounded-sm bg-[#1d2226] border-[#4d555e] accent-[#05b472] cursor-pointer"
              />
              <label
                htmlFor="currentlyWorking"
                className="text-xs font-medium text-gray-300 cursor-pointer"
              >
                I currently work here
              </label>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300">
                  Start date<span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#1d2226] border border-[#4d555e] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#0a66c2] scheme-dark"
                />
              </div>

              {!currentlyWorking && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300">
                    End date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-[#1d2226] border border-[#4d555e] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#0a66c2] scheme-dark"
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-medium text-gray-300">
                Description / Highlights
              </label>
              <textarea
                rows={4}
                placeholder="Projects, problems you solved, or results you achieved..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#1d2226] border border-[#4d555e] rounded-lg p-2.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#0a66c2] resize-none"
              />
            </div>

            <div className="pt-3 border-t border-[#38434f] flex justify-end">
              <Button
                type="submit"
                disabled={
                  loading || !company.trim() || !position.trim() || !startDate
                }
                className="bg-[#0a66c2] hover:bg-[#084e96] text-white font-semibold px-5 py-1.5 rounded-full text-xs disabled:opacity-40 transition-all cursor-pointer"
              >
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
