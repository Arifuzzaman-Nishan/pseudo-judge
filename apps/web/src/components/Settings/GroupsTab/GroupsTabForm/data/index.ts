export const groupFromField = [
  {
    key: 1,
    name: "groupName",
    label: "Group Name",
    placeholder: "Enter your group name",
    type: "text",
  },
  {
    key: 2,
    name: "cutoffNumber",
    label: "Cutoff Number",
    placeholder: "Enter the group cutoff number",
    type: "number",
  },
  {
    key: 3,
    name: "cutoffInterval",
    label: "Cutoff Interval",
    placeholder: "Select the group cutoff interval",
    type: "select",
    defaultValue: "weekly",
    options: [
      {
        key: 1,
        label: "Weekly",
        value: "weekly",
      },
      {
        key: 2,
        label: "Monthly",
        value: "monthly",
      },
    ],
  },
  // {
  //   key: 4,
  //   name: "cutoffStartDate",
  //   label: "Cutoff Start Date",
  //   placeholder: "Enter the group cutoff start date",
  //   type: "date",
  // },
];
