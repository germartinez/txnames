import { z } from 'zod'

const envSchema = z.object({
  VITE_ETHERSCAN_API_KEY: z.string().min(1, 'Etherscan API key is required'),
  VITE_APPKIT_PROJECT_ID: z.string().min(1, 'AppKit Project ID is required'),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  throw new Error('Invalid environment variables')
}

export const env = {
  etherscanApiKey: parsed.data.VITE_ETHERSCAN_API_KEY,
  appkitProjectId: parsed.data.VITE_APPKIT_PROJECT_ID,
} as const
