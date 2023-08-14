export type Persona = {
  id: number | null
  user_id?: string
  prompt_name: string
  prompt_body: string
  emoji: string | null
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | null
}
