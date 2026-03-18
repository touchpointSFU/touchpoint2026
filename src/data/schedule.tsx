export type ScheduleItem = {
  item: string;
  subitem?: string;
  start: Date;
  end: Date;
};

export const schedule: ScheduleItem[] = [
  {
    item: "Doors open",
    start: new Date(2026, 3, 21, 8, 30),
    end: new Date(2026, 3, 21, 9, 30),
  },
  {
    item: "Opening remarks",
    start: new Date(2026, 3, 21, 9, 30),
    end: new Date(2026, 3, 21, 9, 45),
  },
  {
    item: "Mischa Price",
    subitem: "London Borough of Hounslow",
    start: new Date(2026, 3, 21, 9, 45),
    end: new Date(2026, 3, 21, 10, 15),
  },
  {
    item: "Dave Swanson, Breanne Lewis, Marina Martin",
    subitem:"Electronic Arts (EA)",
    start: new Date(2026, 3, 21, 10, 15),
    end: new Date(2026, 3, 21, 10, 45),
  },
  {
    item: "Ryan Romero",
    subitem: "Monday Creative",
    start: new Date(2026, 3, 21, 10, 45),
    end: new Date(2026, 3, 21, 11, 15),
  },
  {
    item: "Circle Innovation",
    start: new Date(2026, 3, 21, 11, 15),
    end: new Date(2026, 3, 21, 11, 30),
  },
  {
    item: "Lunch",
    start: new Date(2026, 3, 21, 11, 30),
    end: new Date(2026, 3, 21, 12, 45),
  },
  {
    item: "Danny Farra",
    subitem: "Google",
    start: new Date(2026, 3, 21, 13, 0),
    end: new Date(2026, 3, 21, 13, 30),
  },
  {
    item: "Steven Cox",
    subitem: "Cause+Affect",
    start: new Date(2026, 3, 21, 13, 30),
    end: new Date(2026, 3, 21, 14, 0),
  },
  {
    item: "Amanda Poh",
    subitem: "Microsoft",
    start: new Date(2026, 3, 21, 14, 0),
    end: new Date(2026, 3, 21, 14, 30),
  },
  {
    item: "Industry panel",
    start: new Date(2026, 3, 21, 14, 30),
    end: new Date(2026, 3, 21, 15, 15),
  },
  {
    item: "Closing remarks",
    start: new Date(2026, 3, 21, 15, 15),
    end: new Date(2026, 3, 21, 15, 30),
  },
  {
    item: "End",
    start: new Date(2026, 3, 21, 15, 30),
    end: new Date(2026, 3, 21, 15, 30),
  }
];
