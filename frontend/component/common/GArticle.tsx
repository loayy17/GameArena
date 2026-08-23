import type { ReactNode } from "react";

function GArticleSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-text">{title}</h2>
      {children}
    </section>
  );
}

function GArticleList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 ps-6 leading-relaxed text-text-secondary">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export { GArticleSection, GArticleList };
