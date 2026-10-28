"use client";

import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { FlowNavigator } from "@/components/flow-navigator";
import { createProducts } from "@/lib/api/client";
import type { Partner } from "@/lib/api/types";
import { updateFlow } from "@/lib/flow";
import { useFlow } from "@/lib/use-flow";

export function BrandMatches() {
  const router = useRouter();
  const flow = useFlow();
  const [error, setError] = useState<string | null>(null);
  const products = useMutation({ mutationFn: createProducts });

  if (!flow?.collaboration) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16">
        <FlowNavigator current="brand" />
        <p className="text-center text-red-600">
          Complete the form before choosing a brand.
        </p>
      </main>
    );
  }

  async function select(partner: Partner) {
    if (!flow) {
      return;
    }
    setError(null);
    try {
      const result = await products.mutateAsync({
        brand: flow.brand,
        plasticType: flow.plasticType,
        location: flow.location,
        needPlastic: flow.needPlastic,
        targetBrand: partner.brandName,
      });
      updateFlow({ partner, products: result });
      router.push("/products");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Product generation failed.",
      );
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 pb-20">
      <FlowNavigator current="brand" />
      <h1 className="mb-10 text-center text-3xl font-extrabold uppercase">
        Brand match results
      </h1>
      {error ? <p className="mb-6 text-center text-red-600">{error}</p> : null}
      <div className="space-y-10">
        {flow.collaboration.partners.map((partner) => (
          <article
            key={partner.brandName}
            className="relative border border-black bg-white p-8"
          >
            <button
              type="button"
              disabled={products.isPending}
              onClick={() => select(partner)}
              className="absolute -top-4 right-6 bg-black px-6 py-2 text-white disabled:opacity-60"
            >
              {products.isPending ? "Working…" : "Select"}
            </button>
            <div className="grid gap-8 md:grid-cols-[180px_1fr]">
              <div>
                {partner.logoUrl ? (
                  <Image
                    src={partner.logoUrl}
                    alt=""
                    width={160}
                    height={80}
                    className="h-16 w-auto object-contain"
                  />
                ) : null}
                <p className="mt-6 text-4xl font-extrabold uppercase">
                  {partner.brandName}
                </p>
                {partner.companyDomain ? (
                  <a
                    href={`https://${partner.companyDomain}`}
                    className="text-sm underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {partner.companyDomain}
                  </a>
                ) : null}
              </div>
              <div className="space-y-4">
                <Field
                  label="Brand placement"
                  value={partner.brandPlacement.join(", ")}
                />
                <Field
                  label="Sustainability"
                  value={partner.sustainabilityPlacement}
                />
                <Field
                  label="Product assumptions"
                  value={partner.productAssumptions.join(", ")}
                />
                <p className="text-zinc-700">{partner.collaborationSummary}</p>
                <dl className="grid grid-cols-3 gap-4 text-sm">
                  <Stat label="Combined reach" value={partner.combinedReach} />
                  <Stat
                    label="Estimated impact"
                    value={partner.estimatedImpact}
                  />
                  <Stat
                    label="Confidence"
                    value={`${partner.confidenceScore}%`}
                  />
                </dl>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">
        {label}
      </p>
      <p>{value}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase text-zinc-400">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}
