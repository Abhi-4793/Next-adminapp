"use client";

import React from "react";
import Header from "@components/Header";
import { DashboardHeader } from "@components/DashboardHeader";
import { useAuth } from "src/Auth/AuthContext";
import { usePathname } from "next/navigation";
import Footer from "./footer";

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();

  return (
    <>
      <Header />

      {isLoggedIn && pathname !== "/" && <DashboardHeader />}
      {children}
      <Footer />
    </>
  );
};

export default LayoutContent;
