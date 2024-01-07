import { DateTime } from "luxon";

export const timeStampsToDateTime = (timeStamp: string) => {
  const dateTime = DateTime.fromISO(timeStamp);
  return dateTime.toFormat("dd/MM/yyyy");
};
