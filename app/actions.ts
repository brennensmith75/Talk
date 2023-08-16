'use server'
import 'server-only'

import { Database } from '@/lib/db_types'
import {
  createServerActionClient,
  type User
} from '@supabase/auth-helpers-nextjs'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { Persona } from '@/constants/personas'
import { type Chat } from '@/lib/types'

function nanoid() {
  return Math.random().toString(36).slice(2) // random id up to 11 chars
}

export async function upsertChat(chat: Chat) {
  const cookieStore = cookies()
  const supabase = createServerActionClient<Database>({
    cookies: () => cookieStore
  })

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
    const cookieStore = cookies()
    const supabase = createServerActionClient<Database>({
      cookies: () => cookieStore
    })
    const { data } = await supabase
      .from('chats')
      .select('payload')
      .order('payload->createdAt', { ascending: false })
      .eq('user_id', userId)
      .throwOnError()

    return (data?.map(entry => entry.payload) as Chat[]) ?? []
  } catch (error) {
    return []
  }
}

export async function getChat(id: string) {
  const cookieStore = cookies()
  const supabase = createServerActionClient<Database>({
    cookies: () => cookieStore
  })
  const { data } = await supabase
    .from('chats')
    .select('payload')
    .eq('id', id)
    .maybeSingle()

  return (data?.payload as Chat) ?? null
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  try {
    const cookieStore = cookies()
    const supabase = createServerActionClient<Database>({
      cookies: () => cookieStore
    })
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
    const cookieStore = cookies()
    const supabase = createServerActionClient<Database>({
      cookies: () => cookieStore
    })

    await supabase.from('chats').delete().throwOnError()
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
  const cookieStore = cookies()
  const supabase = createServerActionClient<Database>({
    cookies: () => cookieStore
  })
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

  const cookieStore = cookies()
  const supabase = createServerActionClient<Database>({
    cookies: () => cookieStore
  })
  await supabase
    .from('chats')
    .update({ payload: payload as any })
    .eq('id', chat.id)
    .throwOnError()

  return payload
}

export async function getPersonas(user: User) {
  try {
    const cookieStore = cookies()
    const supabase = createServerActionClient<Database>({
      cookies: () => cookieStore
    })

    const { data, error } = await supabase
      .from('prompts')
      .select('id, prompt_name, prompt_body, emoji')
      .order('created_at', { ascending: true })
      .eq('user_id', user.id)
      .is('deleted_at', null)

    const personas: Persona[] = data || []

    return personas
  } catch (error) {
    console.log('get prompts error', error)
    return {
      error: 'Unauthorized'
    }
  }
}

export async function getPersonaById(user: User, persona: Persona) {
  try {
    const cookieStore = cookies()
    const supabase = createServerActionClient<Database>({
      cookies: () => cookieStore
    })

    const { data, error } = await supabase
      .from('prompts')
      .select('id, prompt_name, prompt_body, emoji')
      .eq('user_id', user.id)
      .eq('id', persona.id)
      .is('deleted_at', null)
      .maybeSingle()

    const storedPersona: Persona | null = data || null

    return storedPersona
  } catch (error) {
    console.log('get persona by ID error', error)
    return {
      error: 'Unauthorized'
    }
  }
}

export async function createOrUpdatePersona({
  values,
  user
}: {
  values: { [x: string]: any }
  user: User
}) {
  try {
    // userData will update auth.users table
    const personaData = {
      prompt_id: values.prompt_id,
      prompt_name: values.prompt_name,
      prompt_body: values.prompt_body,
      prompt_emoji: values.prompt_emoji
    }

    const cookieStore = cookies()
    const supabase = createServerActionClient<Database>({
      cookies: () => cookieStore
    })

    let result

    if (personaData.prompt_id) {
      console.log('update persona', personaData)
      result = await supabase
        .from('prompts')
        .update({
          user_id: user.id,
          prompt_name: personaData.prompt_name,
          prompt_body: personaData.prompt_body,
          emoji: personaData.prompt_emoji
        })
        .eq('id', personaData.prompt_id)
        .is('deleted_at', null)
        .select()
    } else {
      result = await supabase
        .from('prompts')
        .insert({
          user_id: user.id,
          prompt_name: personaData.prompt_name,
          prompt_body: personaData.prompt_body,
          emoji: personaData.prompt_emoji
        })
        .eq('user_id', user.id)
        .select()
    }
    const { data: personaResponse, error } = result

    if (error) {
      console.log('Error updating or adding persona:', error)
    }

    return {
      data: {
        prompts: personaResponse
      }
    }
  } catch (error) {
    console.log('update persona error', error)
    return {
      error: 'Unauthorized'
    }
  }
}

export async function removePersona({ id, user }: { id: string; user: User }) {
  try {
    const cookieStore = cookies()
    const supabase = createServerActionClient<Database>({
      cookies: () => cookieStore
    })

    const { data: personaResponse, error } = await supabase
      .from('prompts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.log('Error deleting persona:', error)
    }

    return {
      data: {
        prompts: personaResponse
      }
    }
  } catch (error) {
    console.log('remove persona error', error)
    return {
      error: 'Unauthorized'
    }
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

    if (userData.email) {
      const cookieStore = cookies()
      const supabase = createServerActionClient<Database>({
        cookies: () => cookieStore
      })

      await supabase.auth.updateUser({ email: userData.email })
    }

    // TODO: update username
    // if (userData.username) {
    //   const cookieStore = cookies()
    //   const supabase = createServerActionClient<Database>({
    //     cookies: () => cookieStore
    //   })

    //   await supabase.auth.updateUser({
    //     data: { user_name: userData.username }
    //   })
    // }

    return {
      data: {
        user: {
          ...user,
          ...userData
        }
      }
    }
  } catch (error) {
    console.log('update user error', error)
    return {
      error: 'Unauthorized'
    }
  }
}
