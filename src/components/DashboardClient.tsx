"use client";

import { useEffect, useMemo, useState } from "react";
import type { Book, BookStatus, User } from "@/types";
import { NEXT_STATUS } from "@/types";
import Navbar from "./Navbar";
import StatCard from "./StatCard";
import FilterBar from "./FilterBar";
import BookShelf from "./BookShelf";
import BookListView from "./BookListView";
import BookFormModal from "./BookFormModal";

export default function DashboardClient({ user }: { user: User }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<BookStatus | "all">("all");
  const [tagFilter, setTagFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [view, setView] = useState<"shelf" | "list">("shelf");

  useEffect(() => {
    loadBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadBooks() {
    setLoading(true);
    const res = await fetch("/api/books");
    if (res.ok) {
      const data = await res.json();
      setBooks(data.books);
    }
    setLoading(false);
  }

  const availableTags = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => b.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (tagFilter && !b.tags.includes(tagFilter)) return false;
      return true;
    });
  }, [books, statusFilter, tagFilter]);

  const counts = useMemo(() => {
    return {
      total: books.length,
      reading: books.filter((b) => b.status === "reading").length,
      completed: books.filter((b) => b.status === "completed").length,
    };
  }, [books]);

  function openAddModal() {
    setEditingBook(null);
    setModalOpen(true);
  }

  function openEditModal(book: Book) {
    setEditingBook(book);
    setModalOpen(true);
  }

  async function handleCycleStatus(book: Book) {
    const nextStatus = NEXT_STATUS[book.status];

    // Optimistic update so the click feels instant; roll back if the
    // request fails.
    setBooks((prev) =>
      prev.map((b) => (b._id === book._id ? { ...b, status: nextStatus } : b))
    );

    const res = await fetch(`/api/books/${book._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });

    if (!res.ok) {
      setBooks((prev) =>
        prev.map((b) => (b._id === book._id ? { ...b, status: book.status } : b))
      );
      return;
    }

    const { book: updated } = await res.json();
    setBooks((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
  }

  async function handleSave(data: {
    title: string;
    author: string;
    tags: string[];
    status: BookStatus;
  }) {
    if (editingBook) {
      const res = await fetch(`/api/books/${editingBook._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update");
      const { book } = await res.json();
      setBooks((prev) => prev.map((b) => (b._id === book._id ? book : b)));
    } else {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create");
      const { book } = await res.json();
      setBooks((prev) => [book, ...prev]);
    }
    setModalOpen(false);
    setEditingBook(null);
  }

  async function handleDelete() {
    if (!editingBook) return;
    const res = await fetch(`/api/books/${editingBook._id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setBooks((prev) => prev.filter((b) => b._id !== editingBook._id));
      setModalOpen(false);
      setEditingBook(null);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar user={user} />

      <main className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
        <div className="mb-10 grid grid-cols-3 gap-4 sm:max-w-md">
          <StatCard label="Total" value={counts.total} />
          <StatCard label="Reading" value={counts.reading} accent="text-moss-light" />
          <StatCard label="Completed" value={counts.completed} accent="text-gold" />
        </div>

        <div className="mb-8">
          <FilterBar
            status={statusFilter}
            tag={tagFilter}
            availableTags={availableTags}
            onStatusChange={setStatusFilter}
            onTagChange={setTagFilter}
            onAddClick={openAddModal}
            view={view}
            onViewChange={setView}
          />
        </div>

        {loading ? (
          <p className="font-body text-sm text-parchment/40">
            Fetching your shelf...
          </p>
        ) : view === "shelf" ? (
          <BookShelf
            books={filteredBooks}
            onSelectBook={openEditModal}
            onCycleStatus={handleCycleStatus}
            onAddClick={openAddModal}
          />
        ) : (
          <BookListView
            books={filteredBooks}
            onSelectBook={openEditModal}
            onCycleStatus={handleCycleStatus}
            onAddClick={openAddModal}
          />
        )}
      </main>

      {modalOpen && (
        <BookFormModal
          book={editingBook}
          onClose={() => {
            setModalOpen(false);
            setEditingBook(null);
          }}
          onSave={handleSave}
          onDelete={editingBook ? handleDelete : undefined}
        />
      )}
    </div>
  );
}
