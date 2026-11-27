import { z } from "zod";

/** What kind of work this project is — used as owner-side tags/types. */
export const ProjectType = {
  WEBSITE: "WEBSITE",
  CUSTOM_SOFTWARE: "CUSTOM_SOFTWARE",
  MOBILE_APP: "MOBILE_APP",
  DIGITAL_MARKETING: "DIGITAL_MARKETING",
  AI_AGENT: "AI_AGENT",
  COLLEGE: "COLLEGE",
  OTHER: "OTHER",
} as const;

export const projectTypeSchema = z.enum([
  ProjectType.WEBSITE,
  ProjectType.CUSTOM_SOFTWARE,
  ProjectType.MOBILE_APP,
  ProjectType.DIGITAL_MARKETING,
  ProjectType.AI_AGENT,
  ProjectType.COLLEGE,
  ProjectType.OTHER,
]);

export type ProjectType = z.infer<typeof projectTypeSchema>;
