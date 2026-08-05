export type BookStatus = "want-to-read" | "reading" | "completed";

export interface Book {
  _id: string;
  title: string;
  author: string;
  tags: string[];
  status: BookStatus;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export const STATUS_LABELS: Record<BookStatus, string> = {
  "want-to-read": "Want to Read",
  reading: "Reading",
  completed: "Completed",
};

export const STATUS_EMOJI: Record<BookStatus, string> = {
  "want-to-read": "📖",
  reading: "📘",
  completed: "✅",
};

// want-to-read -> reading -> completed -> want-to-read, for one-click cycling
export const NEXT_STATUS: Record<BookStatus, BookStatus> = {
  "want-to-read": "reading",
  reading: "completed",
  completed: "want-to-read",
};
