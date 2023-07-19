import { type Message } from 'ai'


export type SmolTalkMessage = Message & {
  messageAuthor_id?: string
}

// TODO refactor and remove unneccessary duplicate data.
export interface Chat extends Record<string, any> {
  chat_id: string
  title: string
  createdAt: Date
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

export type Prompts = {
  prompt_name: string
  prompt_body: string
}[]

