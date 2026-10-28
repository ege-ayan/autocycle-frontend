import Link from "next/link";

const STEPS = [
  { key: "home", label: "Home", href: "/" },
  { key: "form", label: "Getting Started", href: "/collaborations" },
  { key: "brand", label: "Brands", href: "/brand-match" },
  { key: "result", label: "Suggestion", href: "/products" },
] as const;

type Step = (typeof STEPS)[number]["key"];

export function FlowNavigator({ current }: { current: Step }) {
  const visible = STEPS.filter((step) => {
    if (step.key === "home" || step.key === "form") {
      return true;
    }
    if (step.key === "brand") {
      return current === "brand" || current === "result";
    }
    return current === "result";
  });

  return (
    <nav
      aria-label="Progress"
      className="mb-10 flex flex-wrap items-center gap-3 text-sm text-zinc-500"
    >
      {visible.map((step, index) => (
        <span key={step.key} className="flex items-center gap-3">
          {index > 0 ? <span aria-hidden="true">/</span> : null}
          {step.key === current ? (
            <span className="font-semibold text-zinc-950">{step.label}</span>
          ) : (
            <Link href={step.href} className="hover:underline">
              {step.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
