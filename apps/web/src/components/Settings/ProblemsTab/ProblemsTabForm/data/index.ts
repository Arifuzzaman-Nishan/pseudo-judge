import { DifficultyRating, OJName } from "@/types";

export const formFields = [
  {
    key: 1,
    name: "url",
    label: "Url",
    placeholder: "Enter the url of the problem",
    type: "text",
  },
  {
    key: 2,
    name: "ojName",
    label: "OJ Name",
    type: "select",
    placeholder: "Select the OJ name",
    options: [
      // {
      //   key: 1,
      //   label: "Timus OJ",
      //   value: OJName.TIMUS,
      // },
      // {
      //   key: 2,
      //   label: "Codeforces",
      //   value: OJName.CODEFORCES,
      // },
      {
        key: 3,
        label: "LightOJ",
        value: OJName.LOJ,
      },
      {
        key: 4,
        label: "UVA",
        value: OJName.UVA,
      },
      // {
      //   key: 5,
      //   label: "SPOJ",
      //   value: OJName.SPOJ,
      // },
    ],
  },
  {
    key: 3,
    name: "difficultyRating",
    label: "Difficulty Rating",
    type: "select",
    placeholder: "Select the difficulty rating",
    options: [
      {
        key: 1,
        label: "Easy",
        value: DifficultyRating.EASY,
      },
      {
        key: 2,
        label: "Medium",
        value: DifficultyRating.MEDIUM,
      },
      {
        key: 3,
        label: "Hard",
        value: DifficultyRating.HARD,
      },
    ],
  },
];
