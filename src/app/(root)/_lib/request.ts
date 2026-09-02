import { api } from "@/lib/https";
export async function getUserData(token?: string) {
  try {
    const res = await api.get("/users/me", {
      headers: {
        // Server muhitida cookie'ni qo'lda yuboramiz
        Cookie: token ? `accessToken=${token}` : "",
      },
    }); 
    return res.data;
  } catch (error) {
   console.error("getUserData xatosi:", error);
    return null; // Xato bo'lsa null qaytaradi, loyiha yiqilmaydi
  }
}
