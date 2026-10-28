import { FlowNavigator } from "@/components/flow-navigator";
import { MaterialForm } from "@/components/material-form";

export default function NeedMaterialPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-20">
      <FlowNavigator current="form" />
      <h1 className="mb-12 text-center text-3xl font-extrabold uppercase">
        Find the material that brings your product to life
      </h1>
      <MaterialForm needPlastic={true} />
    </main>
  );
}
