import ChatLayout from '@/app/(main)/chat-layout'
import { getChats } from '@/app/actions'
import { auth } from '@/auth'
import { User } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export default async function Layout({
  children
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })
  const user: User | undefined = session?.user
  const chats = await getChats(user?.id)

  return (
    <div className="flex min-h-screen flex-col">
      <ChatLayout serverChats={chats} user={user}>
        {children}
      </ChatLayout>
    </div>
  )
}
