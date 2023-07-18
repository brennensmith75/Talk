'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { type User } from '@supabase/auth-helpers-nextjs';


import { type Chat } from '@/lib/types'
import { auth } from '@/auth'

// // Create core Supabase client
// const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
// const supabase_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
// const supabase = createClient<Database>(supabase_url, supabase_key)

// Create Auth helper client
const supabase = createServerActionClient({ cookies })

function nanoid() {
  return Math.random().toString(36).slice(2) // random id up to 11 chars
}

export async function upsertChat(chat: Chat) {
  const { error } = await supabase.from('chats').upsert(
    {
      id: chat.chat_id || nanoid(),
      user_id: chat.userId,
      payload: chat
    }
  )
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

export async function getPrompts( user : User) {
  try {
    const { data } = await supabase
      .from('profiles')
      .select()
      .eq('id', user.id)
      .maybeSingle()

    const prompts = data ? data.prompts : upsertPrompts(user)
    return prompts
  } catch (error) {
    console.log('get prompts error', error)
    return {
      error: 'Unauthorized'
    }
  }
}

export async function upsertPrompts(
  user: User,
  prompts: { [key: string]: string } = { Default: '' }
) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: user.id as string, prompts: prompts })
      .eq('id', user.id)
      .select('prompts')

    console.log('upsert prompts data', data)
    if (data) return data[0].prompts
    return { error: 'Unauthorized' }

  } catch (error) {
    console.log('upsert prompts error', error)
    return {
      error: 'Unauthorized'
    }
  }
}

export async function updateUser({
  updatedProfileData,
  user
}: {
  updatedProfileData: { [key: string]: string },
  user: User
}) {
  try {


    const { data, error } = await supabase
      .from('profiles')
      .update({ prompts: updatedProfileData.prompts })
      .eq('id', user.id)

    if (updatedProfileData.email) {
      await supabase
        .from('auth.users')
        .update({ email: updatedProfileData.email })
        .eq('id', user.id)
    }

    if (updatedProfileData.username) {
      await supabase
        .from('auth.users')
        .update({ user_name: updatedProfileData.username })
        .eq('id', user.id)
    }

    return data

  } catch (error) {
    console.log('update user error', error)
    return {
      error: 'Unauthorized'
    }
  }
}
