import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return format(date, 'dd.MM.yyyy HH:mm', { locale: ru });
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return format(date, 'dd.MM.yyyy', { locale: ru });
};

export const formatTime = (dateString) => {
  if (!dateString) return '-';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return format(date, 'HH:mm', { locale: ru });
};