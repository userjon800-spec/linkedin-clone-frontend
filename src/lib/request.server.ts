import { cookies } from "next/headers";
import { IUser, ICompany } from "@/types";
import { api } from "./https";

export type AuthAccount = IUser | ICompany;

export interface ApiResponseMe {
  success: boolean;
  message?: string;
  user?: AuthAccount;
}

const API_URL = process.env.NEXT_PUBLIC_URL;

export async function getUsersServer() {
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();
    // Cookielar umuman bo'lmasa, behuda API so'rov yubormaymiz
    if (!cookieString) return null;

    // Express backend'ga barcha cookie'larni forward qilamiz
    const response = await api.get<ApiResponseMe>(`${API_URL}/api/users/me`, {
      headers: {
        Cookie: cookieString,
      },
    });

    const account = response.data?.user || (response.data as unknown as AuthAccount);
    const role = account?.role;

    return {
      success: response.data.success ?? true,
      user: account,
      role: role,
    };
  } catch (error) {
    return null;
  }
}