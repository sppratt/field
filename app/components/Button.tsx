import React from 'react';
import Link from 'next/link';
import styles from '@/app/styles/Button.module.css';
import { cn } from '@/app/utils/cn';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  aria?: {
    label?: string;
    describedBy?: string;
  };
}

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      children,
      variant = 'primary',
      size = 'medium',
      fullWidth = false,
      disabled = false,
      onClick,
      className,
      href,
      type = 'button',
      aria = {},
    },
    ref
  ) => {
    const buttonClasses = cn(
      styles.button,
      styles[variant],
      size !== 'medium' && styles[size],
      fullWidth && styles.fullWidth,
      className
    );

    if (href) {
      return (
        <Link
          href={href}
          className={buttonClasses}
          ref={ref as React.Ref<HTMLAnchorElement>}
          aria-label={aria.label}
          aria-describedby={aria.describedBy}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={buttonClasses}
        disabled={disabled}
        onClick={onClick}
        type={type}
        aria-label={aria.label}
        aria-describedby={aria.describedBy}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
