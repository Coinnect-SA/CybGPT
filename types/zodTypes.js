const { z } = require("zod");

export const EmailType = z.object({
    email: z.string().min(1, { message: "This field is required" }).email("Please enter a valid email")
})