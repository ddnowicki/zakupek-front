import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});

export const registerSchema = z
  .object({
    email: z.string().email("Invalid email address").nonempty("Email is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    userName: z.string().nonempty("Username is required"),
    householdSize: z.number().int().min(1, "Household size must be at least 1").optional(),
    ages: z.array(z.number().int().positive("Age must be positive")).optional(),
    dietaryPreferences: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.householdSize && data.ages) {
        return data.ages.length === data.householdSize;
      }
      return true;
    },
    {
      message: "The number of ages must match the household size",
      path: ["ages"],
    }
  );

export const productRequestSchema = z.object({
  name: z.string().nonempty("Product name is required").max(100, "Product name must be 100 characters or less"),
  quantity: z.number().int().positive("Quantity must be greater than 0"),
});

export const updateProductRequestSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().nonempty("Product name is required").max(100, "Product name must be 100 characters or less"),
  quantity: z.number().int().positive("Quantity must be greater than 0"),
});

export const createShoppingListSchema = z.object({
  title: z.string().max(100, "Title must be 100 characters or less").optional().nullable(),
  products: z.array(productRequestSchema).optional().nullable(),
  plannedShoppingDate: z.string().optional().nullable(),
  storeName: z.string().optional().nullable(),
});

export const updateShoppingListSchema = z.object({
  title: z.string().max(100, "Title must be 100 characters or less").optional().nullable(),
  products: z.array(updateProductRequestSchema).optional().nullable(),
  plannedShoppingDate: z.string().optional().nullable(),
  storeName: z.string().optional().nullable(),
});

export const generateShoppingListSchema = z.object({
  title: z.string().max(100, "Title must be 100 characters or less").optional().nullable(),
  plannedShoppingDate: z.string().optional().nullable(),
  storeName: z.string().optional().nullable(),
});

export const getShoppingListsSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).default(10),
  sort: z.string().default("newest"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type ProductRequestSchemaType = z.infer<typeof productRequestSchema>;
export type UpdateProductRequestSchemaType = z.infer<typeof updateProductRequestSchema>;
export type CreateShoppingListSchemaType = z.infer<typeof createShoppingListSchema>;
export type UpdateShoppingListSchemaType = z.infer<typeof updateShoppingListSchema>;
export type GenerateShoppingListSchemaType = z.infer<typeof generateShoppingListSchema>;
export type GetShoppingListsSchemaType = z.infer<typeof getShoppingListsSchema>;
