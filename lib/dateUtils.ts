export const isoToLocalDate = (date?: Date) => {
  return (
    date &&
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}T${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
      date.getSeconds()
    ).padStart(2, "0")}`
  );
};

export const dateResetOffset = (date: Date) => {
  const offset = date.getTimezoneOffset();
  const calc = date.valueOf() + offset * 60000;
  return new Date(calc);
};

const dateUtcToLocalStr = (date: Date) => {
  const str = date
    .toLocaleString("fr-FR", { timeZone: "Europe/Paris" })
    .replace(" ", "T")
    .replace(/\//g, "-");
  return new Date(str);
};
