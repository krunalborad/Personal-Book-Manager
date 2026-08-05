import type { Book } from "@/types";
import { STATUS_EMOJI } from "@/types";

const SPINE_COLORS: Record<Book["status"], string> = {
  "want-to-read": "bg-brick",
  reading: "bg-moss",
  completed: "bg-gold-dark",
};

// Deterministic "randomness" so a given book always renders the same
// height/tilt instead of jittering on every re-render.
function hashToRange(seed: string, min: number, max: number) {
  const hash = Array.from(seed).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return min + (hash % (max - min));
}

export default function BookSpine({
  book,
  onClick,
  onCycleStatus,
}: {
  book: Book;
  onClick: () => void;
  onCycleStatus: (book: Book) => void;
}) {
  const height = hashToRange(book._id, 190, 240);

  return (
    <div
      style={{ height: `${height}px` }}
      className={`group relative flex w-14 shrink-0 flex-col items-center justify-between rounded-t-sm rounded-b-[2px] ${SPINE_COLORS[book.status]} px-1.5 py-3 shadow-spine transition-transform duration-150 ease-out hover:-translate-y-2 focus-within:-translate-y-2 sm:w-16`}
    >
      <button
        onClick={onClick}
        title={`${book.title} — ${book.author}`}
        className="flex flex-1 flex-col items-center gap-2 text-left"
      >
        <span className="font-mono text-[9px] text-ivory/50">
          {book.author.split(" ").slice(-1)[0]}
        </span>
        <span className="line-clamp-[8] font-display text-xs font-medium leading-tight text-ivory [writing-mode:vertical-rl]">
          {book.title}
        </span>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onCycleStatus(book);
        }}
        title="Click to advance status (want to read → reading → completed)"
        className="rounded-full bg-ink-dark/40 px-1 py-0.5 text-xs leading-none hover:scale-125"
      >
        {STATUS_EMOJI[book.status]}
      </button>
    </div>
  );
}
