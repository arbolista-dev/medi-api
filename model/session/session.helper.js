export function stringDateToInt(date) {
  return Math.floor(new Date(date) / 1000)
}

export function intToDateString(seconds) {
  return new Date(seconds)
}
