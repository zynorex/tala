import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
  accentColor?: 'yellow' | 'pink' | 'green' | 'blue';
}

export default function FeatureCard({
  icon,
  title,
  description,
  delay = 0,
  accentColor = 'yellow',
}: FeatureCardProps) {
  const accentBg = {
    yellow: 'bg-heirlock-yellow',
    pink: 'bg-heirlock-pink',
    green: 'bg-heirlock-green',
    blue: 'bg-heirlock-blue',
  }[accentColor];

  const accentBorder = {
    yellow: 'border-heirlock-yellow',
    pink: 'border-heirlock-pink',
    green: 'border-heirlock-green',
    blue: 'border-heirlock-blue',
  }[accentColor];

  return (
    <div
      className={`card-feature animate-slideUp stagger-${delay} group cursor-pointer`}
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      {/* Icon Container */}
      <div className={`${accentBg} w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:animate-bounce transition-all`}>
        <div className="text-2xl">{icon}</div>
      </div>

      {/* Content */}
      <h3 className="text-lg font-black text-black mb-2 group-hover:text-black transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors leading-relaxed">
        {description}
      </p>

      {/* Bottom Accent Line */}
      <div className={`h-1 ${accentBorder} border-b-2 mt-4 w-0 group-hover:w-full transition-all duration-300`}></div>
    </div>
  );
}
