function padZero(number) {
  return number.toString().padStart(2, '0');
}

export function extractTime(dateString) {
  const date = new Date(dateString);
  let hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;

  const hoursStr = padZero(hours);
  const minutesStr = padZero(date.getMinutes());

  return `${hoursStr}:${minutesStr} ${ampm}`;
}
