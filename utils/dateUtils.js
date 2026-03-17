// Date utilities

function formatDate(date, format = 'long') {
  if (!date) return '';

  const options = {
    short: { year: '2-digit', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  };

  return new Date(date).toLocaleDateString('en-US', options[format] || options.long);
}

function formatTime(timeString) {
  if (!timeString) return '';
  const [hour, minute] = timeString.split(':');
  const date = new Date(2000, 0, 1, parseInt(hour), parseInt(minute));
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatDateTime(date, format = 'long') {
  if (!date) return '';
  const dateStr = formatDate(date, format);
  const timeStr = new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${dateStr} at ${timeStr}`;
}

function getDaysFromNow(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function isToday(date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function isFuture(date) {
  return new Date(date) > new Date();
}

module.exports = {
  formatDate,
  formatTime,
  formatDateTime,
  getDaysFromNow,
  isToday,
  isFuture,
};
