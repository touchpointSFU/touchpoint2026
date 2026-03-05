import mischa from "@/assets/speakers/mischa.jpg";
import dave from "@/assets/speakers/dave.jpg";
import marina from "@/assets/speakers/marina.jpg";
import breanne from "@/assets/speakers/breanne.jpg";
import ryan from "@/assets/speakers/ryan.jpg";
import danny from "@/assets/speakers/danny.jpg";
import steven from "@/assets/speakers/steven.jpg";
import amanda from "@/assets/speakers/amanda.jpg";
import { StaticImageData } from "next/image";

export type TeamMember = {
  name: string;
  role: string;
};

export const team: TeamMember[] = [
  {
    name: "William Odom",
    role: "Conference Director",
  },
  {
    name: "Michael Dresler",
    role: "Conference Manager",
  },
  {
    name: "Michelle Lee",
    role: "Designer + Marketing",
  },
  {
    name: "Kaia Crozier",
    role: "Designer + Marketing",
  },
  {
    name: "Caleb Tsui",
    role: "Designer + Marketing",
  },
  {
    name: "Nathan Lew",
    role: "Web Developer",
  },
  {
    name: "Joseph Lee",
    role: "Event Coordinator",
  },
  {
    name: "Jenny Nguyen",
    role: "Mentor",
  },
  {
    name: "Breanne Lewis",
    role: "Mentor",
  },
  {
    name: "Claret Egwim",
    role: "Mentor",
  },
  {
    name: "Jeffrey Su",
    role: "IT Director",
  },
  {
    name: "Karishma Sen",
    role: "Volunteer Lead",
  },
];
