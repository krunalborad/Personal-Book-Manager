import type { Book } from "@/types";
import StatusStamp from "./StatusStamp";
import { NEXT_STATUS } from "@/types";

export default function BookListView({
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
        <p className="font-display text-xl text-ivory">This shelf is empty.</p>
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
    <div className="overflow-x-auto rounded-md border border-parchment/15">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className="border-b border-parchment/15 bg-ink-light/50">
            <th className="px-4 py-3 font-mono text-xs uppercase tracking-[0.15em] text-parchment/50">
              Title
            </th>
            <th className="px-4 py-3 font-mono text-xs uppercase tracking-[0.15em] text-parchment/50">
              Author
            </th>
            <th className="px-4 py-3 font-mono text-xs uppercase tracking-[0.15em] text-parchment/50">
              Tags
            </th>
            <th className="px-4 py-3 font-mono text-xs uppercase tracking-[0.15em] text-parchment/50">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr
              key={book._id}
              className="border-b border-parchment/10 last:border-0 hover:bg-ink-light/30"
            >
              <td className="px-4 py-3">
                <button
                  onClick={() => onSelectBook(book)}
                  className="font-display text-sm text-ivory underline-offset-4 hover:text-gold hover:underline"
                >
                  {book.title}
                </button>
              </td>
              <td className="px-4 py-3 font-body text-sm text-parchment/70">
                {book.author}
              </td>
              <td className="px-4 py-3">
                {book.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {book.tags.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-xs text-parchment/40"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="font-mono text-xs text-parchment/25">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                <StatusStamp
                  status={book.status}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCycleStatus(book);
                  }}
                />
                <span className="ml-2 font-mono text-[10px] text-parchment/30">
                  → {NEXT_STATUS[book.status] === "want-to-read" ? "want to read" : NEXT_STATUS[book.status]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
