import Link from "next/link";
import clsx from "clsx";

export function Pagination({
  page,
  pageCount,
  searchParams,
}: {
  page: number;
  pageCount: number;
  searchParams: Record<string, string | undefined>;
}) {
  if (pageCount <= 1) return null;

  function hrefFor(p: number) {
    const params = new URLSearchParams(
      Object.entries(searchParams).filter(([, v]) => v !== undefined) as [string, string][]
    );
    params.set("page", String(p));
    return `/shop?${params.toString()}`;
  }

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <nav className="mt-10 flex items-center justify-center gap-2">
      {pages.map((p) => (
        <Link
          key={p}
          href={hrefFor(p)}
          className={clsx(
            "flex h-9 w-9 items-center justify-center rounded-full text-sm",
            p === page ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {p}
        </Link>
      ))}
    </nav>
  );
}
