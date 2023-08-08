'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormItem } from '@/components/ui/form'
import React from 'react'
import { toast } from 'react-hot-toast'
import {
  PromptBodyField,
  PromptEmojiField,
  PromptNameField
} from '../../../components/profile-form-fields'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../../components/ui/card'
import { createOrUpdatePersona, removePersona } from '../../actions'

export function PersonaForm({
  user,
  prompt,
  onUpdate,
  onRemove
}: {
  user: any
  prompt: any
  onUpdate: Function
  onRemove: Function
}) {
  const [isEditing, setEditing] = React.useState(!prompt.prompt_name || false)
  const [isRemoving, setRemoving] = React.useState(false)

  let formSchema: z.ZodRawShape = {
    prompt_id: z.coerce.number().optional(),
    prompt_name: z.string(),
    prompt_body: z.string(),
    prompt_emoji: z.string().optional()
  }

  const defaultValues: any = {
    prompt_id: prompt.id || null,
    prompt_name: prompt.prompt_name || '',
    prompt_body: prompt.prompt_body || '',
    prompt_emoji: prompt.emoji || '🤖'
  }

  const finalFormSchema = z.object(formSchema)

  const form = useForm<z.infer<typeof finalFormSchema>>({
    resolver: zodResolver(finalFormSchema),
    mode: 'onChange',
    defaultValues
  })

  const { reset } = form
  const { isDirty, isValid, isSubmitting } = form.formState

  async function onSubmit(values: z.infer<typeof finalFormSchema>) {
    try {
      console.log('🔴 Submitting Form Values:', values)
      const result = await createOrUpdatePersona({
        values,
        user
      })
      console.log('Update Personas Result:', result)
      toast.success('Persona saved', {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
          fontSize: '14px'
        },
        iconTheme: {
          primary: 'white',
          secondary: 'black'
        }
      })
      reset({ ...values, ...result })
      await onUpdate(prompt)
      setEditing(false)
    } catch (error) {
      console.error('Error Updating User:', error)
    }
  }

  async function onRemovePersona() {
    try {
      setRemoving(true)
      await removePersona({ id: prompt.id, user })
      toast.success('Persona removed successfully', {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
          fontSize: '14px'
        },
        iconTheme: {
          primary: 'white',
          secondary: 'black'
        }
      })
      onRemove(prompt.id)
      setRemoving(false)
    } catch (error) {
      console.error('Error Deleting Persona:', error)
    }
  }

  const onEdit = () => {
    setEditing(true)
  }

  const onCancel = async () => {
    reset()
    if (!prompt.id) {
      onRemove(prompt.id)
    }
    setEditing(false)
  }

  if (!isEditing) {
    return (
      <Card>
        <CardHeader className="flex flex-row justify-between space-y-0">
          <div className="space-y-2.5">
            <CardTitle>
              {prompt.emoji} {prompt.prompt_name}
            </CardTitle>
            <CardDescription>{prompt.prompt_body}</CardDescription>
          </div>
          <Button variant={'outline'} type="button" onClick={onEdit}>
            Edit
          </Button>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <FormItem className="flex flex-col justify-between p-6">
              <React.Fragment>
                <div className="flex flex-row space-x-2">
                  <PromptNameField form={form} />
                  <PromptEmojiField form={form} />
                </div>
                <PromptBodyField form={form} />

                <div className="flex justify-between space-x-2">
                  <div>
                    {!!prompt.id && (
                      <Button
                        type="button"
                        onClick={onRemovePersona}
                        variant="destructive"
                        loading={isRemoving}
                        disabled={isSubmitting || isRemoving}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant={'outline'}
                      type="button"
                      onClick={onCancel}
                      disabled={isSubmitting || isRemoving}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        !isDirty || !isValid || isRemoving || isSubmitting
                      }
                      loading={isSubmitting}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </React.Fragment>
            </FormItem>
          </div>
        </form>
      </Form>
    </Card>
  )
}
