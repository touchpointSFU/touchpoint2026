export type Speaker = {
  names: string | string[];
  company: string;
  alum: boolean | boolean[];
};

export const speakers: Speaker[] = [
  {
    names: "Mischa Price",
    company: "London Borough of Hounslow",
    alum: true,
  },
  {
    names: ["Dave", "Marina", "Breanne"],
    company: "EA",
    alum: [false, false, true],
  },
  {
    names: "Ryan Romero",
    company: "Monday Creative",
    alum: false,
  },
  {
    names: "tbd",
    company: "Circle Innovation",
    alum: false,
  },
  {
    names: "Danny Farra",
    company: "Google",
    alum: false,
  },
  {
    names: "Danny Farra",
    company: "Google",
    alum: false,
  },
  {
    names: "Steven Cox",
    company: "Cause+Affect",
    alum: false,
  },
  {
    names: "Amanda Poh",
    company: "Microsoft",
    alum: true,
  },
];
