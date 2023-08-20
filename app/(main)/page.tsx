import { auth } from '@/auth'
import { Chat } from '@/components/chat'
import { nanoid } from '@/lib/utils'
import { cookies } from 'next/headers'

export const runtime = 'edge'

export default async function IndexPage() {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })

  const user = session?.user
  const id = nanoid()

  return <Chat user={user} id={id} />
}
