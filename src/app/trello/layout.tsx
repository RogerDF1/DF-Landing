'use client';

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation"; // Cambiado de next/router a next/navigation
import OwnSidebar from "@/app/trello/sidebar";

const Layout = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  // Si no está autenticado, redirige al inicio
  if (!isSignedIn) {
    if (typeof window !== "undefined") {
      router.push("/sign-in"); // Redirige al inicio
    } 
    return null; // Retorna null mientras redirige
  }

  return (
    <div>
      <OwnSidebar/>
      
    </div>
  );
};

export default Layout;
