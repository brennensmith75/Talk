import ProfileForm from '@/components/profile-form'
import { Separator } from '@/components/ui/separator'
import { redirect } from 'next/navigation'
import { auth } from '../../auth'
import { cookies } from 'next/headers'

export default async function SettingsProfilePage() {
  const readOnlyRequestCookies = cookies()
  const session = await auth({ readOnlyRequestCookies })

  const user = session?.user
  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings.
        </p>
      </div>
      <Separator />
      <ProfileForm user={user} />
    </div>
  )
}
