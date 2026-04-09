const heroStats = [1, 2, 3];
const timelineSteps = [1, 2, 3, 4];
const useCases = [1, 2, 3, 4];
const narrativeBlocks = [1, 2, 3];
const securityLayers = [1, 2, 3, 4];
const blueprintBlocks = [1, 2, 3, 4];
const trustSignals = [1, 2, 3, 4];
const proofRails = [1, 2, 3, 4];
const pricingTiers = [1, 2, 3, 4];
const faqs = [1, 2, 3, 4];

export default function PageSkeleton() {
  return (
    <main className="min-h-screen bg-cream animate-pulse overflow-hidden">
      {/* Hero Section */}
      <section className="bg-cream border-b-8 border-black pt-20 pb-28 px-4 sm:px-6 lg:px-8 relative min-h-[90vh] flex items-center">
        <div className="absolute top-10 left-10 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-gray-300 border-4 border-black rounded-none mix-blend-multiply blur-sm opacity-50 transform rotate-12" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-gray-300 border-4 border-black rounded-full mix-blend-multiply blur-sm opacity-50" />
        
        <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative z-10">
          <div className="lg:col-span-7 flex flex-col justify-center relative">
            <div className="absolute -top-12 -left-4 md:-top-16 md:-left-8 z-20">
              <div className="h-12 w-36 bg-gray-400 border-4 border-black transform -rotate-6 shadow-[6px_6px_0_0_#000]" />
            </div>

            <div className="space-y-4 mb-8 w-full">
              <div className="h-24 md:h-32 w-full bg-gray-300" />
              <div className="h-24 md:h-32 w-3/4 bg-gray-400 border-4 border-black shadow-[8px_8px_0_0_#BAE1FF]" />
            </div>

            <div className="h-20 w-full max-w-2xl bg-gray-200 border-l-8 border-gray-400 mb-10 shadow-[4px_4px_0_0_#000]" />

            <div className="flex flex-col sm:flex-row gap-5 md:gap-6 mb-12">
              <div className="h-20 w-full sm:w-64 bg-gray-600 border-4 border-black shadow-[8px_8px_0_0_#FFB3BA]" />
              <div className="h-20 w-full sm:w-64 bg-gray-300 border-4 border-black shadow-[8px_8px_0_0_#000]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-auto">
              {heroStats.map((item) => (
                <div key={item} className="h-32 bg-white border-4 border-black shadow-[6px_6px_0_0_#000] p-5">
                  <div className="w-16 h-12 bg-gray-300 mb-3" />
                  <div className="w-24 h-5 bg-gray-200" />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 relative mt-10 lg:mt-0 xl:scale-105 xl:origin-left">
            <div className="absolute -inset-2 md:-inset-4 bg-gray-300 border-4 border-black transform rotate-2 md:rotate-3 shadow-[12px_12px_0_0_#000] z-0 hidden sm:block" />
            <div className="border-4 border-black bg-white p-4 md:p-6 lg:p-8 relative z-10 flex flex-col shadow-[8px_8px_0_0_#000] sm:shadow-none">
              <div className="mb-4 md:mb-5 border-b-4 border-black pb-3 space-y-3">
                <div className="h-8 w-40 bg-gray-400 shadow-[4px_4px_0_0_#BAE1FF]" />
                <div className="h-24 w-3/4 bg-gray-300" />
              </div>

              <div className="flex flex-col gap-4 pt-1 flex-grow">
                {timelineSteps.map((step) => (
                  <div key={step} className="grid grid-cols-[56px_1fr] md:grid-cols-[64px_1fr] gap-3 items-start">
                    <div className="h-8 w-full bg-gray-300 border-4 border-black" />
                    <div className="h-20 bg-gray-200 border-4 border-black p-2.5" />
                  </div>
                ))}
              </div>

              <div className="mt-5 h-10 w-full bg-gray-600 border-4 border-black shadow-[4px_4px_0_0_#FFFACD] shrink-0" />
            </div>
          </div>
        </div>
      </section>

      {/* Deployment Sectors */}
      <section className="py-20 md:py-32 px-4 border-b-8 border-black bg-white relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-300 border-b-8 border-l-8 border-black" />
        <div className="container mx-auto max-w-7xl space-y-16 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 md:items-end md:justify-between border-b-8 border-black pb-8">
            <div className="space-y-4 max-w-4xl w-full">
              <div className="h-8 w-48 bg-gray-600 shadow-[4px_4px_0_0_#BAE1FF]" />
              <div className="h-20 md:h-24 w-full md:w-3/4 bg-gray-300" />
              <div className="h-16 w-full max-w-2xl bg-gray-200" />
            </div>
            <div className="h-28 w-full md:w-80 bg-gray-400 border-4 border-black shadow-[8px_8px_0_0_#000] rotate-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((use) => (
              <div key={use} className="h-72 border-4 border-black bg-gray-100 shadow-[8px_8px_0_0_#000] p-8 flex flex-col gap-5">
                <div className="w-16 h-16 bg-gray-400 border-4 border-black rotate-[-3deg]" />
                <div className="flex-1 space-y-3 mt-2">
                  <div className="h-8 w-3/4 bg-gray-300" />
                  <div className="h-20 w-full bg-gray-200 border-l-4 border-black pl-3" />
                </div>
                <div className="h-12 w-full bg-gray-600" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vulnerability Analysis */}
      <section className="relative overflow-hidden border-b-8 border-black bg-gray-900 py-20 px-4 md:py-32">
        <div className="container relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="flex flex-col space-y-12 lg:col-span-5">
            <div>
              <div className="h-12 w-64 bg-gray-400 border-4 border-gray-600 shadow-[6px_6px_0_0_#FFFACD]" />
            </div>
            <div className="space-y-6">
              <div className="h-32 md:h-40 w-full bg-gray-700" />
              <div className="h-24 w-full max-w-xl bg-gray-600" />
            </div>
            <div className="space-y-10 pt-4">
              {narrativeBlocks.map((block) => (
                <div key={block} className="relative h-48 border-4 border-black bg-gray-800 p-6 shadow-[8px_8px_0_0_#FFF]">
                  <div className="absolute -left-4 -top-5 h-8 w-32 border-4 border-black bg-gray-900 shadow-[4px_4px_0_0_#FF6961]" />
                  <div className="mt-4 border-b-4 border-black pb-4 mb-4">
                    <div className="h-8 w-3/4 bg-gray-600" />
                  </div>
                  <div className="h-16 w-full bg-gray-700" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 lg:col-span-7 lg:mt-0">
            <div className="relative h-full border-4 border-gray-600 bg-gray-800 p-8 shadow-[16px_16px_0_0_#BAE1FF] md:p-12">
              <div className="absolute -right-4 -top-6 h-12 w-48 rotate-3 border-4 border-gray-600 bg-gray-400 shadow-[8px_8px_0_0_#000] z-10" />
              <div className="mb-12 flex flex-col gap-6 border-b-4 border-gray-600 pb-8 sm:flex-row sm:items-center">
                <div className="h-24 w-24 shrink-0 border-4 border-gray-600 bg-gray-900 shadow-[8px_8px_0_0_#BAFFC9]" />
                <div className="space-y-4 w-full">
                  <div className="h-16 w-3/4 bg-gray-700" />
                  <div className="h-6 w-1/2 bg-gray-600 border-l-4 border-gray-500 pl-3" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                {securityLayers.map((layer) => (
                  <div key={layer} className="h-56 flex flex-col border-4 border-gray-600 bg-gray-900 p-6">
                    <div className="mb-6 h-16 w-16 border-4 border-gray-600 bg-gray-700" />
                    <div className="h-8 w-3/4 bg-gray-600 mb-3" />
                    <div className="h-16 w-full bg-gray-700" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Blueprint */}
      <section className="py-20 md:py-32 px-4 bg-gray-200 border-b-8 border-black">
        <div className="container mx-auto max-w-7xl space-y-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b-8 border-black pb-8">
            <div className="space-y-4 w-full">
              <div className="h-8 w-56 bg-gray-400 shadow-[4px_4px_0_0_#000]" />
              <div className="h-24 w-full md:w-3/4 bg-gray-300" />
            </div>
            <div className="h-16 w-56 bg-gray-100 border-4 border-black shadow-[6px_6px_0_0_#000]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {blueprintBlocks.map((layer) => (
              <div key={layer} className="h-64 border-4 border-black bg-white shadow-[8px_8px_0_0_#000] p-6 flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 border-4 border-black" />
                  <div className="h-8 w-3/4 bg-gray-300" />
                </div>
                <div className="space-y-4 mt-4">
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
      <section className="py-20 md:py-32 px-4 bg-gray-300 border-b-8 border-black">
        <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5 space-y-8">
            <div className="h-8 w-40 bg-gray-600 shadow-[4px_4px_0_0_#FFFACD]" />
            <div className="h-24 md:h-32 w-full bg-gray-400" />
            <div className="h-10 w-full bg-gray-400 border-l-8 border-black" />
            <div className="grid grid-cols-2 gap-6 mt-8">
              {trustSignals.map((signal) => (
                <div key={signal} className="h-32 border-4 border-black bg-white shadow-[6px_6px_0_0_#000] p-6">
                  <div className="h-12 w-1/2 bg-gray-300 mb-2" />
                  <div className="h-4 w-1/3 bg-gray-400 mb-2" />
                  <div className="h-8 w-full bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="h-full min-h-[500px] border-4 border-black bg-white shadow-[12px_12px_0_0_#000] p-8 md:p-12 relative flex flex-col">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gray-400 border-4 border-black" />
                <div className="h-12 w-1/2 bg-gray-300" />
              </div>
              <div className="h-20 w-full bg-gray-200 border-b-4 border-black pb-8 mb-10" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-auto">
                {proofRails.map((rail) => (
                  <div key={rail} className="h-20 border-4 border-black bg-gray-100 flex items-center justify-between p-4">
                    <div className="space-y-2 w-1/2">
                       <div className="h-6 w-full bg-gray-300" />
                       <div className="h-4 w-3/4 bg-gray-200" />
                    </div>
                    <div className="w-8 h-8 bg-gray-600 border-2 border-black" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operations Scale / Pricing */}
      <section className="py-20 md:py-32 px-4 bg-white border-b-8 border-black relative overflow-hidden">
        <div className="container mx-auto max-w-7xl space-y-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b-8 border-black pb-8">
            <div className="space-y-4 w-full">
              <div className="h-8 w-48 bg-gray-400 shadow-[4px_4px_0_0_#000]" />
              <div className="h-24 w-full md:w-1/2 bg-gray-300" />
            </div>
            <div className="h-20 w-56 bg-gray-600 border-4 border-black shadow-[6px_6px_0_0_#BAE1FF]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingTiers.map((tier) => (
              <div key={tier} className="h-[500px] border-4 border-black bg-gray-200 shadow-[10px_10px_0_0_#000] p-8 flex flex-col gap-6 relative">
                <div className="flex items-center justify-between border-b-4 border-black pb-6 gap-4">
                  <div className="h-8 w-1/2 bg-gray-400" />
                  <div className="h-10 w-24 bg-white border-4 border-black -rotate-2" />
                </div>
                <div className="flex-1 space-y-5 pt-2">
                  <div className="h-5 w-full bg-gray-300" />
                  <div className="h-5 w-full bg-gray-300" />
                  <div className="h-5 w-3/4 bg-gray-300" />
                  <div className="h-5 w-5/6 bg-gray-300" />
                  <div className="h-5 w-full bg-gray-300" />
                  <div className="h-5 w-4/5 bg-gray-300" />
                </div>
                <div className="h-14 w-full bg-white border-4 border-black shadow-[4px_4px_0_0_#000] mt-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked */}
      <section className="py-20 md:py-32 px-4 bg-white border-b-8 border-black">
        <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-6">
            <div className="h-8 w-48 bg-gray-300 shadow-[4px_4px_0_0_#000]" />
            <div className="h-24 md:h-32 w-full bg-gray-400" />
            <div className="h-20 w-full bg-gray-200 border-l-8 border-black" />
            <div className="h-16 w-64 bg-gray-600 border-4 border-black shadow-[6px_6px_0_0_#000] mt-4" />
          </div>
          <div className="space-y-4">
            {faqs.map((item) => (
              <div key={item} className="h-36 border-4 border-black bg-gray-100 p-6 md:p-8 shadow-[8px_8px_0_0_#000] flex gap-4">
                <div className="w-8 h-8 bg-gray-300 mt-1 shrink-0" />
                <div className="space-y-3 w-full">
                  <div className="h-6 w-3/4 bg-gray-400" />
                  <div className="h-16 w-full bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deployment Ready */}
      <section className="py-24 md:py-32 px-4 bg-gray-300 border-b-8 border-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gray-400 rounded-full mix-blend-multiply blur-[80px] opacity-60" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gray-400 rounded-full mix-blend-multiply blur-[80px] opacity-60" />
        
        <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8">
            <div className="h-8 w-48 bg-gray-600 shadow-[4px_4px_0_0_#FFFACD]" />
            <div className="h-32 md:h-48 w-full bg-gray-500" />
            <div className="h-24 w-full bg-white/50 border-4 border-black p-4 shadow-[4px_4px_0_0_#000]" />
            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <div className="h-20 w-full sm:w-1/2 bg-gray-600 border-4 border-black shadow-[8px_8px_0_0_#FFB3BA]" />
              <div className="h-20 w-full sm:w-1/2 bg-white border-4 border-black shadow-[8px_8px_0_0_#000]" />
            </div>
          </div>
          
          <div className="border-4 border-black bg-white p-8 md:p-12 shadow-[12px_12px_0_0_#000] flex flex-col gap-8 md:rotate-1">
            <div className="flex items-center gap-5 border-b-4 border-black pb-6">
              <div className="w-16 h-16 bg-gray-600 border-4 border-black" />
              <div className="h-10 w-48 bg-gray-300" />
            </div>
            
            <div className="space-y-6">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 shrink-0 bg-gray-400 border-4 border-black mt-1" />
                  <div className="h-6 w-full bg-gray-200 mt-1" />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
              <div className="h-24 border-4 border-black bg-gray-100 p-5" />
              <div className="h-24 border-4 border-black bg-gray-100 p-5" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
