interface StatCardProps {
  number: string | number;
  label: string;
  suffix?: string;
  delay?: number;
  accentColor?: 'yellow' | 'pink' | 'green' | 'blue';
}

export default function StatCard({
  number,
  label,
  suffix = '',
  delay = 0,
  accentColor = 'yellow',
}: StatCardProps) {
  const accentBg = {
    yellow: 'bg-heirlock-yellow',
    pink: 'bg-heirlock-pink',
    green: 'bg-heirlock-green',
    blue: 'bg-heirlock-blue',
  }[accentColor];

  return (
    <div
      className={`card-stat animate-scaleIn`}
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      {/* Number */}
      <div className={`text-5xl md:text-6xl font-black mb-2 transition-all group-hover:scale-110 inline-block`}>
        <span className="bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
          {number}
        </span>
        <span className="text-2xl ml-1">{suffix}</span>
      </div>

      {/* Label */}
      <p className="text-sm md:text-base font-bold text-gray-700 mt-3">
        {label}
      </p>

      {/* Animated Bottom Border */}
      <div className={`h-1 ${accentBg} w-12 mt-4 group-hover:w-full transition-all duration-300 rounded-full`}></div>
    </div>
  );
}
