import { parseISO, isValid } from 'date-fns';

export const safeParseDate = (date: string | Date | undefined): Date => {
  if (!date) return new Date();
  
  if (date instanceof Date) {
    return isValid(date) ? date : new Date();
  }
  
  try {
    const parsed = parseISO(date);
    return isValid(parsed) ? parsed : new Date();
  } catch {
    return new Date();
  }
};

export const ensureDate = (date: any): Date => {
  if (date instanceof Date && isValid(date)) {
    return date;
  }
  
  if (typeof date === 'string') {
    return safeParseDate(date);
  }
  
  return new Date();
};