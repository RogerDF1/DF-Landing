'use client';

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation"; // Next.js 13+
import { useEffect } from "react";
import OwnSidebar from "@/app/trello/sidebar";

const Layout = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  // Redirige al inicio si el usuario no está autenticado
  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in");
    }
  }, [isSignedIn, router]);

  // Si el usuario no está autenticado, no se renderiza nada
  if (!isSignedIn) {
    return null; // O muestra un spinner o algún feedback visual si lo prefieres
  }

  return (
    <div>
      <OwnSidebar />
      {/* Otros componentes que quieras renderizar */}
    </div>
  );
};

export default Layout;
