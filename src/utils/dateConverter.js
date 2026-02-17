import * as ethiopianDate from "ethiopian-date";

// Converts a JS Date object to Ethiopian date string: "dd MMM yyyy"
export const convertToEthiopian = (dateObj) => {
  const { year, month, day } = ethiopianDate.toEthiopian(
    dateObj.getFullYear(),
    dateObj.getMonth() + 1,
    dateObj.getDate()
  );

  const monthNames = [
    "Meskerem", "Tikimt", "Hidar", "Tahsas", "Tir", "Yekatit",
    "Megabit", "Miyazya", "Ginbot", "Sene", "Hamle", "Nehase", "Pagumen"
  ];

  return `${day} ${monthNames[month - 1]} ${year}`;
};

// Converts a JS Date object to Gregorian date string: "dd MMM yyyy"
export const convertToGregorian = (dateObj) => {
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString("default", { month: "short" });
  const year = dateObj.getFullYear();
  return `${day} ${month} ${year}`;
};
