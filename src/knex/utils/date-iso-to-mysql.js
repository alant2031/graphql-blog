export const createDate = (dateISOString) => {
  let date;
  if (!dateISOString) {
    date = new Date();
  } else {
    date = new Date(dateISOString);
  }

  return date.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'medium',
  });
};

export const dateISOtoMySQL = (dateISOString) => {
  const dateArgs = createDate(dateISOString);
  const [date, time] = dateArgs.split(' ');
  const [d, m, y] = date.split('/');
  return `${y}-${m}-${d} ${time}`;
};
