export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s-()]+$/;
    return phoneRegex.test(phone);
};

export const formatCurrency = (amount: number, currency = 'EUR'): string => {
    return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency,
    }).format(amount / 100); // Assuming amount is in cents
};

