"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@styles/dashboard.module.scss";

export default function Dashboard() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      setIsLoggedIn(true);
    }
  }, [router]);

  if (!isLoggedIn) return null;

  return (
    <div className={styles.container}>
      <h1>Welcome to the Admin Dashboard</h1>
    </div>
  );
}
