export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const formatISO = (date: Date): string => {

  const timezoneOffset = date.getTimezoneOffset() * 60000;

  const utcDate = new Date(date.getTime() - timezoneOffset);

  return utcDate.toISOString();
}