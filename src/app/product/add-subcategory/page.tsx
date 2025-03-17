"use client";
import { useState, useEffect } from "react";
import styles from "../../../styles/subcategory.module.scss";
import { toast, ToastContainer } from "react-toastify";

interface Category {
  id: number;
  name: string;
}

interface SubCategory {
  id: number;
  categoryId: number;
  name: string;
  active: boolean;
}

export default function AddSubCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [active, setActive] = useState(false);

  useEffect(() => {
    const storedCategories = localStorage.getItem("categories");
    const storedSubcategories = localStorage.getItem("subcategories");

    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      fetch("/api/category")
        .then((res) => res.json())
        .then((data) => {
          setCategories(data);
          localStorage.setItem("categories", JSON.stringify(data));
        });
    }

    if (storedSubcategories) {
      setSubcategories(JSON.parse(storedSubcategories));
    } else {
      fetch("/api/subCategory")
        .then((res) => res.json())
        .then((data) => {
          setSubcategories(data);
          localStorage.setItem("subcategories", JSON.stringify(data));
        });
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) return;

    const res = await fetch("/api/subCategory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId, name, active }),
    });

    if (res.ok) {
      const newSubcategory = await res.json();
      setSubcategories((prev) => {
        const updatedSubcategories = [...prev, newSubcategory];
        localStorage.setItem(
          "subcategories",
          JSON.stringify(updatedSubcategories)
        );
        return updatedSubcategories;
      });
      toast.success("SubCategory Added Succesfully");
      setName("");
      setActive(false);
    } else {
      toast.error("Subcategory not added Succesfully");
    }
  };
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Add Sub Category</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <select
          onChange={(e) => setCategoryId(Number(e.target.value))}
          className={styles.select}
        >
          <option value="">Select Category</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Sub Category Name"
          className={styles.input}
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

      <h2 className={styles.heading}>Sub Category List</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {subcategories.map((sub, idx) => (
            <tr key={idx}>
              <td>{sub.id}</td>
              <td>
                {categories.find((cat) => cat.id === sub.categoryId)?.name}
              </td>
              <td>{sub.name}</td>
              <td>{sub.active ? "Active" : "Inactive"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
