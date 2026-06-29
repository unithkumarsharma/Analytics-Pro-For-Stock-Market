import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  formatIndian?: boolean;
}

/**
 * Smoothly animates a number from 0 (or previous value) to the target value.
 * Supports Indian number formatting (lakhs/crores).
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1.5,
  decimals = 2,
  prefix = '',
  suffix = '',
  className = '',
  formatIndian = false,
}) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 80,
    damping: 20,
    duration: duration * 1000,
  });

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (nodeRef.current) {
        let formatted: string;
        if (formatIndian) {
          formatted = formatIndianNumber(latest, decimals);
        } else {
          formatted = latest.toLocaleString('en-IN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          });
        }
        nodeRef.current.textContent = `${prefix}${formatted}${suffix}`;
      }
    });

    return unsubscribe;
  }, [springValue, prefix, suffix, decimals, formatIndian]);

  return <span ref={nodeRef} className={className} />;
};

/** Format number in Indian locale (12,34,567.89) */
function formatIndianNumber(num: number, decimals: number): string {
  const parts = num.toFixed(decimals).split('.');
  const intPart = parts[0];
  const decPart = parts[1];
  
  const lastThree = intPart.slice(-3);
  const rest = intPart.slice(0, -3);
  
  let formatted = lastThree;
  if (rest.length > 0) {
    // Add commas every 2 digits for the remaining portion (Indian numbering)
    const reversed = rest.split('').reverse().join('');
    const chunks: string[] = [];
    for (let i = 0; i < reversed.length; i += 2) {
      chunks.push(reversed.slice(i, i + 2));
    }
    formatted = chunks.join(',').split('').reverse().join('') + ',' + lastThree;
  }
  
  return decPart ? `${formatted}.${decPart}` : formatted;
}

/**
 * A simple variant that flashes green/red on value changes
 */
interface FlashCounterProps {
  value: number;
  decimals?: number;
  prefix?: string;
  className?: string;
}

export const FlashCounter: React.FC<FlashCounterProps> = ({
  value,
  decimals = 2,
  prefix = '',
  className = '',
}) => {
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);
  const prevValue = useRef(value);

  useEffect(() => {
    if (value > prevValue.current) {
      setFlash('up');
    } else if (value < prevValue.current) {
      setFlash('down');
    }
    prevValue.current = value;
    const timer = setTimeout(() => setFlash(null), 600);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <motion.span
      className={`${className} transition-colors duration-300 ${
        flash === 'up'
          ? 'text-emerald-300'
          : flash === 'down'
          ? 'text-red-300'
          : ''
      }`}
      animate={flash ? { scale: [1, 1.03, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      {prefix}
      {value.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </motion.span>
  );
};

export default AnimatedCounter;
