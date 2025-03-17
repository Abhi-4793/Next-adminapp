"use client";
import { useState, useEffect } from "react";
import styles from "../../../styles/product.module.scss"; // Import SCSS styles
import { toast, ToastContainer } from "react-toastify";

interface SubCategory {
  id: number;
  categoryId: number;
  name: string;
  active: boolean;
}

interface Category {
  id: number;
  name: string;
  active: boolean;
}

interface Product {
  id: number;
  productName: string;
  category: number;
  subCategory: number;
  shortDescription: string;
  descriptions: { title: string; text: string }[];
  features: string[];
  image?: string;
  pdfs?: string[];
}

export default function AddProduct() {
  const [product, setProduct] = useState<Product>({
    id: 0,
    productName: "",
    category: 0,
    subCategory: 0,
    shortDescription: "",
    descriptions: [],
    features: [],
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [pdfs, setPdfs] = useState<File[]>([]);

  // **Fetch Data & LocalStorage Handling (Runs Only Once)**
  useEffect(() => {
    const storedCategories = localStorage.getItem("categories");
    const storedSubcategories = localStorage.getItem("subcategories");
    const storedProducts = localStorage.getItem("products");

    if (storedCategories && storedSubcategories && storedProducts) {
      // Load from localStorage if available
      setCategories(JSON.parse(storedCategories));
      setSubCategories(JSON.parse(storedSubcategories));
      setProducts(JSON.parse(storedProducts));
      setLoading(false);
    } else {
      // Fetch from API if not in localStorage
      const fetchCategories = async () => {
        try {
          const res = await fetch("/api/category");
          if (!res.ok) throw new Error("Failed to fetch categories");
          const data = await res.json();
          setCategories(data);
          localStorage.setItem("categories", JSON.stringify(data));
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };

      const fetchSubCategories = async () => {
        try {
          const res = await fetch("/api/subCategory");
          if (!res.ok) throw new Error("Failed to fetch subcategories");
          const data = await res.json();
          setSubCategories(data);
          localStorage.setItem("subcategories", JSON.stringify(data));
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      };

      const fetchProducts = async () => {
        try {
          const res = await fetch("/api/product");
          if (!res.ok) throw new Error("Failed to fetch products");
          const data = await res.json();
          setProducts(Array.isArray(data) ? data : []);
          localStorage.setItem("products", JSON.stringify(data));
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchCategories();
      fetchSubCategories();
      fetchProducts();
    }
  }, []);

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleRemovePdf = (index: number) => {
    setPdfs((prev) => prev.filter((_, i) => i !== index));
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]:
        name === "category" || name === "subCategory" ? Number(value) : value,
    }));
  };

  // **Handle File Changes**
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPdfs([...pdfs, e.target.files[0]]);
    }
  };

  // **Handle Descriptions**
  const handleAddDescription = () => {
    setProduct((prev) => ({
      ...prev,
      descriptions: [...prev.descriptions, { title: "", text: "" }],
    }));
  };

  const handleRemoveDescription = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      descriptions: prev.descriptions.filter((_, i) => i !== index),
    }));
  };

  // **Handle Features**
  const handleAddFeature = () => {
    setProduct((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const handleRemoveFeature = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  // **Handle Form Submit**
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productName", product.productName);
    formData.append("category", String(product.category));
    formData.append("subCategory", String(product.subCategory));
    formData.append("shortDescription", product.shortDescription);
    formData.append("descriptions", JSON.stringify(product.descriptions));
    formData.append("features", JSON.stringify(product.features));

    if (image) formData.append("image", image);
    pdfs.forEach((pdf, index) => formData.append(`pdf_${index}`, pdf));

    const response = await fetch("/api/product", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      toast.success("Product added successfully!");

      // ✅ Reset all fields after successful submission
      setProduct({
        id: 0,
        productName: "",
        category: 0,
        subCategory: 0,
        shortDescription: "",
        descriptions: [],
        features: [],
      });
      setImage(null);
      setPdfs([]);
    } else {
      toast.error("Failed to add product.");
    }
  };

  return (
    <div className={styles.addProduct}>
      <h2 className={styles.heading}>Add Product</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>Product Name</label>
        <input
          className={styles.input}
          type="text"
          name="productName"
          onChange={handleChange}
          required
        />

        <label className={styles.label}>Category</label>
        <select
          className={styles.select}
          name="category"
          onChange={handleChange}
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <label className={styles.label}>Sub Category</label>
        <select
          className={styles.select}
          name="subCategory"
          onChange={handleChange}
          required
          disabled={!product.category}
        >
          <option value="">Select a Subcategory</option>
          {subCategories
            .filter((sub) => sub.categoryId === Number(product.category))
            .map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
        </select>
        <label className={styles.label}>Upload Product Image</label>
        <input
          className={styles.fileInput}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {image && (
          <button className={styles.removeBtn} onClick={handleRemoveImage}>
            Remove Image
          </button>
        )}

        <h3 className={styles.subHeading}>Descriptions</h3>
        {product.descriptions.map((desc, index) => (
          <div key={index} className={styles.dynamicField}>
            <input
              className={styles.input}
              type="text"
              placeholder="Title"
              value={desc.title}
              onChange={(e) => {
                const updated = [...product.descriptions];
                updated[index].title = e.target.value;
                setProduct({ ...product, descriptions: updated });
              }}
            />
            <textarea
              className={styles.input}
              placeholder="Description"
              value={desc.text}
              onChange={(e) => {
                const updated = [...product.descriptions];
                updated[index].text = e.target.value;
                setProduct({ ...product, descriptions: updated });
              }}
            />
            <button
              className={styles.removeBtn}
              type="button"
              onClick={() => handleRemoveDescription(index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          className={styles.addBtn}
          type="button"
          onClick={handleAddDescription}
        >
          Add More
        </button>

        <h3 className={styles.subHeading}>Features</h3>
        {product.features.map((feature, index) => (
          <div key={index} className={styles.dynamicField}>
            <input
              className={styles.input}
              type="text"
              placeholder="Feature"
              value={feature}
              onChange={(e) => {
                const updated = [...product.features];
                updated[index] = e.target.value;
                setProduct({ ...product, features: updated });
              }}
            />
            <button
              className={styles.removeBtn}
              type="button"
              onClick={() => handleRemoveFeature(index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          className={styles.addBtn}
          type="button"
          onClick={handleAddFeature}
        >
          Add More
        </button>
        <label className={styles.label}>Upload PDFs</label>
        <input
          className={styles.fileInput}
          type="file"
          accept="application/pdf"
          onChange={handlePdfChange}
          multiple
        />
        {pdfs.map((pdf, index) => (
          <div key={index} className={styles.pdfItem}>
            <span>{pdf.name}</span>
            <button
              className={styles.removeBtn}
              onClick={() => handleRemovePdf(index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button className={styles.submitBtn} type="submit">
          Submit
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
