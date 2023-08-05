import { auth } from '@/auth'
import { LoginButton } from '@/components/login-button'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function SignInPage() {
  console.log('SignInPage')
  const readOnlyRequestCookies = cookies()
  const session = await auth({ readOnlyRequestCookies })

  // redirect to home if user is already logged in
  if (session?.user) {
    redirect('/')
  }
  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center gap-5 py-10">
      <LoginButton />
    </div>
  )
}
