"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/https";
import { IUser } from "@/types";
import { Plus, Loader2, Check, ArrowRight, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "../ui/toast";

interface ExtendedUser extends IUser {
  _id?: string;
  id?: string;
}

export default function AddConnection() {
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // Har bir user uchun ulanish holatlarini saqlash
  const [pendingIds, setPendingIds] = useState<Record<string, boolean>>({});
  const [connectedIds, setConnectedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users/all");
        // Kelgan ma'lumotlar orasidan dastlabki 3-4 tasini olish
        const data = Array.isArray(res.data) ? res.data : res.data?.users || [];
        setUsers(data.slice(0, 4));
      } catch (err) {
        console.error("Userlarni yuklashda xatolik:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleConnect = async (userId: string) => {
    if (!userId || pendingIds[userId] || connectedIds[userId]) return;

    // Loading holatini yoqamiz
    setPendingIds((prev) => ({ ...prev, [userId]: true }));

    try {
      // Backend api so'rovi (yo'lakni o'z backend API'ingizga moslang)
      const res = await api.post(`connections/req-connect/${userId}`);
      console.log(res.data);
      toast.add({
        type: "success",
        description: "So'rov yuborildi, kuting",
      });
      // Muvaffaqiyatli ulansa connected holatiga o'tkaziladi
      setConnectedIds((prev) => ({ ...prev, [userId]: true }));
    } catch (err: any) {
      console.error("Connect qilishda xatolik:", err);
      toast.add({
        type: "error",
        description: err.response.data.message,
      });
    } finally {
      // Loading holatini o'chiramiz
      setPendingIds((prev) => ({ ...prev, [userId]: false }));
    }
  };  

  return (
    <div className="w-full max-w-[18%] bg-[#1b1f23] text-white border border-neutral-800 rounded-xl p-4 shadow-lg">
      <h3 className="font-semibold text-base mb-3 text-neutral-100">
        Add to your feed
      </h3>

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user, i) => {
            if (i === 6) return;
            const userId = user._id || user.id || "";
            const isPending = !!pendingIds[userId];
            const isConnected = !!connectedIds[userId];
            const fullName =
              `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
            return (
              <div key={userId} className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-800 shrink-0 border border-neutral-700">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                </div>

                {/* Foydalanuvchi ma'lumotlari */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-neutral-100 truncate hover:underline cursor-pointer">
                    {fullName}
                  </h4>
                  <p className="text-xs text-neutral-400 truncate mt-0.5">
                    {user.job ||
                      user.company ||
                      user.bio ||
                      "No position added"}
                  </p>

                  {/* Connect / Pending tugmasi */}
                  <button
                    onClick={() => handleConnect(userId)}
                    disabled={isPending || isConnected}
                    className={`mt-2 px-4 py-1.5 rounded-full border text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isConnected
                        ? "border-neutral-600 bg-neutral-800 text-neutral-300 cursor-default"
                        : "border-neutral-400 text-neutral-200 hover:bg-neutral-800 hover:border-white active:scale-95"
                    }`}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                        <span>Pending...</span>
                      </>
                    ) : isConnected ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Pending</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Connect</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer link */}
      <div>
        <Link
          href="/network"
          className="mt-4 pt-2 w-full flex items-center gap-1 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          <span>View all recommendations</span>
        </Link>
      </div>
    </div>
  );
}
