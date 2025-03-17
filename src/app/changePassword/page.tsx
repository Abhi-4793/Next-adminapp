"use client";

import { useState } from "react";
import styles from "../../styles/changepassword.module.scss";

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    repeatPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/changePassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Change Password</h2>

        {message && <p className={styles.message}>{message}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            value={form.currentPassword}
            onChange={handleChange}
            className={styles.input}
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            className={styles.input}
          />

          <input
            type="password"
            name="repeatPassword"
            placeholder="Repeat Password"
            value={form.repeatPassword}
            onChange={handleChange}
            className={styles.input}
          />

          <button type="submit" className={styles.button}>
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
