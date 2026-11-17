import React from 'react';

interface LogoProps {
  /** "horizontal" = full wordmark, "symbol" = icon only */
  variant?: 'horizontal' | 'symbol';
  /** true when the logo sits on a dark background */
  onDark?: boolean;
  className?: string;
}

/**
 * Single source of truth for the ResolvAI brand mark.
 * Uses plain <img> with absolute public paths — no bundler config needed.
 */
export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  onDark = false,
  className = '',
}) => {
  const src =
    variant === 'symbol'
      ? onDark
        ? '/brand/resolvai-symbol-reversed.svg'
        : '/brand/resolvai-symbol.svg'
      : onDark
        ? '/brand/resolvai-logo-horizontal-reversed.svg'
        : '/brand/resolvai-logo-horizontal.svg';

  return (
    <img
      src={src}
      alt="ResolvAI"
      draggable={false}
      className={className}
      style={{
        height: '44px',
        width: 'auto',
        filter: 'drop-shadow(0 0 0.4px currentColor) drop-shadow(0 0 0.4px currentColor)',
      }}
    />
  );
};
