import { DifficultyRating, OJName } from "@/types";
import * as z from "zod";

export const ProblemFormSchema = z.object({
  url: z.string({
    required_error: "Url is required",
  }),
  ojName: z.nativeEnum(OJName, {
    required_error: "Please select an OJ name",
  }),
  difficultyRating: z.nativeEnum(DifficultyRating, {
    required_error: "Please select a difficulty rating",
  }),
});

export type FormFieldType = keyof z.infer<typeof ProblemFormSchema>;
