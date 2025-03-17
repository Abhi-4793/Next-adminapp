import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

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

let products: Product[] = []; // Simulating a database

export async function GET() {
  return NextResponse.json(products, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const productName = formData.get("productName") as string;
    const category = Number(formData.get("category"));
    const subCategory = Number(formData.get("subCategory"));
    const shortDescription = formData.get("shortDescription") as string;
    const descriptions = JSON.parse(formData.get("descriptions") as string);
    const features = JSON.parse(formData.get("features") as string);

    let imagePath = "";
    let pdfPaths: string[] = [];

    // **Handle Image Upload**
    const image = formData.get("image") as File;
    if (image) {
      const imageExt = image.name.split(".").pop();
      const imageName = `${Date.now()}.${imageExt}`;
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      await writeFile(
        path.join(process.cwd(), "public/uploads", imageName),
        imageBuffer
      );
      imagePath = `/uploads/${imageName}`;
    }

    // **Handle PDF Uploads**
    for (let i = 0; i < 5; i++) {
      const pdf = formData.get(`pdf_${i}`) as File;
      if (pdf) {
        const pdfExt = pdf.name.split(".").pop();
        const pdfName = `${Date.now()}_${i}.${pdfExt}`;
        const pdfBuffer = Buffer.from(await pdf.arrayBuffer());
        await writeFile(
          path.join(process.cwd(), "public/uploads", pdfName),
          pdfBuffer
        );
        pdfPaths.push(`/uploads/${pdfName}`);
      }
    }

    // **Simulate Database Save**
    const newProduct: Product = {
      id: products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1,
      productName,
      category,
      subCategory,
      shortDescription,
      descriptions,
      features,
      image: imagePath,
      pdfs: pdfPaths,
    };

    products.push(newProduct);
    return NextResponse.json(
      { success: true, data: newProduct },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error adding product", error },
      { status: 500 }
    );
  }
}
