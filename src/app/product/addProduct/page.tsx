"use client";
import { useState, useEffect } from "react";
import styles from "../../../styles/product.module.scss";
import { toast, ToastContainer } from "react-toastify";
import { log } from "console";

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
  status: boolean;
}

export default function AddProduct() {
  const [product, setProduct] = useState<Product>({
    id: 0,
    productName: "",
    category: 0,
    subCategory: 0,
    shortDescription: "",
    descriptions: [{ title: "", text: "" }],
    features: [""],
    status: false,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [pdfs, setPdfs] = useState<File[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editProductId, setEditProductId] = useState<number | null>(null);
  useEffect(() => {
    const storedCategories = localStorage.getItem("categories");
    const storedSubcategories = localStorage.getItem("subcategories");
    const storedProducts = localStorage.getItem("products");

    if (storedCategories && storedSubcategories && storedProducts) {
      setCategories(JSON.parse(storedCategories));
      setSubCategories(JSON.parse(storedSubcategories));
      setProducts(JSON.parse(storedProducts));
      setLoading(false);
    } else {
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
          console.log(data, "dfassa");

          setProducts(Array.isArray(data) ? data : []);
          // localStorage.setItem("products", JSON.stringify(data));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productName", product.productName);
    formData.append("category", String(product.category));
    formData.append("subCategory", String(product.subCategory));
    formData.append("shortDescription", product.shortDescription);
    formData.append("descriptions", JSON.stringify(product.descriptions));
    formData.append("features", JSON.stringify(product.features));
    formData.append("status", JSON.stringify(product.status));

    if (image) formData.append("image", image);
    pdfs.forEach((pdf, index) => formData.append(`pdf_${index}`, pdf));

    console.log(formData, "Form");

    let response;
    if (editMode && editProductId !== null) {
      // Edit product API call
      response = await fetch(`/api/product/${editProductId}`, {
        method: "PUT",
        body: formData,
      });
    } else {
      // Add new product API call
      response = await fetch("/api/product", {
        method: "POST",
        body: formData,
      });
    }

    if (response.ok) {
      const productData = await response.json();
      toast.success(
        editMode
          ? "Product updated successfully!"
          : "Product added successfully!"
      );

      setProducts((prev) => {
        let updatedProducts;
        if (editMode && editProductId !== null) {
          updatedProducts = prev.map((p) =>
            p.id === editProductId ? productData.data : p
          );
        } else {
          updatedProducts = [...prev, productData.data];
        }

        localStorage.setItem("products", JSON.stringify(updatedProducts));
        return updatedProducts;
      });

      // Reset form
      setProduct({
        id: 0,
        productName: "",
        category: 0,
        subCategory: 0,
        shortDescription: "",
        descriptions: [],
        features: [],
        status: false,
      });
      setImage(null);
      setPdfs([]);
      setEditMode(false);
      setEditProductId(null);
    } else {
      toast.error("Failed to submit product.");
    }

    console.log(products, "Updated Products");
  };

  const handleEdit = (id: number) => {
    const productToEdit = products.find((p) => p.id === id);
    if (productToEdit) {
      setProduct(productToEdit);
      setEditMode(true);
      setEditProductId(id);
    }
  };

  const handleDelete = (id: number) => {
    const updatedProducts = products.filter((p) => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    toast.error("Product deleted.");
  };

  return (
    <div className={styles.mainContainer}>
      <h2 className={styles.heading}>Add Product</h2>
      <div className={styles.addProduct}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>Category</label>
          <select
            className={styles.select}
            name="category"
            onChange={handleChange}
            value={product.category}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category, idx) => (
              <option key={idx} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <label className={styles.label}>Sub Category</label>
          <select
            className={styles.select}
            name="subCategory"
            onChange={handleChange}
            value={product.subCategory}
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
          <label className={styles.label}>Product Name</label>
          <input
            className={styles.input}
            type="text"
            value={product.productName || ""}
            name="productName"
            onChange={handleChange}
            required
          />
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
          <label className={styles.label}>Short Description</label>
          <textarea
            className={styles.input}
            placeholder="Short Description"
            value={product.shortDescription}
            onChange={(e) => {
              setProduct({ ...product, shortDescription: e.target.value });
            }}
          />
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
            // value={product.pdfs || ""}
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
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              checked={product.status}
              onChange={(e) =>
                setProduct((prev) => ({ ...prev, status: e.target.checked }))
              }
            />
            <label>Active</label>
          </div>
          <button className={styles.submitBtn} type="submit">
            Submit
          </button>
        </form>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
      <h3 className={styles.subHeading}>All Products</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Short Description</th>
            <th>Descriptions</th>
            <th>Features</th>
            <th>Image</th>
            <th>PDFs</th>
            <th>Status</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{prod.productName}</td>
              <td>
                {categories.find((cat) => cat.id === prod.category)?.name ||
                  "N/A"}
              </td>
              <td>
                {subCategories.find((sub) => sub.id === prod.subCategory)
                  ?.name || "N/A"}
              </td>
              <td>{prod.shortDescription}</td>
              <td>
                {prod.descriptions.map((desc, index) => (
                  <div key={index}>
                    <strong>{desc.title}:</strong> {desc.text}
                  </div>
                ))}
              </td>
              <td>
                {prod.features.map((feature, index) => (
                  <div key={index}>{feature}</div>
                ))}
              </td>
              <td>
                {prod.image ? (
                  <img
                    src={prod.image}
                    alt={prod.productName}
                    className={styles.productImage}
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td>
                {prod.pdfs && prod.pdfs.length > 0
                  ? prod.pdfs.map((pdf, index) => (
                      <a
                        key={index}
                        href={pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        PDF {index + 1}
                      </a>
                    ))
                  : "No PDFs"}
              </td>
              <td>{prod.status ? "Active" : "InActive"}</td>
              <td>
                <button
                  className={styles.editBtn}
                  onClick={() => handleEdit(prod.id)}
                >
                  Edit
                </button>
              </td>
              <td>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(prod.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
