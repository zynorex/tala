const heroStats = [1, 2, 3];
const timelineSteps = [1, 2, 3, 4];
const narrativeCards = [1, 2, 3];
const capabilityCards = [1, 2, 3, 4];
const storyboard = [1, 2, 3, 4];
const blueprintBlocks = [1, 2, 3, 4];
const securityLayers = [1, 2, 3, 4];
const trustSignals = [1, 2, 3, 4];
const faqs = [1, 2, 3, 4];
const pricingTiers = [1, 2, 3];

export default function PageSkeleton() {
  return (
    <main className="min-h-screen bg-cream animate-pulse">
      {/* Hero */}
      <section className="bg-gradient-to-br from-heirlock-yellow via-white to-heirlock-blue border-b-4 border-black py-14 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="h-6 w-48 bg-white/70 border-4 border-black" />
            <div className="h-24 w-full bg-white/60 border-4 border-black" />
            <div className="h-20 w-4/5 bg-white/50 border-4 border-black" />
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="h-12 w-40 bg-black/70 border-4 border-black" />
              <div className="h-12 w-40 bg-white/80 border-4 border-black" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {heroStats.map((item) => (
                <div key={item} className="h-20 bg-white/70 border-4 border-black" />
              ))}
            </div>
          </div>

          <div className="border-4 border-black bg-white p-6 flex flex-col gap-5">
            <div className="h-6 w-40 bg-gray-200" />
            <div className="h-10 w-3/4 bg-gray-100" />
            <div className="space-y-4">
              {timelineSteps.map((step, idx) => (
                <div key={step} className="flex gap-3 items-start">
                  <div className="flex flex-col items-center pt-1">
                    <span className="h-7 w-14 bg-heirlock-yellow border-2 border-black" />
                    {idx < timelineSteps.length - 1 && <span className="w-px flex-1 bg-black" />}
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200" />
                    <div className="h-4 w-48 bg-gray-100" />
                    <div className="h-3 w-40 bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
            <div className="h-10 w-full bg-black/80" />
          </div>
        </div>
      </section>

      {/* Proof rail */}
      <section className="py-8 border-b-4 border-black bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="h-4 w-32 bg-gray-200" />
            <div className="flex flex-wrap gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-5 w-32 bg-gray-100" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Narrative */}
      <section className="py-16 px-4 border-b-4 border-black bg-black">
        <div className="container mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {narrativeCards.map((card) => (
            <div key={card} className="border-4 border-heirlock-green bg-white/10 h-40" />
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16 px-4 border-b-4 border-black bg-cream">
        <div className="container mx-auto max-w-5xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-2">
              <div className="h-3 w-28 bg-gray-200" />
              <div className="h-10 w-64 bg-gray-100" />
            </div>
            <div className="h-10 w-40 bg-white border-3 border-black" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilityCards.map((card) => (
              <div key={card} className="border-4 border-black bg-white h-36" />
            ))}
          </div>
        </div>
      </section>

      {/* Journey storyboard */}
      <section className="py-16 px-4 border-b-4 border-black bg-heirlock-blue">
        <div className="container mx-auto max-w-5xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="h-3 w-28 bg-gray-300" />
              <div className="h-10 w-64 bg-gray-200" />
            </div>
            <div className="h-12 w-64 bg-gray-200" />
          </div>
          <div className="space-y-4">
            {storyboard.map((item) => (
              <div key={item} className="border-4 border-black bg-white h-28" />
            ))}
          </div>
        </div>
      </section>

      {/* Blueprint */}
      <section className="py-16 px-4 border-b-4 border-black bg-white">
        <div className="container mx-auto max-w-5xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="h-3 w-28 bg-gray-200" />
              <div className="h-10 w-64 bg-gray-100" />
            </div>
            <div className="h-12 w-64 bg-gray-200" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blueprintBlocks.map((item) => (
              <div key={item} className="border-4 border-black bg-cream h-32" />
            ))}
          </div>
        </div>
      </section>

      {/* Security layers */}
      <section className="py-16 px-4 border-b-4 border-black bg-cream">
        <div className="container mx-auto max-w-5xl space-y-6">
          <div className="h-8 w-56 bg-gray-200" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityLayers.map((item) => (
              <div key={item} className="border-4 border-black bg-white h-28" />
            ))}
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-16 px-4 border-b-4 border-black bg-white">
        <div className="container mx-auto max-w-5xl space-y-8">
          <div className="h-8 w-56 bg-gray-200" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustSignals.map((item) => (
              <div key={item} className="border-4 border-black bg-gray-100 h-20" />
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 border-b-4 border-black bg-cream">
        <div className="container mx-auto max-w-5xl space-y-6">
          <div className="h-10 w-64 bg-gray-200" />
          <div className="space-y-3">
            {faqs.map((item) => (
              <div key={item} className="border-4 border-black bg-white h-16" />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl space-y-8">
          <div className="h-10 w-64 bg-gray-200" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingTiers.map((item) => (
              <div key={item} className="border-4 border-black bg-cream h-52" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

