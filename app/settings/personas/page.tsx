import { Personas } from '@/app/settings/personas/personas'
import { Separator } from '@/components/ui/separator'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '../../../auth'
import { getPrompts } from '../../actions'

type Prompts = {
  prompt_name: string
  prompt_body: string
}[]

export default async function SettingsPersonasPage() {
  const readOnlyRequestCookies = cookies()
  const session = await auth({ readOnlyRequestCookies })

  const user = session?.user
  if (!user) {
    redirect('/sign-in')
  }

  const prompts = (await getPrompts(user)) as Prompts

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Personas</h3>
        <p className="text-sm text-muted-foreground">
          Configure multiple personas to receive different responses from the
          AI.
        </p>
      </div>
      <Separator />
      <Personas prompts={prompts} user={user} />
    </div>
  )
}
