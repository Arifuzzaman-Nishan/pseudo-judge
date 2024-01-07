import { AxiosError } from "axios";

const errorFn = (err: AxiosError) => {
  if (err.message.includes("500")) {
    return "Something went wrong. please try again later";
  } else {
    return (err.response?.data as any)?.error;
  }
};

export default errorFn;
