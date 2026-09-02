/* eslint-disable @next/next/no-location-assign-relative-destination */
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_URL}/api`,
  withCredentials: true,
});
// Qayta urinish bayrog'ini qo'shish uchun interfeys
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
// Refresh jarayoni va navbatni boshqarish o'zgaruvchilari
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];
// Navbatdagi barcha so'rovlarni bajarish yoki rad etish funksiyasi
const processQueue = (error: AxiosError | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};
// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Agar xatolik 401 (Unauthorized) bo'lsa va so'rov birinchi marta qayta urinilayotgan bo'lsa
    const originalRequest = error.config as CustomAxiosRequestConfig;
    // Server muhitida (SSR) bo'lsak, refresh logika ishlamasligi va xatoni qaytarishi kerak
    if (typeof window === "undefined") {
      return Promise.reject(error);
    }
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      // Agar 401 xatosi refresh routening o'zidan chiqqan bo'lsa, cheksiz siklga kirib ketmaslik uchun to'xtatamiz
      if (originalRequest.url?.includes("/auth/refresh")) {
        return Promise.reject(error);
      }
      // Agar hozirda boshqa so'rov token yangilayotgan bo'lsa, ushbu so'rovni navbatga qo'yamiz
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        // Backend'dan yangi accessToken / refreshToken so'rash
        await api.post("/auth/refresh");
        // Navbatda kutib turgan barcha so'rovlarni o'tkazish
        processQueue(null);
        // Dastlabki muvaffaqiyatsiz bo'lgan so'rovni qayta yuborish
        return api(originalRequest);
      } catch (refreshError: any) {
        console.error(
          "Refresh token xatoligi:",
          refreshError.response?.data || refreshError.message,
        );
        // Refresh ham xato bergan bo'lsa (refresh token muddati tugagan), navbatdagilarni rad etamiz
        processQueue(refreshError as AxiosError);
        // Foydalanuvchi seansini tugatib, role sahifasiga yo'naltirish
        if (typeof window !== "undefined") {
          window.location.href = "/auth/role";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
  // Request interceptor esa route bo'lmagan vaziyatlardagi xatolarni ushlash uchun ishlatiladi ya'ni tugma bosilganda yoki ma'lumot yuborilganda xatolik yuz berishi mumkin, shuning uchun request interceptor ishlatiladi.
);
export { api };
