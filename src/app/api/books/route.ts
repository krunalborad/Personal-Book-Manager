import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Book, BOOK_STATUSES } from "@/lib/models/Book";
import { getUserFromRequest } from "@/lib/auth";

// GET /api/books?status=reading&tag=fiction
export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  await connectToDatabase();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const tag = searchParams.get("tag");

  const query: Record<string, unknown> = { user: user.userId };
  if (status && (BOOK_STATUSES as readonly string[]).includes(status)) {
    query.status = status;
  }
  if (tag) {
    query.tags = tag.toLowerCase();
  }

  const books = await Book.find(query).sort({ createdAt: -1 });
  return NextResponse.json({ books });
}

// POST /api/books
export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, author, tags, status } = body;

    if (!title || !author) {
      return NextResponse.json(
        { error: "Title and author are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const book = await Book.create({
      user: user.userId,
      title,
      author,
      tags: Array.isArray(tags) ? tags : [],
      status: status && BOOK_STATUSES.includes(status) ? status : "want-to-read",
    });

    return NextResponse.json({ book }, { status: 201 });
  } catch (error) {
    console.error("Create book error:", error);
    return NextResponse.json(
      { error: "Something went wrong while adding the book." },
      { status: 500 }
    );
  }
}
