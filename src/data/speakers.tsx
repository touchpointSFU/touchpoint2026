import mischa from "@/assets/speakers/mischa.jpg";
import dave from "@/assets/speakers/dave.jpg";
import marina from "@/assets/speakers/marina.jpg";
import breanne from "@/assets/speakers/breanne.jpg";
import ryan from "@/assets/speakers/ryan.jpg";
import danny from "@/assets/speakers/danny.jpg";
import steven from "@/assets/speakers/steven.jpg";
import amanda from "@/assets/speakers/amanda.jpg";
import { StaticImageData } from "next/image";

export type Speaker = {
  names: string | string[];
  company: string;
  alum: boolean | boolean[];
  bio?: React.ReactNode | string;
  img?: StaticImageData;
};

export const speakers: Speaker[] = [
  {
    names: "Mischa Price",
    company: "London Borough of Hounslow",
    alum: true,
    bio: (
      <>
        Mischa Price is a service designer with experience in social services
        and the public sector in B.C. and the U.K., currently working for the
        London Borough of Hounslow. They approach design as a tool for building
        understanding and pursuing more equitable outcomes, with a focus on
        accessibility and community. Mischa holds a BA in Interactive Arts and
        Technology with a minor in Dialogue from SFU, as well as an MA in Smart
        Urban Futures from the University of Plymouth.
      </>
    ),
    img: mischa,
  },
  {
    names: ["Dave Swanson", "Marina Martin", "Breanne Lewis"],
    company: "EA",
    alum: [false, false, true],
  },
  {
    names: "Ryan Romero",
    company: "Monday Creative",
    alum: false,
    bio: (
      <>
        Ryan Romero steer brands toward deeper, more resonant connections with
        their audiences. His role as Creative Director at Monday Creative, have
        been about aligning creativity with purpose—not just directing creative
        development, but crafting narratives that move people and build culture.
        With a background shaped by partnerships with brands like Keen, Adidas,
        Arc’teryx, and Lululemon, he’s learned that true performance is about
        weaving together story, strategy, and impact, making the work he does
        not just about moving the needle but about creating loyalty that goes
        both ways between brands and their fans.
      </>
    ),
    img: ryan,
  },
  {
    names: "Danny Farra",
    company: "Google",
    alum: false,
    bio: (
      <>
        Danny Farra (he/him) is a Syrian-American artist and designer based in
        Seattle. He works as a product designer specializing in accessibility
        and assistive technology.
      </>
    ),
    img: danny,
  },
  {
    names: "Steven Cox",
    company: "Cause+Affect",
    alum: false,
    bio: (
      <>
        Steven Cox is Co-Founder and Executive Creative Director of
        Cause+Affect, a brand consultancy focused on mission-driven
        organizations. Over two decades, Cause+Affect have developed "The
        Company We Keep" methodology - an approach that treats brand strategy as
        relationship design, based on the belief that the strength of an
        organization’s identity isn't measured only by what you say about
        yourself, but by who says it with you.
      </>
    ),
    img: steven,
  },
  {
    names: "Amanda Poh",
    company: "Microsoft",
    alum: true,
    bio: (
      <>
        Amanda Poh is a product designer at Microsoft, where she focuses on
        building agentic experiences across Windows and shaping accessibility
        and inclusive design practices. She is a co‑author of Microsoft’s
        Inclusive Design for Mental Health & Cognition Toolkit, which has since
        been adopted by global organizations including IKEA and the United
        Nations. Her work is rooted in building more equitable futures through
        gender and racial equity, disability justice, and trauma‑informed
        practices.
      </>
    ),
    img: amanda,
  },
];
