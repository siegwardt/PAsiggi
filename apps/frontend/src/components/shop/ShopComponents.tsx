import React from "react";
import type { Bundle } from "../../types/api";

export function money(cents: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format((cents || 0) / 100);
}

export function bundleCoverSrc(bundle: Bundle) {
  const first = [...(bundle.images || [])].sort((a, b) => a.sort - b.sort)[0];
  return first?.imageFilename ? `/images/bundles/${first.imageFilename}` : "/images/placeholder-bundle.png";
}

export function bundlePriceCents(bundle: Bundle) {
  return (bundle.items || []).reduce((sum, item) => sum + ((item.product?.priceCents ?? 0) * (item.quantity ?? 1)), 0);
}

// UI atoms
export function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      {href ? (
        <a href={href} className="text-sm text-blue-600 hover:text-blue-700">Alle ansehen →</a>
      ) : null}
    </div>
  );
}

export function PriceTag({ cents, small }: { cents: number; small?: boolean }) {
  return (
    <span className={`shrink-0 rounded-full bg-gray-100 text-gray-700 ${small ? "text-xs px-2 py-1" : "text-sm px-2.5 py-1.5"}`}>
      {money(cents)}
    </span>
  );
}

export function AddToCartButton({ onClick, label = "In den Warenkorb" }: { onClick?: () => void; label?: string }) {
  return (
    <button
      className="text-sm px-3 py-1.5 rounded-full bg-black text-white hover:bg-gray-800"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export function ErrorNotice({ message }: { message: string }) {
  return <div className="text-red-600">{message}</div>;
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <div className="text-gray-600">{children}</div>;
}

export function SkeletonCard() {
  return <div className="rounded-2xl h-72 bg-gray-100 animate-pulse" />;
}

export function BundleCard({ bundle, onAdd }: { bundle: Bundle; onAdd?: (bundle: Bundle) => void }) {
  const cover = bundleCoverSrc(bundle);
  const total = bundlePriceCents(bundle);

  return (
    <div className="group rounded-2xl shadow-md hover:shadow-lg transition-shadow bg-white overflow-hidden">
      <div className="relative w-full h-48 bg-gray-100">
        <img src={cover} alt={bundle.name} className="w-full h-48 object-cover" loading="lazy" />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-tight line-clamp-2">{bundle.name}</h3>
          <PriceTag cents={total} />
        </div>
        {bundle.description ? (
          <p className="text-sm text-gray-600 line-clamp-2">{bundle.description}</p>
        ) : null}
        <div className="pt-2 flex items-center justify-between">
          <a href={`/bundles/${bundle.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Details ansehen →
          </a>
          <AddToCartButton onClick={() => onAdd?.(bundle)} />
        </div>
      </div>
    </div>
  );
}

export function BundleGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{children}</div>;
}
