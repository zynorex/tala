interface TimelineCardProps {
  number: number;
  title: string;
  description: string;
  delay?: number;
  accentColor?: 'yellow' | 'pink' | 'green' | 'blue';
}

export default function TimelineCard({
  number,
  title,
  description,
  delay = 0,
  accentColor = 'yellow',
}: TimelineCardProps) {
  const accentBg = {
    yellow: 'bg-heirlock-yellow',
    pink: 'bg-heirlock-pink',
    green: 'bg-heirlock-green',
    blue: 'bg-heirlock-blue',
  }[accentColor];

  return (
    <div
      className={`card-timeline animate-slideInLeft group`}
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      {/* Step Number Circle */}
      <div className={`${accentBg} w-12 h-12 rounded-full flex items-center justify-center font-black text-black text-lg absolute -left-6 top-6 border-4 border-cream shadow-brutal group-hover:scale-110 transition-transform`}>
        {number}
      </div>

      {/* Vertical Line (on desktop) */}
      <div className="hidden md:block absolute left-0 top-20 w-1 h-32 bg-black opacity-10"></div>

      {/* Content */}
      <div className="ml-0">
        <h3 className="text-lg font-black text-black mb-2 group-hover:text-black transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors leading-relaxed">
          {description}
        </p>
      </div>

      {/* Animated Underline */}
      <div className={`h-1 ${accentBg} w-0 group-hover:w-full transition-all duration-300 mt-4`}></div>
    </div>
  );
}
