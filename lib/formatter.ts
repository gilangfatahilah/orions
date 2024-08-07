export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-EN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const formatMonth = (num: number): string => {
  const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[num - 1];
}

export const formatISO = (date: Date): string => {
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  const utcDate = new Date(date.getTime() - timezoneOffset);

  return utcDate.toISOString();
}

export const formatCurrency = (currency: number): string => {
  const formatCurrency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  })

  return formatCurrency.format(currency);
}

export const parseCurrency = (currency: string): number => {
  const numberString = currency.replace(/Rp\s?|\.|,/g, '');
  const number = parseInt(numberString);
  
  return number;
}