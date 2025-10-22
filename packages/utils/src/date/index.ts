export const formatDate = (date: Date, locale = 'it-IT'): string => {
    return new Intl.DateTimeFormat(locale).format(date);
};

export const formatDateTime = (date: Date, locale = 'it-IT'): string => {
    return new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
};

export const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

export const addWeeks = (date: Date, weeks: number): Date => {
    return addDays(date, weeks * 7);
};

export const isExpired = (date: Date): boolean => {
    return date.getTime() < Date.now();
};

