'use client';

import { useEffect, useRef, useState } from 'react';

interface CounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

function AnimatedCounter({ end, duration = 1500, prefix = '', suffix = '', className = '' }: CounterProps) {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    startTime.current = null;

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration]);

  return (
    <span className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

interface SavingsHeroProps {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isAlreadyOptimal: boolean;
}

export default function SavingsHero({
  totalMonthlySavings,
  totalAnnualSavings,
  isAlreadyOptimal,
}: SavingsHeroProps) {
  if (isAlreadyOptimal) {
    return (
      <div className="text-center py-12 fade-in">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="font-syne text-3xl font-bold text-green-400 mb-3">
          You&apos;re spending well.
        </h2>
        <p className="text-slate-400 text-lg max-w-md mx-auto">
          Your current AI tool stack is well-optimized. We&apos;ll monitor pricing changes and notify
          you when new optimizations apply.
        </p>
        <div className="mt-6 inline-block px-4 py-2 bg-green-400/10 border border-green-400/30 rounded-full">
          <span className="text-green-400 text-sm font-medium">✓ Stack is optimized</span>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-10 fade-in">
      <p className="text-slate-400 text-sm uppercase tracking-widest mb-3 font-medium">
        Potential Monthly Savings
      </p>
      <div className="count-up">
        <AnimatedCounter
          end={Math.round(totalMonthlySavings)}
          prefix="$"
          suffix="/mo"
          duration={1200}
          className="font-syne text-6xl sm:text-7xl font-bold text-cyan-400"
        />
      </div>
      <p className="text-slate-300 text-xl mt-4 font-medium">
        That&apos;s{' '}
        <AnimatedCounter
          end={Math.round(totalAnnualSavings)}
          prefix="$"
          duration={1400}
          className="text-white font-bold"
        />{' '}
        saved per year
      </p>
      <div className="flex items-center justify-center gap-2 mt-4">
        <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <p className="text-slate-500 text-sm">Based on official vendor pricing — sources cited</p>
      </div>
    </div>
  );
}
