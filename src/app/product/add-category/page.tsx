"use client";
import { useState, useEffect } from "react";
import styles from "../../../styles/category.module.scss";
import { toast, ToastContainer } from "react-toastify";

interface Category {
  id: number;
  name: string;
  active: boolean;
}

export default function AddCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [active, setActive] = useState(false);

  // ✅ Load from localStorage OR fetch from API
  useEffect(() => {
    const storedCategories = localStorage.getItem("categories");
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      fetch("/api/category")
        .then((res) => res.json())
        .then((data) => {
          setCategories(data);
          localStorage.setItem("categories", JSON.stringify(data)); // ✅ Store in localStorage
        });
    }
  }, []);

  // ✅ Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, active }),
    });

    if (res.ok) {
      const newCategory = await res.json();
      setCategories((prev) => {
        const updatedCategories = [...prev, newCategory];
        localStorage.setItem("categories", JSON.stringify(updatedCategories)); // ✅ Update localStorage
        return updatedCategories;
      });
      toast.success("Category Added Succesfully");
      setName("");
      setActive(false);
    } else {
      toast.error("Category not Added Succesfully");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Add Category</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category Name"
          className={styles.input}
          required
        />
        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            checked={active}
            onChange={() => setActive(!active)}
          />
          <label>Active</label>
        </div>
        <button type="submit" className={styles.button}>
          Submit
        </button>
      </form>

      <h2 className={styles.heading}>Category List</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>{cat.name}</td>
                <td>{cat.active ? "Active" : "Inactive"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className={styles.noData}>
                No Categories Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
