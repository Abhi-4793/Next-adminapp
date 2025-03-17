"use client";

import React from "react";
import Link from "next/link";
import styles from "@styles/dashboardHeader.module.scss";
import { usePathname } from "next/navigation";
import { useAuth } from "src/Auth/AuthContext"; // ✅ Import Auth Context

export const DashboardHeader = () => {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();

  if (!isLoggedIn || pathname === "/") return null;

  return (
    <div className={styles.container}>
      <Link href="/dashboard" className={styles.dashboard}>
        Dashboard
      </Link>
      <div className={styles.dropdown}>
        <button className={styles.dropdownButton}>Product</button>
        <div className={styles.dropdownMenu}>
          <Link href="/product/add-category" className={styles.dropdownItem}>
            Add Category
          </Link>
          <Link href="/product/add-subcategory" className={styles.dropdownItem}>
            Add Sub Category
          </Link>
          <Link href="/product/addProduct" className={styles.dropdownItem}>
            Add Product
          </Link>
        </div>
      </div>
    </div>
  );
};
