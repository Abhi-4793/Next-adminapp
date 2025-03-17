import { NextResponse } from "next/server";

interface SubCategory {
  id: number;
  categoryId: number;
  name: string;
  active: boolean;
}

let subcategories: SubCategory[] = [];

export async function GET() {
  return NextResponse.json(subcategories, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const { categoryId, name, active }: Omit<SubCategory, "id"> =
      await req.json();

    const newId = subcategories.length
      ? Math.max(...subcategories.map((sub) => sub.id)) + 1
      : 1;

    const newSubCategory: SubCategory = {
      id: newId,
      categoryId,
      name,
      active,
    };

    subcategories.push(newSubCategory);

    return NextResponse.json(newSubCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
