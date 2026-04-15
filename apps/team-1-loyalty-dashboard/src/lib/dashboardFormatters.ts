export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatSignedNumber(value: number) {
  if (value === 0) {
    return '0';
  }

  return `${value > 0 ? '+' : ''}${formatNumber(value)}`;
}

export function formatMonthLabel(label?: string, date?: string) {
  if (label) {
    return label;
  }

  if (!date) {
    return 'Unknown';
  }

  const parsedDate = new Date(`${date}-01T00:00:00Z`);

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
  }).format(parsedDate);
}

export function formatMemberName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`;
}
