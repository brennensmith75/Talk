'use client'

import { removeChat, shareChat } from '@/app/actions'
import { SidebarActions } from '@/components/sidebar-actions'
import { SidebarItem } from '@/components/sidebar-item'
import { Chat } from '@/lib/types'
import { useEffect, useState } from 'react'

export interface SidebarListProps {
  userId?: string
  serverChats: Chat[]
}

export function SidebarList({ userId, serverChats }: SidebarListProps) {
  const [chats, setChats] = useState<Chat[]>(serverChats)

  useEffect(() => {
    // const channel = supabaseClient
    //   .channel('realtime-posts')
    //   .on(
    //     'postgres_changes',
    //     {
    //       event: '*',
    //       schema: 'public',
    //       table: 'chats'
    //     },
    //     payload => console.log(payload)
    //   )
    //   .subscribe()
    // console.log('hitttt')
    // return () => {
    //   supabaseClient.removeChannel(channel)
    // }
  }, [])

  return (
    <div className="flex-1 overflow-auto">
      {chats?.length ? (
        <div className="space-y-2 px-2">
          {chats.map(
            (chat, i) =>
              chat && (
                // https://github.com/vercel/next.js/issues/52415 Error: Cannot access .prototype on the server. You cannot dot into a client module from a server component. You can only pass the imported name through.
                <SidebarItem key={i} chat={chat}>
                  <SidebarActions
                    chat={chat}
                    removeChat={removeChat}
                    shareChat={shareChat}
                  />
                </SidebarItem>
              )
          )}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No chat history</p>
        </div>
      )}
    </div>
  )
}
