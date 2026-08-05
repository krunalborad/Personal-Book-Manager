import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Book, BOOK_STATUSES } from "@/lib/models/Book";
import { getUserFromRequest } from "@/lib/auth";

// PATCH /api/books/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (typeof body.title === "string") updates.title = body.title;
    if (typeof body.author === "string") updates.author = body.author;
    if (Array.isArray(body.tags)) updates.tags = body.tags;
    if (body.status && BOOK_STATUSES.includes(body.status)) {
      updates.status = body.status;
    }

    await connectToDatabase();

    // Scoping the filter to `user: user.userId` (not just `_id`) means one
    // person can never edit another person's book, even if they guess an id.
    const book = await Book.findOneAndUpdate(
      { _id: params.id, user: user.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!book) {
      return NextResponse.json(
        { error: "Book not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ book });
  } catch (error) {
    console.error("Update book error:", error);
    return NextResponse.json(
      { error: "Something went wrong while updating the book." },
      { status: 500 }
    );
  }
}

// DELETE /api/books/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  await connectToDatabase();

  const book = await Book.findOneAndDelete({
    _id: params.id,
    user: user.userId,
  });

  if (!book) {
    return NextResponse.json({ error: "Book not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
