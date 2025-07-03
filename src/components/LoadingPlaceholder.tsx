import React from 'react';

interface LoadingPlaceholderProps {
  width?: string;
  height?: string;
  className?: string;
}

export default function LoadingPlaceholder({ width = '100%', height = '2rem', className = '' }: LoadingPlaceholderProps) {
  const variants = [
    'bg-dark',
    'bg-primary',
    'bg-secondary',
    'bg-success',
    'bg-danger',
    'bg-warning',
    'bg-info',
  ];

  return (
    <div style={{ width }} className={className}>
      {variants.map((variant, idx) => (
        <span
          key={idx}
          className={`placeholder col-12 mb-1 ${variant}`.trim()}
          style={{ height, display: 'block', margin: 0 }}
        />
      ))}
    </div>
  );
}
