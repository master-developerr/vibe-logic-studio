import ScrollReveal from "./ScrollReveal";

/**
 * BrandStatement — Black section.
 * WE DON'T HAND YOU ANSWERS. WE GIVE YOU THE WORK.
 * THE WORK. in orange.
 */
export default function BrandStatement() {
  return (
    <section className="bg-[#0D0D0D] text-white py-40 border-b border-white/5" id="brand">
      <div className="max-w-[1280px] mx-auto px-8 lg:px-12">
        <ScrollReveal>
          <h2
            className="font-bold tracking-[-0.03em] leading-[0.9] text-white"
            style={{ fontSize: "clamp(48px, 7vw, 92px)" }}
          >
            WE DON&apos;T<br />
            HAND YOU<br />
            ANSWERS.<br />
            <br />
            WE GIVE YOU<br />
            <span className="text-[#FF5A1F]">THE WORK.</span>
          </h2>
          <p className="mt-10 text-[15px] text-white/30 font-mono tracking-[0.04em] max-w-[400px] leading-[1.6]">
            &ldquo;Because understanding starts where the shortcut ends.&rdquo;
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
