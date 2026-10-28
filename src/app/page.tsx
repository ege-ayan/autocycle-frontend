import Image from "next/image";
import Link from "next/link";

const QUESTIONS = [
  {
    question: "What is AutoCycle?",
    answer:
      "AutoCycle connects brands for collaborations built from recycled material. It matches companies on the plastic they have or need, then turns that match into a product concept.",
  },
  {
    question: "How does the matchmaking work?",
    answer:
      "You enter a company, a plastic type, and a factory location. The API researches the brand, finds collaboration partners, and can generate a product pitch and image for the pair you choose.",
  },
  {
    question: "What happens after a match?",
    answer:
      "You pick a partner and receive one product concept: a name, description, pitch, and an image when one is produced. From there the two brands can take the idea into a real collaboration.",
  },
];

export default function HomePage() {
  return (
    <>
      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h1 className="text-6xl font-bold uppercase leading-none sm:text-8xl">
              Upcycle
              <br />
              your brand
            </h1>
            <div className="relative mt-8 h-80 max-w-xl bg-[#e7f1f6]">
              <Image
                src="/images/bmwxdecathlon.png"
                alt="BMW x Decathlon frisbee"
                width={520}
                height={360}
                priority
                className="absolute -left-4 top-6 h-auto w-[80%]"
              />
              <p className="absolute bottom-3 left-3 font-bold">
                BMW
                <br />x<br />
                DECATHLON
              </p>
            </div>
            <h2 className="mt-6 text-right text-5xl font-bold uppercase leading-none sm:text-7xl">
              With
              <br />
              recycled
              <br />
              materials
            </h2>
            <p className="mt-8 max-w-2xl text-lg text-zinc-700">
              The tool matches material waste between companies, then adds value
              through brand collaborations — turning waste into a product and a
              story.
            </p>
          </div>
          <div className="flex flex-col items-end gap-8">
            <div className="relative aspect-square w-full max-w-sm bg-[#d2d4d6]">
              <p className="p-3 text-right font-bold">
                BOSCH
                <br />x<br />
                SAMSONITE
              </p>
              <Image
                src="/images/boschxsamsonite.png"
                alt="Bosch x Samsonite luggage"
                width={280}
                height={280}
                className="absolute bottom-0 left-0 h-auto w-4/5"
              />
            </div>
            <Link
              href="/collaborations"
              className="flex items-center gap-4 bg-black px-6 py-4 text-2xl text-white"
            >
              Get started
              <Image
                src="/icons/arrow_outward.svg"
                alt=""
                width={28}
                height={28}
              />
            </Link>
            <div className="relative aspect-square w-full max-w-sm bg-[#f1e7d7]">
              <p className="p-3 font-bold">
                BMW
                <br />x<br />
                IKEA
              </p>
              <Image
                src="/images/bmxikeachair.png"
                alt="BMW x IKEA chair"
                width={360}
                height={280}
                className="absolute bottom-0 left-4 h-auto w-[90%]"
              />
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-12 text-center text-5xl font-bold uppercase">
            How it works
          </h2>
          <ol className="grid gap-8 md:grid-cols-3">
            <Step
              n="1"
              title="Enter company and material"
              body="Name the company and the plastic it has or needs."
            />
            <Step
              n="2"
              title="Get product ideas"
              body="A partner match comes back with a product concept and a pitch."
            />
            <Step
              n="3"
              title="Choose a collaborator"
              body="Pick one of the suggested brands, or name the company yourself."
            />
          </ol>
        </section>

        <section id="faq" className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-6 text-4xl text-[#39302d]">
            Frequently asked questions
          </h2>
          {QUESTIONS.map((item) => (
            <details
              key={item.question}
              className="mt-4 border border-black bg-white p-5"
            >
              <summary className="cursor-pointer text-xl text-[#39302d]">
                {item.question}
              </summary>
              <p className="pt-4 text-lg text-[#39302d]">{item.answer}</p>
            </details>
          ))}
        </section>
      </main>
      <footer className="mx-auto flex w-full max-w-6xl flex-col justify-between gap-6 px-4 py-12 md:flex-row">
        <div>
          <p className="text-3xl font-extrabold uppercase">Autocycle</p>
          <p className="mt-3">Based in Munich, operating across Europe</p>
          <a className="underline" href="mailto:info@unternehmertum.de">
            info@unternehmertum.de
          </a>
          <p>Lichtenbergstraße 6, 85748 Garching bei München</p>
        </div>
        <Link href="/legal-notice" className="text-lg hover:underline">
          Legal notice
        </Link>
      </footer>
    </>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="text-center">
      <p className="text-2xl font-black">Step {n}</p>
      <h3 className="mt-4 text-2xl font-extrabold text-[#39302d]">{title}</h3>
      <p className="mt-3 text-lg">{body}</p>
    </li>
  );
}
