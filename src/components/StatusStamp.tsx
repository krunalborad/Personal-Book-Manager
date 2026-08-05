import type { BookStatus } from "@/types";
import { STATUS_LABELS, STATUS_EMOJI } from "@/types";

const STYLES: Record<BookStatus, string> = {
  "want-to-read": "border-brick text-brick-light",
  reading: "border-moss-light text-moss-light",
  completed: "border-gold text-gold",
};

export default function StatusStamp({
  status,
  onClick,
}: {
  status: BookStatus;
  onClick?: (e: React.MouseEvent) => void;
}) {
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      onClick={onClick}
      className={`stamp ${STYLES[status]} ${
        onClick ? "cursor-pointer hover:brightness-125" : ""
      }`}
      title={onClick ? "Click to advance status" : undefined}
    >
      {STATUS_EMOJI[status]} {STATUS_LABELS[status]}
    </Tag>
  );
}
