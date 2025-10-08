export const formatDate = dateString => {
  if (!dateString) return ''
  const d = new Date(dateString)
  return `${String(d.getUTCDate()).padStart(2, '0')}-${String(
    d.getUTCMonth() + 1
  ).padStart(2, '0')}-${d.getUTCFullYear()}`
}


export const convertToISO = (dateStr) => {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split('-');
  return `${year}-${month}-${day}`;
};

