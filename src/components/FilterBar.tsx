import type { BookStatus } from "@/types";
import { STATUS_LABELS, STATUS_EMOJI } from "@/types";

interface FilterBarProps {
  status: BookStatus | "all";
  tag: string;
  availableTags: string[];
  onStatusChange: (status: BookStatus | "all") => void;
  onTagChange: (tag: string) => void;
  onAddClick: () => void;
  view: "shelf" | "list";
  onViewChange: (view: "shelf" | "list") => void;
}

export default function FilterBar({
  status,
  tag,
  availableTags,
  onStatusChange,
  onTagChange,
  onAddClick,
  view,
  onViewChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => onStatusChange("all")}
          className={`stamp not-italic ${
            status === "all"
              ? "border-gold text-gold"
              : "border-parchment/25 text-parchment/50 hover:border-parchment/50"
          }`}
        >
          All
        </button>
        {(Object.keys(STATUS_LABELS) as BookStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => onStatusChange(s)}
            className={`stamp not-italic ${
              status === s
                ? "border-gold text-gold"
                : "border-parchment/25 text-parchment/50 hover:border-parchment/50"
            }`}
          >
            {STATUS_EMOJI[s]} {STATUS_LABELS[s]}
          </button>
        ))}

        {availableTags.length > 0 && (
          <select
            value={tag}
            onChange={(e) => onTagChange(e.target.value)}
            className="field-input !w-auto !py-1.5 text-sm"
            aria-label="Filter by tag"
          >
            <option value="">All tags</option>
            {availableTags.map((t) => (
              <option key={t} value={t}>
                #{t}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex rounded-sm border border-parchment/20 p-0.5">
          <button
            onClick={() => onViewChange("shelf")}
            className={`rounded-sm px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
              view === "shelf"
                ? "bg-gold text-ink"
                : "text-parchment/50 hover:text-parchment"
            }`}
          >
            Shelf
          </button>
          <button
            onClick={() => onViewChange("list")}
            className={`rounded-sm px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
              view === "list"
                ? "bg-gold text-ink"
                : "text-parchment/50 hover:text-parchment"
            }`}
          >
            List
          </button>
        </div>

        <button onClick={onAddClick} className="btn-primary">
          + Add a book
        </button>
      </div>
    </div>
  );
}
