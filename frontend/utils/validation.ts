export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateWalletAddress(address: string): boolean {
  try {
    return address.length >= 32 && address.length <= 44;
  } catch {
    return false;
  }
}

export function validateBountyAmount(amount: number): boolean {
  return amount > 0 && amount < 1000000;
}

export function validateDescription(description: string, minLength: number = 20): boolean {
  return description.trim().length >= minLength;
}

export function validateTitle(title: string): boolean {
  return title.trim().length >= 3 && title.trim().length <= 100;
}

export function validateDeadline(deadline: Date): boolean {
  const now = new Date();
  return deadline > now;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatCurrency(amount: number, decimals: number = 2): string {
  return amount.toFixed(decimals);
}

export function getTimeRemaining(deadline: Date): string {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();

  if (diff <= 0) {
    return 'Expired';
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) {
    return `${days}d ${hours}h remaining`;
  }

  return `${hours}h remaining`;
}
