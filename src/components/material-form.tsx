"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createCollaboration, createProducts } from "@/lib/api/client";
import { materialRequestSchema } from "@/lib/api/types";
import { saveFlow } from "@/lib/flow";
import { MATERIALS } from "@/lib/materials";

const fieldClass =
  "h-14 w-full rounded-lg border-2 border-zinc-200 px-4 text-base outline-none focus:border-zinc-950";

export function MaterialForm({ needPlastic }: { needPlastic: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const collaboration = useMutation({ mutationFn: createCollaboration });
  const products = useMutation({ mutationFn: createProducts });
  const pending = collaboration.isPending || products.isPending;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const parsed = materialRequestSchema.safeParse({
      brand: form.get("brand"),
      plasticType: form.get("plasticType"),
      location: form.get("location"),
      needPlastic,
      targetBrand: String(form.get("targetBrand") ?? ""),
    });
    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ?? "Check the form and try again.",
      );
      return;
    }

    const targetBrand = parsed.data.targetBrand;
    try {
      if (targetBrand) {
        const result = await products.mutateAsync({
          ...parsed.data,
          targetBrand,
        });
        saveFlow({ ...parsed.data, targetBrand, products: result });
        router.push("/products");
        return;
      }
      const result = await collaboration.mutateAsync(parsed.data);
      saveFlow({ ...parsed.data, collaboration: result });
      router.push("/brand-match");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The request failed.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-8">
      {error ? <p className="text-center text-red-600">{error}</p> : null}
      <label className="block">
        <span className="mb-2 block text-lg font-extrabold">
          Your company name
        </span>
        <input
          name="brand"
          required
          className={fieldClass}
          placeholder="Company name"
        />
      </label>
      <div className="grid gap-8 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-lg font-extrabold">
            Material type
          </span>
          <select name="plasticType" defaultValue="PP" className={fieldClass}>
            {MATERIALS.map((material) => (
              <option key={material.value} value={material.value}>
                {material.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-lg font-extrabold">
            Where is your factory located?
          </span>
          <input
            name="location"
            required
            className={fieldClass}
            placeholder="City (e.g. München)"
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-2 block text-lg font-extrabold">
          Is there a company you intend to collaborate with?{" "}
          <span className="font-normal text-zinc-500">(optional)</span>
        </span>
        <input
          name="targetBrand"
          className={fieldClass}
          placeholder="Company name"
        />
        <p className="mt-2 text-sm text-zinc-500">
          Leave this empty and the next step offers five brands that fit the
          material.
        </p>
      </label>
      <button
        type="submit"
        disabled={pending}
        className="h-14 w-full bg-black text-lg text-white disabled:opacity-60"
      >
        {pending ? "Working on the match…" : "Continue"}
      </button>
    </form>
  );
}
