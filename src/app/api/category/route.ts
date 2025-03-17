import { NextResponse } from "next/server";

interface Category {
  id: number;
  name: string;
  active: boolean;
}

let categories: Category[] = [];

export async function GET() {
  return NextResponse.json(categories, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const { name, active }: Omit<Category, "id"> = await req.json();

    const newId = categories.length
      ? Math.max(...categories.map((cat) => cat.id)) + 1
      : 1;

    const newCategory: Category = { id: newId, name, active };
    categories.push(newCategory);

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
