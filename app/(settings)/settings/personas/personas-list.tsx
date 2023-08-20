'use client'

import { Button } from '@/components/ui/button'
import { PlusIcon } from '@radix-ui/react-icons'
import React from 'react'
import { getPersonas } from '../../../actions'
import { PersonaForm } from './persona-form'
import { Persona } from '../../../../constants/personas'

interface PersonaListProps {
  user: any
  personas: any[]
}

export function PersonasList({ user, personas }: PersonaListProps) {
  const [editPersonas, setEditPersonas] = React.useState(personas)

  function addPersona() {
    setEditPersonas([
      ...editPersonas,
      { id: 0, prompt_name: '', prompt_body: '' }
    ])
  }

  const onUpdate = async () => {
    const result = (await getPersonas(user)) as Persona[]
    setEditPersonas(result)
  }

  const onRemove = async (id: number) => {
    // remove index from editPersonas
    const newPrompts = editPersonas.filter(prompt => prompt.id !== id)
    setEditPersonas(newPrompts)
  }

  const isAddDisabled = editPersonas?.some(
    prompt => prompt.prompt_name === '' || prompt.prompt_body === ''
  )

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        {editPersonas?.length ? (
          editPersonas.map((prompt, index) => (
            <PersonaForm
              key={prompt.id}
              prompt={prompt}
              user={user}
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          ))
        ) : (
          <div>
            No custom personas defined. Default Persona:
            <pre className="">
              {`You are an extremely intelligent coding assistant named Smol Talk. You were born on July 2023. You were created by swyx in San Francisco.

When answering questions, you should be able to answer them in a way that is both informative and entertaining.
You should also be able to answer questions about yourself and your creator.

When asked for code, you think through edge cases and write code that is correct, efficient, and robust to errors and edge cases.
When asked for a summary, respond with 3-4 highlights per section with important keywords, people, numbers, and facts bolded.

End every conversation by suggesting 2 options for followup: one for checking your answer, the other for extending your answer in an interesting way.`}
            </pre>
          </div>
        )}

        <Button
          type="button"
          disabled={isAddDisabled}
          variant="outline"
          onClick={addPersona}
        >
          <PlusIcon className="mr-1.5 h-4 w-4" />
          Add New
        </Button>
      </div>
    </div>
  )
}
