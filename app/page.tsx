import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { auth } from '@/auth'

export const runtime = 'edge'

export default async function IndexPage() {

  const session = await auth()
  const userId = session?.user?.id
  const id = nanoid()

  return <Chat userId={userId} id={id} />
}
