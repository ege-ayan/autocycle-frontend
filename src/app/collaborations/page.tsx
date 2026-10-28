import Image from "next/image";
import Link from "next/link";

import { FlowNavigator } from "@/components/flow-navigator";

export default function CollaborationsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-24">
      <FlowNavigator current="form" />
      <h1 className="mb-12 max-w-3xl text-2xl font-extrabold uppercase">
        Start by telling us whether you are contributing or looking for
        materials.
      </h1>
      <div className="grid justify-center gap-16 sm:grid-cols-2">
        <Choice
          href="/have-material"
          title="I have material"
          tone="bg-[#e7f1f6]"
          image="/images/material-pile.png"
          alt="Pile of recycled material"
        />
        <Choice
          href="/need-material"
          title="I need material"
          tone="bg-[#ecf5dc]"
          image="/images/material-sample.png"
          alt="Material sample"
        />
      </div>
    </main>
  );
}

function Choice({
  href,
  title,
  tone,
  image,
  alt,
}: {
  href: string;
  title: string;
  tone: string;
  image: string;
  alt: string;
}) {
  return (
    <Link
      href={href}
      className={`group relative block h-80 w-full max-w-sm ${tone} p-8`}
    >
      <p className="text-center text-sm font-bold tracking-wide">
        For brand collaboration
      </p>
      <p className="mt-3 text-center text-2xl font-extrabold uppercase">
        {title}
      </p>
      <Image
        src={image}
        alt={alt}
        width={420}
        height={280}
        className="absolute -bottom-10 left-0 h-auto w-[130%] transition-transform group-hover:scale-105"
      />
    </Link>
  );
}
