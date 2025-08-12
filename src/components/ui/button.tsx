'use client';

import React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline';
};

export const Button = ({
  children,
  variant = 'default',
  className,
  ...props
}: ButtonProps) => {
  const base = 'px-4 py-2 rounded-xl font-semibold text-sm transition';
  const styles = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
  };

  return (
    <button className={clsx(base, styles[variant], className)} {...props}>
      {children}
    </button>
  );
};

