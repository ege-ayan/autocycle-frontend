import { FlowNavigator } from "@/components/flow-navigator";
import { MaterialForm } from "@/components/material-form";

export default function HaveMaterialPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-20">
      <FlowNavigator current="form" />
      <h1 className="mb-12 text-center text-3xl font-extrabold uppercase">
        Find a partner for the material you already have
      </h1>
      <MaterialForm needPlastic={false} />
    </main>
  );
}
