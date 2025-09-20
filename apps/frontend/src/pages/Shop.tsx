import React, { useEffect, useState } from "react";
import type { Bundle } from "../types/api";
import {
  SectionHeader,
  BundleGrid,
  BundleCard,
  SkeletonCard,
  EmptyState,
  ErrorNotice,
} from "../components/shop/ShopComponents";

const BASE: string ="http://localhost:5000";
const API = `${BASE}/api/v1`;

export default function ShopPage() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API}/bundles`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Bundle[] = await res.json();
        if (!alive) return;
        setBundles((data || []).filter((b) => b.active).slice(0, 3));
      } catch (e: any) {
        setErr(e?.message || "Fehler beim Laden");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const handleAdd = (bundle: Bundle) => {
    alert(`Bundle "${bundle.name}" in den Warenkorb (Demo)`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <SectionHeader title="Shop" href="/bundles" />

      {loading ? (
        <BundleGrid>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </BundleGrid>
      ) : err ? (
        <ErrorNotice message={err} />
      ) : bundles.length === 0 ? (
        <EmptyState>Keine Bundles gefunden.</EmptyState>
      ) : (
        <BundleGrid>
          {bundles.map((b) => (
            <BundleCard key={b.id} bundle={b} onAdd={handleAdd} />
          ))}
        </BundleGrid>
      )}
    </div>
  );
}
