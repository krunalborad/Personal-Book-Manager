"use client";

import { useState, type FormEvent } from "react";
import type { Book, BookStatus } from "@/types";
import { STATUS_LABELS, STATUS_EMOJI } from "@/types";

interface BookFormModalProps {
  book: Book | null; // null = creating a new book
  onClose: () => void;
  onSave: (data: {
    title: string;
    author: string;
    tags: string[];
    status: BookStatus;
  }) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export default function BookFormModal({
  book,
  onClose,
  onSave,
  onDelete,
}: BookFormModalProps) {
  const [title, setTitle] = useState(book?.title ?? "");
  const [author, setAuthor] = useState(book?.author ?? "");
  const [tagsInput, setTagsInput] = useState(book?.tags.join(", ") ?? "");
  const [status, setStatus] = useState<BookStatus>(book?.status ?? "want-to-read");
  const [saving, setSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      setError("Title and author are both required.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        author: author.trim(),
        tags: tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        status,
      });
    } catch {
      setError("Couldn't save that. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-dark/70 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-form-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-md border border-parchment/15 bg-ink-light p-6 shadow-card"
      >
        <h2 id="book-form-title" className="font-display text-2xl font-medium text-ivory">
          {book ? "Edit book" : "Add a book"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-5">
          <div className="mb-4">
            <label htmlFor="title" className="field-label">
              Title
            </label>
            <input
              id="title"
              className="field-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="The Left Hand of Darkness"
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label htmlFor="author" className="field-label">
              Author
            </label>
            <input
              id="author"
              className="field-input"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ursula K. Le Guin"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="tags" className="field-label">
              Tags <span className="normal-case text-parchment/40">(comma-separated)</span>
            </label>
            <input
              id="tags"
              className="field-input"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="sci-fi, favorites"
            />
          </div>

          <div className="mb-2">
            <label htmlFor="status" className="field-label">
              Status
            </label>
            <select
              id="status"
              className="field-input"
              value={status}
              onChange={(e) => setStatus(e.target.value as BookStatus)}
            >
              {(Object.keys(STATUS_LABELS) as BookStatus[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_EMOJI[s]} {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p role="alert" className="mt-3 font-body text-sm text-brick-light">
              {error}
            </p>
          )}

          <div className="mt-6 flex items-center justify-between gap-3">
            <div>
              {onDelete && !confirmingDelete && (
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className="font-body text-sm text-brick-light underline underline-offset-4 hover:text-brick"
                >
                  Remove book
                </button>
              )}
              {onDelete && confirmingDelete && (
                <div className="flex items-center gap-2 font-body text-sm">
                  <span className="text-parchment/60">Remove for good?</span>
                  <button
                    type="button"
                    onClick={onDelete}
                    className="text-brick-light underline underline-offset-4 hover:text-brick"
                  >
                    Yes, remove
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(false)}
                    className="text-parchment/50 underline underline-offset-4"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="btn-ghost">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? "Saving..." : book ? "Save changes" : "Add to shelf"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
