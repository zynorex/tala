const heroStats = [1, 2, 3];
const timelineSteps = [1, 2, 3, 4];
const useCases = [1, 2, 3, 4];
const narrativeBlocks = [1, 2, 3];
const securityLayers = [1, 2, 3, 4];
const blueprintBlocks = [1, 2, 3, 4];
const trustSignals = [1, 2, 3, 4];
const proofRails = [1, 2, 3, 4];
const pricingTiers = [1, 2, 3];
const faqs = [1, 2, 3, 4];

export default function PageSkeleton() {
  return (
    <main className="min-h-screen bg-cream animate-pulse overflow-hidden">
      {/* Hero Section */}
      <section className="bg-cream border-b-8 border-black pt-20 pb-28 px-4 sm:px-6 lg:px-8 relative min-h-[90vh] flex items-center">
        <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative z-10">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="h-8 w-40 bg-gray-300 border-4 border-black mb-8 shadow-[6px_6px_0_0_#000]" />
            <div className="space-y-4 mb-8">
              <div className="h-20 md:h-28 w-full bg-gray-300" />
              <div className="h-20 md:h-28 w-3/4 bg-gray-300 border-4 border-black shadow-[8px_8px_0_0_#000]" />
            </div>
            <div className="h-16 w-full max-w-2xl bg-gray-200 border-l-8 border-gray-400 mb-10 shadow-[4px_4px_0_0_#000]" />
            <div className="flex flex-col sm:flex-row gap-5 md:gap-6 mb-12">
              <div className="h-16 w-full sm:w-64 bg-gray-400 border-4 border-black shadow-[8px_8px_0_0_#000]" />
              <div className="h-16 w-full sm:w-64 bg-gray-300 border-4 border-black shadow-[8px_8px_0_0_#000]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-auto">
              {heroStats.map((item) => (
                <div key={item} className="h-28 bg-white border-4 border-black shadow-[6px_6px_0_0_#000] p-5">
                  <div className="w-16 h-10 bg-gray-300 mb-3" />
                  <div className="w-24 h-4 bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 relative mt-10 lg:mt-0 xl:scale-105 xl:origin-left">
            <div className="border-4 border-black bg-white p-6 md:p-8 lg:p-10 h-full flex flex-col shadow-[8px_8px_0_0_#000]">
              <div className="mb-8 border-b-4 border-black pb-6 space-y-4">
                <div className="h-8 w-40 bg-gray-300 shadow-[4px_4px_0_0_#000]" />
                <div className="h-24 w-3/4 bg-gray-200" />
              </div>
              <div className="space-y-6 md:space-y-8 flex-grow">
                {timelineSteps.map((step) => (
                  <div key={step} className="grid grid-cols-[64px_1fr] md:grid-cols-[80px_1fr] gap-4 md:gap-6 items-start">
                    <div className="h-10 w-full bg-gray-300 border-4 border-black shadow-[4px_4px_0_0_#000]" />
                    <div className="h-24 bg-gray-200 border-4 border-black shadow-[6px_6px_0_0_#000]" />
                  </div>
                ))}
              </div>
              <div className="h-12 w-full bg-gray-300 border-4 border-black shadow-[4px_4px_0_0_#000] mt-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Deployment Sectors */}
      <section className="py-20 md:py-32 px-4 border-b-8 border-black bg-white">
        <div className="container mx-auto max-w-7xl space-y-16">
          <div className="flex flex-col md:flex-row gap-8 md:items-end md:justify-between border-b-8 border-black pb-8">
            <div className="space-y-4 max-w-4xl w-full">
              <div className="h-8 w-48 bg-gray-300 shadow-[4px_4px_0_0_#000]" />
              <div className="h-20 md:h-24 w-full md:w-1/2 bg-gray-200" />
              <div className="h-16 w-full max-w-2xl bg-gray-100" />
            </div>
            <div className="h-24 w-full md:w-80 bg-gray-300 border-4 border-black shadow-[8px_8px_0_0_#000] rotate-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((use) => (
              <div key={use} className="h-72 border-4 border-black bg-gray-100 shadow-[8px_8px_0_0_#000] p-8 flex flex-col gap-5">
                <div className="w-16 h-16 bg-gray-300 border-4 border-black rotate-[-3deg]" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 w-3/4 bg-gray-300" />
                  <div className="h-4 w-full bg-gray-200" />
                  <div className="h-4 w-5/6 bg-gray-200" />
                </div>
                <div className="h-10 w-full bg-gray-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vulnerability Analysis */}
      <section className="py-20 md:py-32 px-4 bg-gray-900 border-b-8 border-black">
        <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5 space-y-8">
            <div className="h-8 w-56 bg-gray-400 shadow-[4px_4px_0_0_#000]" />
            <div className="h-24 md:h-32 w-full bg-gray-800" />
            <div className="space-y-6">
              {narrativeBlocks.map((block) => (
                <div key={block} className="h-32 border-4 border-gray-700 bg-gray-800 p-6 shadow-[8px_8px_0_0_#000]" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="h-[600px] border-4 border-gray-700 bg-gray-800 p-8 md:p-12 shadow-[12px_12px_0_0_#000]" />
          </div>
        </div>
      </section>

      {/* Architecture Blueprint */}
      <section className="py-20 md:py-32 px-4 bg-gray-100 border-b-8 border-black">
        <div className="container mx-auto max-w-7xl space-y-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b-8 border-black pb-8">
            <div className="space-y-4 w-full">
              <div className="h-8 w-56 bg-gray-300 shadow-[4px_4px_0_0_#000]" />
              <div className="h-20 w-full md:w-1/2 bg-gray-200" />
            </div>
            <div className="h-16 w-56 bg-gray-300 border-4 border-black shadow-[6px_6px_0_0_#000]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {blueprintBlocks.map((layer) => (
              <div key={layer} className="h-64 border-4 border-black bg-white shadow-[8px_8px_0_0_#000] p-6 flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-300 border-4 border-black" />
                  <div className="h-6 w-3/4 bg-gray-200" />
                </div>
                <div className="space-y-3 mt-4">
                  <div className="h-4 w-full bg-gray-200" />
                  <div className="h-4 w-5/6 bg-gray-200" />
                  <div className="h-4 w-4/6 bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-20 md:py-32 px-4 bg-gray-200 border-b-8 border-black">
        <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5 space-y-8">
            <div className="h-8 w-40 bg-gray-400 shadow-[4px_4px_0_0_#000]" />
            <div className="h-20 w-3/4 bg-gray-300" />
            <div className="h-8 w-full bg-gray-200 border-l-8 border-gray-400" />
            <div className="grid grid-cols-2 gap-6 mt-8">
              {trustSignals.map((signal) => (
                <div key={signal} className="h-32 border-4 border-black bg-white shadow-[6px_6px_0_0_#000] p-6" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="h-[500px] border-4 border-black bg-white shadow-[12px_12px_0_0_#000] p-8 md:p-12 relative flex flex-col">
              <div className="h-16 w-3/4 bg-gray-200 mb-8" />
              <div className="space-y-4 h-full flex flex-col justify-end">
                {proofRails.map((rail) => (
                  <div key={rail} className="h-16 w-full border-4 border-black bg-gray-100" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operations Scale / Pricing */}
      <section className="py-20 md:py-32 px-4 bg-white border-b-8 border-black">
        <div className="container mx-auto max-w-7xl space-y-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b-8 border-black pb-8">
             <div className="space-y-4 w-full">
              <div className="h-8 w-40 bg-gray-300 shadow-[4px_4px_0_0_#000]" />
              <div className="h-20 w-full md:w-1/3 bg-gray-200" />
            </div>
            <div className="h-16 w-48 bg-gray-300 border-4 border-black shadow-[6px_6px_0_0_#000]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier) => (
              <div key={tier} className="h-96 border-4 border-black bg-gray-100 shadow-[10px_10px_0_0_#000]" />
            ))}
          </div>
        </div>
      </section>

      {/* FAQs & Deployment Ready mapped roughly as final blocks */}
      <section className="py-20 w-full bg-gray-200 h-96" />
    </main>
  );
}

