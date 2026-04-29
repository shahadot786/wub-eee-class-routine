import { z } from "zod";

// ─── Semester Schema ──────────────────────────────────────────────

export const SemesterSchema = z.object({
  Semester: z.string().min(1),
  Start: z.string().min(1),
  End: z.string().min(1),
  Active: z.string(),
});

export type ValidSemester = z.infer<typeof SemesterSchema>;

// ─── Schedule Item Schema ─────────────────────────────────────────

export const ScheduleItemSchema = z.object({
  Semester: z.string().min(1),
  Day: z.enum(["MON", "TUE", "WED", "THU", "FRI", "SUN"]),
  Start: z.string().regex(/^\d{1,2}:\d{2}$/),
  End: z.string().regex(/^\d{1,2}:\d{2}$/),
  Code: z.string().min(1),
  Title: z.string().min(1),
  Teacher: z.string().min(1),
  Room: z.string().min(1),
  Batches: z.string().min(1),
  Type: z.enum(["Class", "Lab"]),
  Credit: z.string().optional(),
});

export type ValidScheduleItem = z.infer<typeof ScheduleItemSchema>;

// ─── Validation Utilities ────────────────────────────────────────

/**
 * Validate an array of semester rows. Returns only valid rows and logs errors.
 */
export function validateSemesters(data: any[]): ValidSemester[] {
  return data.filter((item) => {
    const result = SemesterSchema.safeParse(item);
    if (!result.success) {
      console.warn("Invalid semester data ignored:", result.error.format());
      return false;
    }
    return true;
  }) as ValidSemester[];
}

/**
 * Validate an array of schedule rows. Returns only valid rows and logs errors.
 */
export function validateSchedule(data: any[]): ValidScheduleItem[] {
  return data.filter((item) => {
    const result = ScheduleItemSchema.safeParse(item);
    if (!result.success) {
      console.warn(
        `Invalid schedule data ignored (${item.Title || "Unknown"}):`,
        result.error.format(),
      );
      return false;
    }
    return true;
  }) as ValidScheduleItem[];
}
