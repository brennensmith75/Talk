'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { type Chat } from '@/lib/types'
import { auth } from '@/auth'

const supabase = createServerActionClient<Database>({ cookies })

function nanoid() {
  return Math.random().toString(36).slice(2) // random id up to 11 chars
}

export async function upsertChat(chat: Chat) {
  const { error } = await supabase
    .from('chats')
    .upsert(
      {
        id: chat.chat_id || nanoid(),
        userId: chat.userId,
        payload: chat
      },
      {
        onConflict: 'handle',
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
    console.log('clearChats')
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
