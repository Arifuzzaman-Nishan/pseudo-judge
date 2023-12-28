import * as z from "zod";

export const GroupFormSchema = z.object({
  groupName: z.string({
    required_error: "Group name is required",
  }),
  enrollmentKeyExpiration: z.string({
    required_error: "Enrollment key expiration is required",
  }),
});

export type GroupFormFieldTypes = keyof z.infer<typeof GroupFormSchema>;
