"use client";
import React, { useState } from "react";
import styles from "@styles/login.module.scss";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { log } from "console";
import { useAuth } from "src/Auth/AuthContext";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      login(data.token); // ✅ Store token globally
      router.push("/dashboard");
      toast.success("Login Succesfully");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login Failed");
      setMessage("Login failed. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.loginBox} onSubmit={handleLogin}>
        <div className={styles.login_here}>
          <Image
            src="/images/lock-image.png"
            alt="Lock"
            className={styles.lock}
            width={50}
            height={50}
          />
          <h2>LOGIN HERE</h2>
        </div>
        <div className={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.inputField}
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.inputField}
          />
        </div>
        <button type="submit" className={styles.loginButton}>
          Login
        </button>
        {message && <p className={styles.errorMessage}>{message}</p>}
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;
