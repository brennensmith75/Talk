import { Database } from '@/lib/db_types'
import { type Message } from 'ai'

export type Product = Database['public']['Tables']['products']['Row']
export type Price = Database['public']['Tables']['prices']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type Customer = Database['public']['Tables']['customers']['Row']
export type Prompt = Database['public']['Tables']['prompts']['Row']
// export type Chat = Database['public']['Tables']['chats']['Row']
export type Submission = Database['public']['Tables']['submissions']['Row']
export type Artifact = Database['public']['Tables']['artifacts']['Row']

export type SmolTalkMessage = Message & {
  messageAuthor_id?: string
}

// TODO refactor and remove unneccessary duplicate data.
export interface Chat extends Record<string, any> {
  chat_id: string
  title: string
  createdAt: number
  userId: string
  path: string
  messages: SmolTalkMessage[]
  sharePath?: string // Refactor to use RLS
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

export type PromptTemplateValues = {
  date?: Date
  personaName?: string
  personaBody?: string
}

export type TemplateFunction = (values?: PromptTemplateValues) => string
