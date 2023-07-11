import { z } from 'zod'
import { auth } from '@/auth'
import { ProfileForm } from '@/components/profile-form'

const formSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email()
})

export default async function ProfilePage() {
  const session = await auth()
  const user = session?.user
  return (
    <div className="flex-1 space-y-6">
      <div className="px-4 py-6 border-b bg-background md:px-6 md:py-8">
        <div className="max-w-2xl mx-auto md:px-6">
          <div className="space-y-1 md:-mx-8">
            <h1 className="text-2xl font-bold">
              {user?.user_metadata.name}&apos;s Profile
            </h1>
            <div className="text-sm text-muted-foreground">
              {user?.user_metadata.email}
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-6 md:px-6">
        <div className="max-w-2xl mx-auto rounded-lg bg-white border p-6">
          <div className="space-y-6">
            <div className="space-y-6">
              <ProfileForm user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
