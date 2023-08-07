import { auth } from '@/auth'
import { LoginButton } from '@/components/login-button'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function SignInPage() {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })
  // redirect to home if user is already logged in
  if (session?.user) {
    redirect('/')
  }
  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center gap-5 py-10">
      Hi! Smol Talk currently requires signup/login for all chats, just to make
      sure you&apos;re a real person.
      <LoginButton />
    </div>
  )
}
