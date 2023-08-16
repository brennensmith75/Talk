import { z } from 'zod'

export const envsSchema = z.object({
  OPENAI_API_KEY: z.string(),
  METAPHOR_API_KEY: z.string(),
  AUTH_GITHUB_ID: z.string(),
  AUTH_GITHUB_SECRET: z.string(),
  // KV_URL: z.string(),
  // KV_REST_API_URL: z.string(),
  // KV_REST_API_TOKEN: z.string(),
  // KV_REST_API_READ_ONLY_TOKEN: z.string()
})

const _env = envsSchema.safeParse(process.env)

if (!_env.success) {
  console.error('Zod validation failed:', _env.error)
  console.log('process.env', process.env)
  throw new Error('Invalid environment variables')
}

export const envs = {
  OPENAI_API_KEY: _env.data.OPENAI_API_KEY,
  METAPHOR_API_KEY: _env.data.METAPHOR_API_KEY,
  AUTH_GITHUB_ID: _env.data.AUTH_GITHUB_ID,
  AUTH_GITHUB_SECRET: _env.data.AUTH_GITHUB_SECRET,
  // KV_URL: _env.data.KV_URL,
  // KV_REST_API_URL: _env.data.KV_REST_API_URL,
  // KV_REST_API_TOKEN: _env.data.KV_REST_API_TOKEN,
  // KV_REST_API_READ_ONLY_TOKEN: _env.data.KV_REST_API_READ_ONLY_TOKEN
}
