"use client";

import React from "react";
import Header from "@components/Header";
import { DashboardHeader } from "@components/DashboardHeader";
import { useAuth } from "src/Auth/AuthContext";
import { usePathname } from "next/navigation";
import Footer from "./footer";

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname(); // ✅ Now works in a client component

  return (
    <>
      <Header />
      {/* ✅ Only show DashboardHeader when logged in & NOT on login page */}
      {isLoggedIn && pathname !== "/" && <DashboardHeader />}
      {children}
      <Footer />
    </>
  );
};

export default LayoutContent;
