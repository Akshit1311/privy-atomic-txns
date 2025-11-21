import { z } from "zod";

const convexEnvSchema = z.object({
  NEXT_PUBLIC_PRIVY_APP_ID: z.string().min(1),
  NEXT_PUBLIC_PRIVY_CLIENT_ID: z.string().min(1),
  NEXT_PUBLIC_PRIVY_APP_SECRET: z.string().min(1),
});

function getEnv(): z.infer<typeof convexEnvSchema> {
  const parsed = convexEnvSchema.safeParse({
    NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
    NEXT_PUBLIC_PRIVY_CLIENT_ID: process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID,
    NEXT_PUBLIC_PRIVY_APP_SECRET: process.env.NEXT_PUBLIC_PRIVY_APP_SECRET,
  });

  if (!parsed.success) {
    console.error(
      "❌ Invalid Convex environment variables:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error(
      `Invalid environment variables: ${JSON.stringify(
        parsed.error.flatten().fieldErrors,
        null,
        2
      )}`
    );
  }

  return parsed.data;
}

export const env = getEnv();
