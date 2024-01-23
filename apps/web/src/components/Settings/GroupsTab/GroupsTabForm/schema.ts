import * as z from "zod";

export const GroupFormSchema = z.object({
  groupName: z.string({
    required_error: "Group name is required",
  }),
  cutoffNumber: z.coerce.number({
    required_error: "Cutoff number is required",
  }),
  cutoffInterval: z.string({
    required_error: "Cutoff interval is required",
  }),
  cutoffStartDate: z.date({
    required_error: "Cutoff start date is required",
  }),
});

export type GroupFormFieldTypes = keyof z.infer<typeof GroupFormSchema>;
