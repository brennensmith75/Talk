import { getChats } from '@/app/actions'
import MainLayout from '@/app/(main)/chat-layout'
import { auth } from '@/auth'
import { Header } from '@/components/header'
import { cookies } from 'next/headers'

export default async function Layout({
  children
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })
  const user = session?.user
  const chats = await getChats(user?.id)

  return (
    <div className="flex min-h-screen flex-col">
      <Header chats={chats} user={user} />
      <main className="flex flex-1 flex-col bg-muted/50">{children}</main>
    </div>
  )
}
