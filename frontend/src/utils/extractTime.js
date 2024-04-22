// export function extractTime(dateString) {
//   const date = new Date(dateString);
//   const hours = padZero(date.getHours());
//   const minutes = padZero(date.getMinutes());
//   return `${hours}:${minutes}`;
// }

// Helper function to pad single-digit numbers with a leading zero
function padZero(number) {
  return number.toString().padStart(2, "0");
}

export function extractTime(dateString) {
  const date = new Date(dateString);
  let hours = date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert midnight (0 hours) to 12 AM

  const hoursStr = padZero(hours);
  const minutesStr = padZero(date.getMinutes());

  return `${hoursStr}:${minutesStr} ${ampm}`;
}
