"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Calendar,
  Newspaper,
  Image as ImageIcon,
  Smile,
  Award,
  X,
  Eye,
  MessageSquare,
  ChevronDown,
  Upload,
  Building2,
  Globe,
  Users,
  UserCheck,
  Briefcase,
  BarChart2,
  FileText,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/https";
import { AuthAccount } from "@/lib/request.server";
import { IUser, ICompany } from "@/types";

interface StartAddPostProps {
  user?: AuthAccount;
}

export default function StartAddPost({ user }: StartAddPostProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");

  // Image states
  const [imageUrl, setImageUrl] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);

  // Dropdowns states
  const [showAudienceMenu, setShowAudienceMenu] = useState(false);
  const [showCommentMenu, setShowCommentMenu] = useState(false);

  // Settings
  const [audience, setAudience] = useState<"anyone" | "connections" | "group">(
    "anyone",
  );
  const [comments, setComments] = useState<"anyone" | "connections" | "off">(
    "anyone",
  );
  const [brandPartnership, setBrandPartnership] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isCompany = user?.role === "company";
  const userAccount = user as IUser;
  const companyAccount = user as ICompany;

  const displayName = isCompany
    ? companyAccount?.companyName || "Company"
    : `${userAccount?.firstName || ""} ${userAccount?.lastName || ""}`.trim() ||
      "User";

  const avatarSrc = isCompany ? companyAccount?.logo : userAccount?.avatar;
  const displayFallback = isCompany
    ? companyAccount?.companyName?.charAt(0)?.toUpperCase() || "C"
    : userAccount?.firstName?.charAt(0)?.toUpperCase() || "U";

  // Fayldan rasm tanlanganda
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        setShowImageInput(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // URL kiritib Enter bosilganda
  const handleUrlKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputUrl.trim()) {
        setImageUrl(inputUrl.trim());
        setShowImageInput(false);
        setInputUrl("");
      }
    }
  };

  const clearImage = () => {
    setImageUrl("");
    setInputUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Post yaratish va ma'lumotlarni yuborish
  const handleSubmit = async () => {
    if (!content.trim() && !imageUrl) return;

    setLoading(true);

    // Yuboriladigan barcha ma'lumotlar bitta o'zgaruvchida
    const postData = {
      authorModel: isCompany ? "Company" : "User",
      content: content.trim(),
      imageUrl: imageUrl.trim() ? imageUrl.trim() : "",
    };

    try {
      console.log("Post ma'lumotlari:", postData);
      // await api.post("/posts", postData);
      // setContent("");
      // clearImage();
      // setIsOpen(false);
    } catch (error) {
      console.error("Post yaratishda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#1d2226] border border-[#38434f] rounded-xl p-3 md:p-4 mb-4 text-white">
      {/* Top Section */}
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 border border-[#38434f] shrink-0">
          <AvatarImage
            src={avatarSrc}
            alt={displayName}
            className="object-cover"
          />
          <AvatarFallback className="bg-[#0a66c2] text-white font-semibold">
            {isCompany ? <Building2 className="h-5 w-5" /> : displayFallback}
          </AvatarFallback>
        </Avatar>

        {/* Faqat ushbu tugma modalni ochadi */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex-1 text-left bg-transparent hover:bg-[#282c31] border border-[#5e6063] rounded-full px-4 py-3 text-sm font-medium text-gray-300 transition-all cursor-pointer"
        >
          Start a post
        </button>
      </div>

      {/* Pastki tugmalar (Modalni ochmaydi) */}
      <div className="flex items-center justify-around md:justify-start md:gap-12 mt-3 pt-2 border-t border-[#38434f]/50">
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-2 hover:bg-[#282c31] rounded-lg transition-colors cursor-pointer text-xs md:text-sm font-semibold text-gray-300"
        >
          <Calendar className="h-5 w-5 text-[#c37d16]" />
          <span>Event</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-2 px-3 py-2 hover:bg-[#282c31] rounded-lg transition-colors cursor-pointer text-xs md:text-sm font-semibold text-gray-300"
        >
          <Newspaper className="h-5 w-5 text-[#e06847]" />
          <span>Write article</span>
        </button>
      </div>

      {/* Shadcn UI Dialog Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl bg-[#1d2226] text-white border-[#38434f] p-0 overflow-visible gap-0">
          {/* Header */}
          <DialogHeader className="p-4 border-b border-[#38434f] flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border border-[#38434f]">
                <AvatarImage
                  src={avatarSrc}
                  alt={displayName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-[#0a66c2] text-white font-semibold">
                  {displayFallback}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-1 relative">
                <DialogTitle className="text-base font-semibold text-left">
                  {displayName}
                </DialogTitle>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Who can see your post - Dropdown Trigger */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAudienceMenu(!showAudienceMenu);
                        setShowCommentMenu(false);
                      }}
                      className="flex items-center gap-1.5 bg-[#282c31] hover:bg-[#34383e] px-3 py-1 rounded-full font-medium text-gray-200 border border-[#4d555e] transition-colors cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>
                        {audience === "anyone"
                          ? "Post to Anyone"
                          : audience === "connections"
                            ? "Connections only"
                            : "Group"}
                      </span>
                      <ChevronDown className="h-3 w-3" />
                    </button>

                    {/* Audience Dropdown Menu */}
                    {showAudienceMenu && (
                      <div className="absolute top-full left-0 mt-2 w-72 bg-[#1d2226] border border-[#38434f] rounded-xl p-4 shadow-2xl z-50 text-white space-y-3">
                        <h4 className="font-bold text-sm text-gray-100">
                          Who can see your post?
                        </h4>

                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={() => {
                              setAudience("anyone");
                              setShowAudienceMenu(false);
                            }}
                            className="w-full flex items-center justify-between p-2 hover:bg-[#282c31] rounded-lg transition-colors text-left"
                          >
                            <div className="flex items-center gap-2.5">
                              <Globe className="h-5 w-5 text-gray-300" />
                              <div>
                                <p className="text-xs font-semibold">Anyone</p>
                                <p className="text-[10px] text-gray-400">
                                  Anyone on or off LinkedIn
                                </p>
                              </div>
                            </div>
                            <input
                              type="radio"
                              checked={audience === "anyone"}
                              readOnly
                              className="accent-[#05b472]"
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setAudience("connections");
                              setShowAudienceMenu(false);
                            }}
                            className="w-full flex items-center justify-between p-2 hover:bg-[#282c31] rounded-lg transition-colors text-left"
                          >
                            <div className="flex items-center gap-2.5">
                              <UserCheck className="h-5 w-5 text-gray-300" />
                              <p className="text-xs font-semibold">
                                Connections only
                              </p>
                            </div>
                            <input
                              type="radio"
                              checked={audience === "connections"}
                              readOnly
                              className="accent-[#05b472]"
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setAudience("group");
                              setShowAudienceMenu(false);
                            }}
                            className="w-full flex items-center justify-between p-2 hover:bg-[#282c31] rounded-lg transition-colors text-left"
                          >
                            <div className="flex items-center gap-2.5">
                              <Users className="h-5 w-5 text-gray-300" />
                              <p className="text-xs font-semibold">Group</p>
                            </div>
                            <input
                              type="radio"
                              checked={audience === "group"}
                              readOnly
                              className="accent-[#05b472]"
                            />
                          </button>
                        </div>

                        <div className="pt-2 border-t border-[#38434f] flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-xs">
                              Brand Partnership
                            </p>
                            <span className="text-[10px] text-[#70b5f9]">
                              Learn more
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setBrandPartnership(!brandPartnership)
                            }
                            className={`w-10 h-5 rounded-full transition-colors relative ${brandPartnership ? "bg-[#05b472]" : "bg-gray-600"}`}
                          >
                            <span
                              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${brandPartnership ? "translate-x-5" : ""}`}
                            />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Comment Settings - Dropdown Trigger */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCommentMenu(!showCommentMenu);
                        setShowAudienceMenu(false);
                      }}
                      className="flex items-center gap-1.5 bg-[#282c31] hover:bg-[#34383e] px-3 py-1 rounded-full font-medium text-gray-200 border border-[#4d555e] transition-colors cursor-pointer"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>
                        Comments:{" "}
                        {comments === "anyone"
                          ? "Anyone"
                          : comments === "connections"
                            ? "Connections"
                            : "Off"}
                      </span>
                      <ChevronDown className="h-3 w-3" />
                    </button>

                    {/* Comment Dropdown Menu */}
                    {showCommentMenu && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-[#1d2226] border border-[#38434f] rounded-xl p-4 shadow-2xl z-50 text-white space-y-3">
                        <h4 className="font-bold text-sm text-gray-100">
                          Comment settings
                        </h4>

                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={() => {
                              setComments("anyone");
                              setShowCommentMenu(false);
                            }}
                            className="w-full flex items-center justify-between p-2 hover:bg-[#282c31] rounded-lg transition-colors text-left"
                          >
                            <div className="flex items-center gap-2.5">
                              <Globe className="h-5 w-5 text-gray-300" />
                              <p className="text-xs font-semibold">Anyone</p>
                            </div>
                            <input
                              type="radio"
                              checked={comments === "anyone"}
                              readOnly
                              className="accent-[#05b472]"
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setComments("connections");
                              setShowCommentMenu(false);
                            }}
                            className="w-full flex items-center justify-between p-2 hover:bg-[#282c31] rounded-lg transition-colors text-left"
                          >
                            <div className="flex items-center gap-2.5">
                              <UserCheck className="h-5 w-5 text-gray-300" />
                              <p className="text-xs font-semibold">
                                Connections only
                              </p>
                            </div>
                            <input
                              type="radio"
                              checked={comments === "connections"}
                              readOnly
                              className="accent-[#05b472]"
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setComments("off");
                              setShowCommentMenu(false);
                            }}
                            className="w-full flex items-center justify-between p-2 hover:bg-[#282c31] rounded-lg transition-colors text-left"
                          >
                            <div className="flex items-center gap-2.5">
                              <X className="h-5 w-5 text-gray-300" />
                              <p className="text-xs font-semibold">Off</p>
                            </div>
                            <input
                              type="radio"
                              checked={comments === "off"}
                              readOnly
                              className="accent-[#05b472]"
                            />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Modal Content Body */}
          <div className="p-4 overflow-y-auto max-h-[50vh] space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts ..."
              className="w-full min-h-35 bg-transparent text-base focus:outline-none resize-none placeholder:text-gray-400 text-white"
            />

            {/* Rasm manbasi bo'limi */}
            {showImageInput && !imageUrl && (
              <div className="border border-[#38434f] bg-[#282c31] p-3 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-[#38434f] pb-2">
                  <span className="text-xs font-semibold text-gray-300">
                    Rasm qo'shish
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowImageInput(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-[#1d2226] border-[#4d555e] text-xs h-9"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-3.5 w-3.5 mr-1.5" /> Tizim xotirasidan
                    tanlash
                  </Button>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="URL kiriting va Enter tugmasini bosing..."
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      onKeyDown={handleUrlKeyDown}
                      className="w-full bg-[#1d2226] border border-[#4d555e] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#0a66c2]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Next.js Image orqali preview */}
            {imageUrl && (
              <div className="relative w-full h-72 rounded-xl overflow-hidden border border-[#38434f] bg-black/40">
                <Image
                  src={imageUrl}
                  alt="Post attachment"
                  fill
                  unoptimized
                  className="object-contain"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-1.5 bg-black/80 text-white rounded-full hover:bg-black transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Footer Toolbar */}
          <div className="p-3 border-t border-[#38434f] flex items-center justify-between bg-[#1d2226]">
            <div className="flex items-center gap-1 text-gray-400">
              <button
                type="button"
                className="p-2 hover:bg-[#282c31] rounded-full hover:text-white transition-colors cursor-pointer"
              >
                <Smile className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => setShowImageInput(!showImageInput)}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  showImageInput || imageUrl
                    ? "text-[#0a66c2] bg-[#282c31]"
                    : "hover:bg-[#282c31] hover:text-white"
                }`}
              >
                <ImageIcon className="h-5 w-5" />
              </button>

              <button
                type="button"
                className="p-2 hover:bg-[#282c31] rounded-full hover:text-white transition-colors cursor-pointer"
              >
                <Award className="h-5 w-5" />
              </button>

              <button
                type="button"
                className="p-2 hover:bg-[#282c31] rounded-full hover:text-white transition-colors cursor-pointer"
              >
                <Calendar className="h-5 w-5" />
              </button>

              <button
                type="button"
                className="p-2 hover:bg-[#282c31] rounded-full hover:text-white transition-colors cursor-pointer"
              >
                <Briefcase className="h-5 w-5" />
              </button>

              <button
                type="button"
                className="p-2 hover:bg-[#282c31] rounded-full hover:text-white transition-colors cursor-pointer"
              >
                <BarChart2 className="h-5 w-5" />
              </button>

              <button
                type="button"
                className="p-2 hover:bg-[#282c31] rounded-full hover:text-white transition-colors cursor-pointer"
              >
                <FileText className="h-5 w-5" />
              </button>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={(!content.trim() && !imageUrl) || loading}
              className="bg-[#0a66c2] hover:bg-[#084e96] text-white font-semibold px-5 py-1.5 rounded-full disabled:opacity-40 transition-all cursor-pointer"
            >
              {loading ? "Posting..." : "Post"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
