import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/logo.png"
      alt=""
      width={677}
      height={900}
      priority
      className={clsx("h-6 w-auto object-contain", className)}
      aria-hidden="true"
    />
  );
}

export function Logo({ className, iconOnly = false }: { className?: string; iconOnly?: boolean }) {
  return (
    <Link
      href="/"
      className={clsx("flex items-center gap-2 text-foreground", className)}
      aria-label="Hillvary home"
    >
      <LogoMark className="h-7" />
      {!iconOnly && (
        <span className="font-display text-xl tracking-tight leading-none pt-0.5">
          HILLVARY
        </span>
      )}
    </Link>
  );
}
