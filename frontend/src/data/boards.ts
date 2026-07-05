import type { Board } from "../types/data.types";

export const boardTypes: Board[] = [
  {
    code: "FB",
    name: "Full Board",
    description: "Breakfast, lunch & dinner included",
  },
  {
    code: "HB",
    name: "Half Board",
    description: "Breakfast & one meal included (lunch or dinner)",
  },
  {
    code: "NB",
    name: "No Board",
    description: "No meals included",
  },
];

export default boardTypes;
