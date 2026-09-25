"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { api } from "@/lib/https";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { IConnection } from "@/types";
import { toast } from "../ui/toast";

export default function RequestedUser() {
  const [requests, setRequests] = useState<IConnection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/connections/get-req-connect");
      if (res.data?.success && Array.isArray(res.data.connections)) {
        setRequests(res.data.connections);
      }
    } catch (err) {
      console.error("Error fetching requested users:", err);
    } finally {
      setLoading(false);
    }
  };
  // Kelgan so'rovlarni yuklash
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRequests();
  }, []);
  // Qabul qilish (ACCEPTED) yoki Rad etish (REJECTED)
  const handleAction = async (
    connectionId: string,
    action: "ACCEPTED" | "REJECTED",
  ) => {
    try {
      setActionLoadingId(connectionId);

      // Dynamic route: /api/connections/[id] ga PUT request yuboramiz
      const res = await api.put(`/connections/result-connect/${connectionId}`, {
        status: action,
      });
      console.log(`${action} response:`, res.data);
      if (res.data?.success) {
        toast.add({
          type: "success",
          description: res.data.message,
        });
        router.refresh(); // So'rovni qabul qilgandan keyin sahifani yangilash
      } else {
        toast.add({
          type: "error",
          description: res.data.message,
          priority: "high",
        });
      }
      // Muvaffaqiyatli bajarilgach, ro'yxatdan o'sha so'rovni o'chirib tashlaymiz
      setRequests((prev) => prev.filter((item) => item._id !== connectionId));
    } catch (err) {
      console.error(`Error executing ${action}:`, err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // 1. Yuklanayotgan bo'lsa hech narsa ko'rsatmaslik (yoki kichik skelet)
  if (loading) return null;

  // 2. Agar kelgan so'rovlar bo'sh bo'lsa (requests.length === 0), komponent umuman ko'rinmaydi!
  if (!requests || requests.length === 0) return null;

  return (
    <div className="w-full bg-[#1b1f23] border border-[#38434f] rounded-xl overflow-hidden font-sans text-white mb-4">
      {/* Header: Invitations (count) & Show all */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#283240]">
        <h2 className="text-base font-semibold text-[#e8e6e3]">
          Invitations ({requests.length})
        </h2>
        <button
          type="button"
          className="text-sm font-semibold text-[#a0a6ac] hover:text-white transition-colors cursor-pointer"
        >
          Show all
        </button>
      </div>

      {/* Requests List */}
      <div className="divide-y divide-[#283240]">
        {requests.map((item) => {
          const sender = item.sender;
          const fullName =
            `${sender.firstName || ""} ${sender.lastName || ""}`.trim() ||
            "LinkedIn User";
          const jobTitle = sender.job || sender.bio || "Software Engineer";
          const avatarUrl = sender.avatar || "https://github.com/shadcn.png";
          const isProcessing = actionLoadingId === item._id;

          return (
            <div
              key={item._id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#22272c] transition-colors"
            >
              {/* Left: User Avatar & Info */}
              <div className="flex items-start gap-3">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border border-[#38434f] bg-[#283240] shrink-0">
                  <Image
                    src={avatarUrl}
                    alt={fullName}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col">
                  <h3 className="text-sm font-semibold text-white hover:underline cursor-pointer leading-tight">
                    {fullName}
                  </h3>
                  <p className="text-xs text-[#a0a6ac] mt-0.5 line-clamp-2 leading-relaxed">
                    {jobTitle}
                  </p>

                  {/* Mutual Connections indicator (Rasmdagidek) */}
                  <div className="flex items-center gap-1.5 text-[11px] text-[#a0a6ac] mt-1.5">
                    <div className="w-4 h-4 rounded-full bg-[#283240] overflow-hidden relative shrink-0">
                      <Image
                        src={avatarUrl}
                        alt="Mutual"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span>Mutual connections available</span>
                  </div>
                </div>
              </div>

              {/* Right: Actions (Ignore & Accept buttons) */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin text-[#a0a6ac] my-1" />
                ) : (
                  <>
                    {/* Ignore (REJECTED) Button */}
                    <button
                      type="button"
                      onClick={() => handleAction(item._id, "REJECTED")}
                      className="px-4 py-1.5 text-sm font-semibold text-[#a0a6ac] hover:text-white hover:bg-[#283240] rounded-full transition-colors cursor-pointer"
                    >
                      Ignore
                    </button>

                    {/* Accept (ACCEPTED) Button */}
                    <button
                      type="button"
                      onClick={() => handleAction(item._id, "ACCEPTED")}
                      className="px-4 py-1.5 text-sm font-semibold text-[#70b5f9] border border-[#70b5f9] hover:bg-[#70b5f9]/10 rounded-full transition-colors cursor-pointer"
                    >
                      Accept
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
