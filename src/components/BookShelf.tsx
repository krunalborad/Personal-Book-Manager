import type { Book } from "@/types";
import BookSpine from "./BookSpine";

export default function BookShelf({
  books,
  onSelectBook,
  onCycleStatus,
  onAddClick,
}: {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onCycleStatus: (book: Book) => void;
  onAddClick: () => void;
}) {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-parchment/20 py-20 text-center">
        <p className="font-display text-xl text-ivory">
          This shelf is empty.
        </p>
        <p className="mt-2 max-w-xs font-body text-sm text-parchment/50">
          Add the book you&apos;re reading right now, or the one you keep
          meaning to start.
        </p>
        <button onClick={onAddClick} className="btn-primary mt-6">
          + Add your first book
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex min-w-max items-end gap-2 border-b-[10px] border-parchment-dark/80 px-2 pb-0 pt-8">
        {books.map((book) => (
          <BookSpine
            key={book._id}
            book={book}
            onClick={() => onSelectBook(book)}
            onCycleStatus={onCycleStatus}
          />
        ))}
      </div>
    </div>
  );
}
