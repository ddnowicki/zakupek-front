import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});

export const registerSchema = z
  .object({
    email: z.string().min(1, "Adres e-mail jest wymagany.").email("Nieprawidłowy format adresu e-mail."),
    password: z
      .string()
      .min(1, "Hasło jest wymagane.")
      .min(6, "Hasło musi mieć co najmniej 6 znaków.")
      .regex(/[A-Z]/, "Hasło musi zawierać co najmniej jedną wielką literę.")
      .regex(/[0-9]/, "Hasło musi zawierać co najmniej jedną cyfrę.")
      .regex(/[^A-Za-z0-9]/, "Hasło musi zawierać co najmniej jeden znak specjalny."),
    confirmPassword: z.string().min(1, "Potwierdzenie hasła jest wymagane."),
    userName: z.string().min(1, "Nazwa użytkownika jest wymagana."),
    householdSize: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val >= 1, "Liczba domowników musi być większa lub równa 1."),
    ages: z.array(z.union([z.string(), z.number()])).optional(),
    dietaryPreferences: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Hasła nie są zgodne.",
        path: ["confirmPassword"],
      });
    }

    if (data.ages) {
      const householdSize = data.householdSize;
      if (data.ages.length !== householdSize) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Liczba wprowadzonych wieku musi odpowiadać liczbie domowników.",
          path: ["ages"],
        });
      }

      data.ages.forEach((age, idx) => {
        const parsedAge = typeof age === "string" ? parseInt(age, 10) : age;
        if (isNaN(parsedAge) || parsedAge <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Wiek musi być liczbą większą od 0.",
            path: ["ages", idx],
          });
        }
      });
    }
  });

export const profileSchema = z.object({
  userName: z.string().min(1, "Nazwa użytkownika jest wymagana."),
  householdSize: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val >= 1, "Liczba domowników musi być większa lub równa 1."),
  ages: z.array(z.union([z.string(), z.number()])).optional(),
  dietaryPreferences: z.array(z.string()).optional(),
}).superRefine((data, ctx) => {
  if (data.ages && data.householdSize) {
    const householdSize = typeof data.householdSize === 'string' ? parseInt(data.householdSize, 10) : data.householdSize;
    if (data.ages.length !== householdSize) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Liczba wprowadzonych wieku musi odpowiadać liczbie domowników.",
        path: ["ages"],
      });
    }

    data.ages.forEach((age, idx) => {
      const parsedAge = typeof age === "string" ? parseInt(age, 10) : age;
      if (isNaN(parsedAge) || parsedAge <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Wiek musi być liczbą większą od 0.",
          path: ["ages", idx],
        });
      }
    });
  }
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type ProfileSchemaType = z.infer<typeof profileSchema>;
