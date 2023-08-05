import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { auth } from '@/auth'
import { cookies } from 'next/headers'

export const runtime = 'edge'

export default async function IndexPage() {
  console.log('IndexPage')
  const cookieStore = cookies()
  const session = await auth({ cookieStore })

  const userId = session?.user?.id
  const id = nanoid()

  return <Chat userId={userId} id={id} />
}
