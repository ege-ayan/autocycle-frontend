export default function LegalNoticePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold uppercase">Legal notice</h1>
      <p className="font-bold">UnternehmerTUM GmbH</p>
      <p>Lichtenbergstr. 6</p>
      <p className="mb-8">85748 Garching b. München</p>
      <h2 className="font-bold">Represented by</h2>
      <ul className="mb-8 list-disc pl-5">
        <li>Prof. Dr. Helmut Schönenberger (CEO)</li>
        <li>Stefan Drüssler</li>
        <li>Claudia Frey</li>
        <li>Christian Mohr</li>
        <li>Thomas Zeller</li>
      </ul>
      <h2 className="font-bold">Contact</h2>
      <p>Phone: +49 89-541 986 9800</p>
      <p>Fax: +49 89-541 987 0060</p>
      <p className="mb-8">
        Email:{" "}
        <a className="underline" href="mailto:info@unternehmertum.de">
          info@unternehmertum.de
        </a>
      </p>
      <h2 className="font-bold">VAT number</h2>
      <p className="mb-8">DE 252 789 694</p>
      <h2 className="font-bold">Accountability for content</h2>
      <p className="mb-8">
        The contents of these pages were created with care. We cannot guarantee
        that they are accurate, complete, or current. We are responsible for our
        own content. We are not obliged to monitor information transmitted by
        third parties, while obligations to remove illegal information remain in
        place.
      </p>
      <h2 className="font-bold">Copyright</h2>
      <p>
        These pages and their contents are subject to German copyright law.
        Using, reproducing, or processing protected works requires the prior
        consent of the rights holder unless the law expressly allows it.
      </p>
    </main>
  );
}
