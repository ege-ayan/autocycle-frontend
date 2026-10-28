"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { FlowNavigator } from "@/components/flow-navigator";
import { useFlow } from "@/lib/use-flow";

export function ProductResult() {
  const flow = useFlow();
  const [expanded, setExpanded] = useState(false);
  const product = flow?.products?.products[0];

  if (!flow?.products || !product) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16">
        <FlowNavigator current="result" />
        <p className="text-center text-red-600">
          No product yet. Choose a collaboration first.
        </p>
      </main>
    );
  }

  const back = flow.needPlastic ? "/need-material" : "/have-material";

  return (
    <main className="mx-auto max-w-5xl px-4 pb-20">
      <FlowNavigator current="result" />
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-5xl font-extrabold uppercase leading-none sm:text-7xl">
            {flow.products.sourceBrand}
            <br />x<br />
            {flow.products.targetBrand}
          </h1>
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={640}
              height={640}
              className="mt-8 h-auto w-full max-w-md"
            />
          ) : (
            <p className="mt-8 text-zinc-500">
              The product concept is ready. An image was not returned.
            </p>
          )}
        </div>
        <section className="bg-[#f8f4ee] p-8">
          <h2 className="mb-4 text-sm font-bold uppercase">Your input</h2>
          <dl className="grid grid-cols-2 gap-y-3">
            <dt>Company</dt>
            <dd className="font-bold">{flow.brand}</dd>
            <dt>Collaborator</dt>
            <dd className="font-bold">{flow.products.targetBrand}</dd>
            <dt>Material</dt>
            <dd className="font-bold">{flow.plasticType}</dd>
            <dt>Location</dt>
            <dd className="font-bold">{flow.location}</dd>
          </dl>
          <Link
            href={back}
            className="mt-6 inline-block bg-black px-6 py-2 text-white"
          >
            Change
          </Link>
        </section>
      </div>
      <section className="mt-12 max-w-3xl">
        <p className="text-xs font-bold uppercase text-zinc-400">Product</p>
        <h2 className="text-2xl font-semibold">{product.name}</h2>
        <p className="mt-1 text-sm uppercase text-zinc-500">{product.type}</p>
        <p className="mt-4">{product.description}</p>
        <div className={expanded ? "mt-6" : "mt-6 max-h-48 overflow-hidden"}>
          <Pitch text={product.pitch} />
        </div>
        <button
          type="button"
          className="mt-2 text-sm underline"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Show less" : "Show more"}
        </button>
        {flow.partner ? (
          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            <Stat
              label="Estimated impact"
              value={flow.partner.estimatedImpact}
            />
            <Stat label="Combined reach" value={flow.partner.combinedReach} />
            <Stat
              label="Confidence"
              value={`${flow.partner.confidenceScore}%`}
            />
          </dl>
        ) : null}
      </section>
    </main>
  );
}

function Pitch({ text }: { text: string }) {
  return (
    <div className="space-y-2">
      {text.split("\n").map((line, index) => {
        const heading = /^#{1,3}\s+(.*)/.exec(line);
        if (heading) {
          return (
            <h3
              key={index}
              className="pt-2 text-xs font-bold uppercase text-zinc-500"
            >
              {heading[1]}
            </h3>
          );
        }
        const plain = line.replaceAll("**", "").trim();
        return plain ? <p key={index}>{plain}</p> : null;
      })}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase text-zinc-400">{label}</dt>
      <dd className="text-lg font-semibold">{value}</dd>
    </div>
  );
}
