import { DateTime } from "luxon";

export const timeStampsToDateTime = (timeStamp: string) => {
  const dateTime = DateTime.fromISO(timeStamp);
  return dateTime.toFormat("dd/MM/yyyy");
};

export const relativeTime = (time: string) => {
  const dt = DateTime.fromISO(time);
  return dt.toRelative();
};

export const verdictColor = {
  accepted: "bg-green-500",
  "wrong answer": "bg-red-500",
  "time limit exceeded": "bg-yellow-500",
  "runtime error": "bg-yellow-500",
  "memory limit exceeded": "bg-yellow-500",
  "compilation error": "bg-yellow-500",
  "presentation error": "bg-yellow-500",
  "submission error": "bg-yellow-500",
  "judgement failed": "bg-yellow-500",
  "output limit exceeded": "bg-yellow-500",
  running: "bg-yellow-500",
  queuing: "bg-yellow-500",
  "in queue": "bg-yellow-500",
  "in progress": "bg-yellow-500",
  submitted: "bg-yellow-500",
  "partially correct": "bg-yellow-500",
  "compile error": "bg-yellow-500",
};
