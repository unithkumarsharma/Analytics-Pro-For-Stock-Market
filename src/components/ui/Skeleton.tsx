import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rect' | 'card';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rect',
  width,
  height,
  lines = 1,
}) => {
  if (variant === 'card') {
    return (
      <div className={`glass-card p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="skeleton w-10 h-10 rounded-full" />
          <div className="flex-1">
            <div className="skeleton h-4 w-24 mb-2 rounded" />
            <div className="skeleton h-3 w-16 rounded" />
          </div>
        </div>
        <div className="skeleton h-8 w-32 mb-3 rounded" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    );
  }

  if (variant === 'circle') {
    return (
      <div
        className={`skeleton rounded-full ${className}`}
        style={{ width: width || 40, height: height || 40 }}
      />
    );
  }

  if (lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="skeleton rounded"
            style={{
              width: i === lines - 1 ? '60%' : '100%',
              height: height || 16,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={`skeleton rounded ${className}`}
      style={{ width: width || '100%', height: height || 16 }}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
  );
};

/** Loading skeleton for entire dashboard cards grid */
export const DashboardSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <Skeleton key={i} variant="card" />
    ))}
  </div>
);

/** Loading skeleton for table rows */
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 8,
  cols = 6,
}) => (
  <div className="glass-card overflow-hidden">
    <div className="p-4 border-b border-white/5">
      <Skeleton height={20} width={160} />
    </div>
    <div className="p-4 space-y-3">
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="flex items-center gap-4">
          {Array.from({ length: cols }).map((_, col) => (
            <Skeleton
              key={col}
              height={14}
              width={col === 0 ? 60 : col === 1 ? 140 : 80}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
