import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export const BOOK_STATUSES = ["want-to-read", "reading", "completed"] as const;
export type BookStatus = (typeof BOOK_STATUSES)[number];

export interface IBook extends Document {
  user: Types.ObjectId;
  title: string;
  author: string;
  tags: string[];
  status: BookStatus;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBook>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 200,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      maxlength: 120,
    },
    tags: {
      type: [String],
      default: [],
      set: (tags: string[]) =>
        tags.map((t) => t.trim().toLowerCase()).filter(Boolean),
    },
    status: {
      type: String,
      enum: BOOK_STATUSES,
      default: "want-to-read",
    },
  },
  { timestamps: true }
);

// A user's book list is almost always queried filtered by status/tag,
// so a compound index keeps that fast without over-engineering it.
BookSchema.index({ user: 1, status: 1 });

export const Book: Model<IBook> =
  mongoose.models.Book || mongoose.model<IBook>("Book", BookSchema);
