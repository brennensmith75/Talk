import { auth } from '@/auth'
import { Separator } from '@/components/ui/separator'
import { Persona } from '@/constants/personas'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPersonas } from '../../../actions'
import { PersonasList } from './personas-list'

export default async function SettingsPersonasPage() {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })

  const user = session?.user
  if (!user) {
    redirect('/sign-in')
  }

  const personas = (await getPersonas(user)) as Persona[]

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
      <PersonasList personas={personas} user={user} />
    </div>
  )
}
