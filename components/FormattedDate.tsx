'use client';

import React, { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function useIsClient(): boolean {
  return useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
}

interface FormattedDateProps {
  date?: string | number | Date | null;
  format?: 'datetime' | 'date' | 'time';
  className?: string;
  fallback?: string;
}

export const FormattedDate: React.FC<FormattedDateProps> = ({
  date,
  format = 'datetime',
  className = '',
  fallback = '-',
}) => {
  const isClient = useIsClient();

  if (!date) {
    return <span className={className}>{fallback}</span>;
  }

  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return <span className={className}>{String(date)}</span>;
  }

  // Consistent, deterministic UTC formatting for initial SSR & hydration render
  const pad = (n: number) => String(n).padStart(2, '0');
  const day = pad(d.getUTCDate());
  const month = pad(d.getUTCMonth() + 1);
  const year = d.getUTCFullYear();
  const hours = pad(d.getUTCHours());
  const minutes = pad(d.getUTCMinutes());
  const seconds = pad(d.getUTCSeconds());

  let staticDisplay = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  if (format === 'date') staticDisplay = `${day}.${month}.${year}`;
  if (format === 'time') staticDisplay = `${hours}:${minutes}`;

  const displayText = isClient
    ? format === 'date'
      ? d.toLocaleDateString('tr-TR')
      : format === 'time'
      ? d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      : d.toLocaleString('tr-TR')
    : staticDisplay;

  return (
    <span suppressHydrationWarning className={className}>
      {displayText}
    </span>
  );
};
