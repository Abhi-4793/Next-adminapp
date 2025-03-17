"use client";

import React from "react";
import styles from "../../src/styles/Header.module.scss";
import Image from "next/image";
import Link from "next/link";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "src/Auth/AuthContext";

export default function Header() {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className={styles.Header}>
      <Image
        alt="logo"
        className={styles.logo}
        width={800}
        height={200}
        src="/images/logo.png"
      />

      {!isLoggedIn && <h1 className={styles.Admin_panel}>Admin Panel</h1>}

      {isLoggedIn && (
        <div className={styles.topMenuContainer}>
          <Link href="/change-password" className={styles.changePassword}>
            Change Password
          </Link>
          <span>|</span>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <LogOutIcon size={14} color="#ef4444" />
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
