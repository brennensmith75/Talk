'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'

import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types';
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { type User } from '@supabase/auth-helpers-nextjs'

import { type Chat } from '@/lib/types'
import { auth } from '@/auth'

// Create Auth helper client
const supabase = createServerActionClient<Database>({ cookies })

function nanoid() {
  return Math.random().toString(36).slice(2) // random id up to 11 chars
}

export async function upsertChat(chat: Chat) {
  const { error } = await supabase.from('chats').upsert({
    id: chat.chat_id || nanoid(),
    user_id: chat.userId,
    payload: chat
  })
  if (error) {
    console.log('upsertChat error', error)
    return {
      error: 'Unauthorized'
    }
  } else {
    return null
  }
}

export async function getChats(userId?: string | null) {
  if (!userId) {
    return []
  }

  try {
    const { data } = await supabase
      .from('chats')
      .select('payload')
      .order('payload->createdAt', { ascending: false })
      .throwOnError()

    return (data?.map(entry => entry.payload) as Chat[]) ?? []
  } catch (error) {
    return []
  }
}

export async function getChat(id: string) {
  const { data } = await supabase
    .from('chats')
    .select('payload')
    .eq('id', id)
    .maybeSingle()

  return (data?.payload as Chat) ?? null
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  try {
    await supabase.from('chats').delete().eq('id', id).throwOnError()

    revalidatePath('/')
    return revalidatePath(path)
  } catch (error) {
    return {
      error: 'Unauthorized'
    }
  }
}

export async function clearChats() {
  try {
    const session = await auth()
    await supabase
      .from('chats')
      .delete()
      .eq('user_id', session?.user.id)
      .throwOnError()
    revalidatePath('/')
    return redirect('/')
  } catch (error) {
    console.log('clear chats error', error)
    return {
      error: 'Unauthorized'
    }
  }
}

export async function getSharedChat(id: string) {
  const { data } = await supabase
    .from('chats')
    .select('payload')
    .eq('id', id)
    .not('payload->sharePath', 'is', null)
    .maybeSingle()

  return (data?.payload as Chat) ?? null
}

export async function shareChat(chat: Chat) {
  const payload = {
    ...chat,
    sharePath: `/share/${chat.id}`
  }

  await supabase
    .from('chats')
    .update({ payload: payload as any })
    .eq('id', chat.id)
    .throwOnError()

  return payload
}

export async function getPrompts(user: User) {
  try {
    const { data, error } = await supabase
      .from('prompts')
      .select('id, prompt_name, prompt_body')
      .eq('user_id', user.id)

    const prompts =
      data && data.length > 0
        ? data
        : [{ id: null, prompt_name: '', prompt_body: '' }]

    return prompts
  } catch (error) {
    console.log('get prompts error', error)
    return {
      error: 'Unauthorized'
    }
  }
}

type PromptGroups = {
  [index: string]: {
    id?: string
    name?: string
    body?: string
  }
}

export async function updateUser({
  values,
  user
}: {
  values: { [x: string]: any }
  user: User
}) {
  try {
    // userData will update auth.users table
    const userData = {
      username: values.username,
      email: values.email
    }

    // promptData will update public.prompts table
    const promptData = Object.keys(values).reduce((result, key) => {
      if (key.startsWith('prompt_')) {
        result[key] = values[key]
      }
      return result
    }, {} as { [key: string]: string })


    // Un-flatten the prompt data
    let promptGroups: PromptGroups = {}

    for (let key in promptData) {
      const [tempField, index] = key.split('_').slice(1)
      const field: 'id' | 'name' | 'body' = tempField as 'id' | 'name' | 'body'

      if (!promptGroups[index]) {
        promptGroups[index] = {}
      }

      promptGroups[index][field] = promptData[key]
    }
    console.log('promptGroups', promptGroups)
    for (let index in promptGroups) {
      let prompt = promptGroups[index]
      if (prompt.id) {
        const { data, error } = await supabase
          .from('prompts')
          .update({
            prompt_name: prompt.name,
            prompt_body: prompt.body
          })
          .eq('id', prompt.id)

        if (error) {
          console.log('Error updating prompt:', error)
        } else {
          console.log('Updated prompt:', data)
        }
      } else {
        const { data, error } = await supabase.from('prompts').insert({
          user_id: user.id,
          prompt_name: prompt.name,
          prompt_body: prompt.body
        })

        if (error) {
          console.log('Error inserting prompt:', error)
        } else {
          console.log('Inserted prompt:', data)
        }
      }
    }

    if (userData.email) {
      await supabase
        .from('auth.users')
        .update({ email: userData.email })
        .eq('id', user.id)
    }

    if (userData.username) {
      await supabase
        .from('auth.users')
        .update({ user_name: userData.username })
        .eq('id', user.id)
    }

    return {
      data: {
        user: {
          ...user,
          ...userData
        },
        prompts: promptData
      }
    }
  } catch (error) {
    console.log('update user error', error)
    return {
      error: 'Unauthorized'
    }
  }
}
