export function formatDate(isoString?: string): string {
  if (!isoString) return 'Not recorded';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export function formatTime(isoString?: string): string {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export function getScoreColorClass(score: number | null): string {
  if (score === null) return 'text-charcoal-muted bg-surface-subtle border-surface-border';
  if (score >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (score >= 70) return 'text-blue-700 bg-blue-50 border-blue-200';
  if (score >= 55) return 'text-amber-700 bg-amber-50 border-amber-200';
  return 'text-rose-700 bg-rose-50 border-rose-200';
}

export function getScoreBadgeClass(score: number | null): string {
  if (score === null) return 'bg-gray-100 text-gray-700';
  if (score >= 85) return 'bg-emerald-100 text-emerald-800';
  if (score >= 70) return 'bg-blue-100 text-blue-800';
  if (score >= 55) return 'bg-amber-100 text-amber-800';
  return 'bg-rose-100 text-rose-800';
}
