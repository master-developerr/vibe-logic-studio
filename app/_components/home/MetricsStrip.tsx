/**
 * MetricsStrip — Editorial proof bar beneath the Hero.
 * 07 BUILDS / 24+ LESSONS / 04 SYSTEMS / ₹999 FROM
 */
export default function MetricsStrip() {
  const metrics = [
    { number: "07", label: "Builds" },
    { number: "24+", label: "Lessons" },
    { number: "04", label: "Systems" },
    { number: "₹999", label: "From" },
  ];

  return (
    <div className="border-b border-[#E6E2DC] bg-[#FAF7F3]">
      <div className="max-w-[1280px] mx-auto px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#E6E2DC] divide-y md:divide-y-0">
          {metrics.map(({ number, label }) => (
            <div
              key={label}
              className="flex flex-col items-start justify-center py-5 px-6 first:pl-0 last:pr-0"
            >
              <span className="text-[28px] md:text-[32px] font-bold tracking-[-0.02em] leading-none text-[#0D0D0D]">
                {number}
              </span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-[#8A8A8A] mt-1.5 font-mono">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
