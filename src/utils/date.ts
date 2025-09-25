import { 
  formatDistanceToNow as originalFormatDistanceToNow,
  format as originalFormat,
  parseISO,
  isValid,
  isDate
} from 'date-fns';

/**
 * Safely converts any date input to a valid Date object
 */
export const ensureDate = (date: any): Date => {
  // If it's already a valid Date object
  if (isDate(date) && isValid(date)) {
    return date;
  }
  
  // If it's a string, try to parse it
  if (typeof date === 'string') {
    try {
      // Try ISO format first
      const parsed = parseISO(date);
      if (isValid(parsed)) return parsed;
      
      // Fallback to native Date parsing
      const nativeParsed = new Date(date);
      if (isValid(nativeParsed)) return nativeParsed;
    } catch (error) {
      console.warn('Date parsing failed:', date, error);
    }
  }
  
  // If it's a number (timestamp)
  if (typeof date === 'number') {
    const fromTimestamp = new Date(date);
    if (isValid(fromTimestamp)) return fromTimestamp;
  }
  
  // Fallback to current date
  console.warn('Invalid date provided, using current date:', date);
  return new Date();
};

/**
 * Safe wrapper for formatDistanceToNow
 */
export const formatDistanceToNow = (date: any, options?: any) => {
  try {
    return originalFormatDistanceToNow(ensureDate(date), { 
      addSuffix: true,
      ...options 
    });
  } catch (error) {
    console.error('formatDistanceToNow error:', error, date);
    return 'Unknown time';
  }
};

/**
 * Safe wrapper for format
 */
export const format = (date: any, formatStr: string, options?: any) => {
  try {
    return originalFormat(ensureDate(date), formatStr, options);
  } catch (error) {
    console.error('format error:', error, date, formatStr);
    return 'Invalid date';
  }
};

/**
 * Helper to format dates consistently across the app
 */
export const formatItemDate = (date: any): string => {
  return format(date, 'PPP'); // Jan 1, 2024
};

export const formatItemTime = (date: any): string => {
  return format(date, 'p'); // 12:00 PM
};

export const formatItemDateTime = (date: any): string => {
  return format(date, 'PPp'); // Jan 1, 2024 at 12:00 PM
};

// Re-export other date-fns functions for convenience
export { parseISO, isValid, isDate } from 'date-fns';