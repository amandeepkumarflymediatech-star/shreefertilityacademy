import { signOut } from "next-auth/react";

/**
 * Completely purges client-side caches, localStorage, sessionStorage, 
 * browser cache storage, and signs out with a hard browser redirect.
 */
export async function handleAppLogout(callbackUrl: string = "/") {
  try {
    if (typeof window !== "undefined") {
      // 1. Clear LocalStorage and SessionStorage
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        console.error("Failed to clear web storage:", e);
      }

      // 2. Clear CacheStorage API caches if available
      if ("caches" in window) {
        try {
          const cacheKeys = await caches.keys();
          await Promise.all(cacheKeys.map((key) => caches.delete(key)));
        } catch (e) {
          console.error("Failed to delete cache keys:", e);
        }
      }

      // 3. Clear non-httpOnly cookies
      try {
        const cookies = document.cookie.split(";");
        for (const cookie of cookies) {
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
      } catch (e) {
        console.error("Failed to clear cookies:", e);
      }
    }

    // 4. Perform NextAuth SignOut without default redirect
    await signOut({ redirect: false });

    // 5. Hard browser reload/redirect to flush Next.js App Router in-memory cache
    if (typeof window !== "undefined") {
      window.location.href = callbackUrl;
    }
  } catch (error) {
    console.error("Logout error:", error);
    if (typeof window !== "undefined") {
      window.location.href = callbackUrl;
    }
  }
}
