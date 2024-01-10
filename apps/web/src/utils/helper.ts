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
  Accepted: "bg-green-500",
  "Wrong Answer": "bg-red-500",
  "Time Limit Exceeded": "bg-yellow-500",
  "Runtime Error": "bg-yellow-500",
  "Memory Limit Exceeded": "bg-yellow-500",
  "Compilation Error": "bg-yellow-500",
  "Presentation Error": "bg-yellow-500",
  "Submission Error": "bg-yellow-500",
  "Judgement Failed": "bg-yellow-500",
  "Output Limit Exceeded": "bg-yellow-500",
  Running: "bg-yellow-500",
  Queuing: "bg-yellow-500",
  "In Queue": "bg-yellow-500",
  "In Progress": "bg-yellow-500",
  Submitted: "bg-yellow-500",
  "Partially Correct": "bg-yellow-500",
  "Compile Error": "bg-yellow-500",
};
