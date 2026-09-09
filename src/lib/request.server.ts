import { cookies } from "next/headers";
import { IUser, ICompany } from "@/types";
import { api } from "./https";

export type AuthAccount = IUser | ICompany;

export interface ApiResponseMe {
  success: boolean;
  message?: string;
  user?: AuthAccount;
  company?: AuthAccount;
}

const API_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";

function getRoleFromToken(token?: string): string | null {
  if (!token) return null;
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;
    const decodedJson = Buffer.from(payloadBase64, "base64").toString("utf-8");
    const parsed = JSON.parse(decodedJson);
    return parsed?.role || null;
  } catch (err) {
    console.error("Token decode xatosi:", err);
    return null;
  }
}

export async function getUsersServer() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;
    const accessToken = cookieStore.get("accessToken")?.value;
    const cookieString = cookieStore.toString();

    if (!refreshToken && !accessToken) {
      return null;
    }

    const userRole = getRoleFromToken(refreshToken || accessToken);

    const endpoint =
      userRole === "company"
        ? `${API_URL}/api/companies/me`
        : `${API_URL}/api/users/me`;
    const response = await api.get<ApiResponseMe>(endpoint, {
      headers: {
        Cookie: cookieString,
      },
    });

    const account =
      response.data?.user ||
      response.data?.company ||
      (response.data as unknown as AuthAccount);

    const role = account?.role || userRole;

    return {
      success: response.data?.success ?? true,
      user: account,
      role: role,
    };
  } catch (error: any) {
    // 🚨 2. Xatolik yuz bersa, uni terminalga to'liq chiqarish
    console.error("❌ getUsersServer ERROR:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error("Message:", error.message || error);
    }
    return null;
  }
}
