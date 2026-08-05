'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function PackFaq({ faq = [] }) {
  if (!faq.length) return null;
  return (
    <Accordion type="single" collapsible className="w-full space-y-3">
      {faq.map((item, i) => (
        <AccordionItem
          key={i}
          value={`faq-${i}`}
          className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950/50 px-5"
        >
          <AccordionTrigger className="text-left font-cinzel text-base text-neutral-100 hover:no-underline">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed text-neutral-400">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
