import React from "react";

export type Col<T> = {
  key: keyof T;
  label?: string;
  header: React.ReactNode;
  render?: (row: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  width?: string; 
};

type Density = "compact" | "normal" | "comfortable";

type TableProps<T extends Record<string, any>> = {
  data: T[];
  cols: Col<T>[];
  rowKey?: (row: T, index: number) => React.Key;
  className?: string;
  striped?: boolean;
  stickyHeader?: boolean;
  dense?: Density;
  loading?: boolean;
  empty?: React.ReactNode;
  onRowClick?: (row: T, index: number) => void;
};

const PAD_X = "px-[clamp(1.25rem,1rem+0.8vw,2rem)]"; 
const PAD_Y = "py-[clamp(0.6rem,0.4rem+0.4vw,1rem)]";


const densityPad: Record<Density, string> = {
  compact: "px-2 py-1.5 text-xs",
  normal: "px-3 py-2 text-sm",
  comfortable: "px-4 py-3 text-sm",
};

const alignClass = (a?: Col<any>["align"]) =>
  a === "center" ? "text-center" : a === "right" ? "text-right" : "text-left";

export default function Table<T extends Record<string, any>>({
  data,
  cols,
  rowKey,
  className,
  striped = true,
  stickyHeader = true,
  dense = "normal",
  loading = false,
  empty,
  onRowClick,
}: TableProps<T>) {
  const fallbackPad = densityPad[dense]; // usado só como fallback em casos específicos

  return (
    <div
      className={`overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm ${className || ""}`}
      role="region"
      aria-label="Tabela de dados"
    >
      <table className="min-w-full text-gray-800">
        <thead
          className={`text-left text-xs font-semibold uppercase tracking-wide text-gray-600 ${
            stickyHeader ? "sticky top-0 z-10" : ""
          }`}
        >
          <tr
            className={`bg-gray-50/90 backdrop-blur ${
              stickyHeader ? "ring-1 ring-gray-200" : ""
            }`}
          >
            {cols.map((c, i) => (
              <th
                key={String(c.key) + i}
                scope="col"
                className={`${PAD_X} ${PAD_Y} font-semibold text-gray-700 ${alignClass(
                  c.align
                )} ${c.width || ""}`}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* Loading state (skeleton) */}
          {loading &&
            Array.from({ length: Math.max(3, Math.min(6, cols.length)) }).map(
              (_, rIdx) => (
                <tr key={`skeleton-${rIdx}`} className="border-t">
                  {cols.map((c, cIdx) => (
                    <td
                      key={`skeleton-${rIdx}-${String(c.key)}-${cIdx}`}
                      className={`${PAD_X} ${PAD_Y} ${c.width || ""}`}
                    >
                      <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200" />
                    </td>
                  ))}
                </tr>
              )
            )}

          {/* Empty state */}
          {!loading && data.length === 0 && (
            <tr className="border-t">
              <td
                colSpan={cols.length}
                className={`${PAD_X} ${PAD_Y} text-center text-gray-500`}
              >
                {empty ?? "Nenhum registro encontrado."}
              </td>
            </tr>
          )}

          {/* Rows */}
          {!loading &&
            data.length > 0 &&
            data.map((row, i) => {
              const zebra =
                striped && i % 2 === 1 ? "bg-gray-50/60" : "bg-white";
              const clickable = onRowClick ? "cursor-pointer" : "";
              return (
                <tr
                  key={(rowKey?.(row, i) as React.Key) ?? i}
                  className={`border-t transition-colors hover:bg-gray-50 focus-within:bg-gray-50 ${zebra} ${clickable} focus:outline-none`}
                  tabIndex={onRowClick ? 0 : -1}
                  onClick={() => onRowClick?.(row, i)}
                  onKeyDown={(e) => {
                    if (!onRowClick) return;
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onRowClick(row, i);
                    }
                  }}
                >
                  {cols.map((c, j) => (
                    <td
                      key={String(c.key) + j}
                      className={`${PAD_X} ${PAD_Y} ${alignClass(
                        c.align
                      )} ${c.className || ""} ${c.width || ""}`}
                    >
                      {c.render ? c.render(row, i) : String(row[c.key] ?? "")}
                    </td>
                  ))}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
