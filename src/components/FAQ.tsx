import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { FAQS } from "@/data/site";

const FAQ = () => (
  <section id="faq" className="py-24 bg-brand-off-white">
    <div className="container mx-auto px-4 max-w-3xl">
      <h2 className="text-3xl md:text-5xl font-bold text-brand-navy mb-10 leading-tight">
        Frequently asked questions
      </h2>
      <Accordion type="multiple" defaultValue={FAQS.map((_, i) => `faq-${i}`)} className="space-y-2">
        {FAQS.map((item, i) => (
          <AccordionItem key={item.q} value={`faq-${i}`} className="bg-white rounded-xl px-5 border">
            <AccordionTrigger className="text-left text-brand-navy font-bold text-base md:text-lg">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-brand-slate text-base leading-relaxed">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQ;
