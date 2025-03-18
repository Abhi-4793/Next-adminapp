import { NextRequest, NextResponse } from "next/server";
import { products, setProducts } from "../../../../../src/data/products";

export async function PUT(req: NextRequest) {
  try {
    const url = new URL(req.nextUrl);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { message: "Invalid Product ID" },
        { status: 400 }
      );
    }

    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      return NextResponse.json(
        { message: "Invalid Product ID format" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const index = products.findIndex((p) => p.id === productId);
    if (index === -1) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const updatedProduct = {
      ...products[index],
      productName: formData.get("productName") as string,
      category: Number(formData.get("category")),
      subCategory: Number(formData.get("subCategory")),
      shortDescription: formData.get("shortDescription") as string,
      descriptions: JSON.parse(formData.get("descriptions") as string),
      features: JSON.parse(formData.get("features") as string),
      status: formData.has("status")
        ? JSON.parse(formData.get("status") as string)
        : products[index].status,
      image: formData.get("image") || products[index].image,
      pdfs: [...formData.entries()]
        .filter(([key]) => key.startsWith("pdf_"))
        .map(([_, file]) => file),
    };

    const updatedProducts = [...products];
    updatedProducts[index] = updatedProduct;
    setProducts(updatedProducts);

    return NextResponse.json(
      { message: "Product updated successfully", data: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating product", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.nextUrl);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { message: "Invalid Product ID" },
        { status: 400 }
      );
    }

    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      return NextResponse.json(
        { message: "Invalid Product ID format" },
        { status: 400 }
      );
    }

    const index = products.findIndex((p) => p.id === productId);
    if (index === -1) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const updatedProducts = products.filter((p) => p.id !== productId);
    setProducts(updatedProducts);

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting product", error: error.message },
      { status: 500 }
    );
  }
}
