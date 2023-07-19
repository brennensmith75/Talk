'use client'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import React from 'react'
import { Textarea } from './ui/textarea'
import { updateUser } from '@/app/actions'

export default function ProfileForm({
  user,
  prompts
}: {
  user: any
  prompts: any[]
}) {

  let formSchema: z.ZodRawShape = {
    username: z
      .string()
      .min(2, { message: 'Username cannot have fewer than 2 characters' })
      .max(50, { message: 'Username cannot have more than 50 characters' }),
    email: z.string().email({ message: 'Please enter a valid email address' })
  }

  const defaultValues: any = {
    username: user.user_metadata.user_name,
    email: user.user_metadata.email
  }

  prompts.forEach((prompt, index) => {
    formSchema = {
      ...formSchema,
      [`prompt_id_${index}`]: z.string().nullable().optional(),
      [`prompt_name_${index}`]: z.string().optional(),
      [`prompt_body_${index}`]: z.string().optional()
    }
    defaultValues[`prompt_id_${index}`] = prompt.id
    defaultValues[`prompt_name_${index}`] = prompt.prompt_name
    defaultValues[`prompt_body_${index}`] = prompt.prompt_body
  })

  const finalFormSchema = z.object(formSchema)

  const form = useForm<z.infer<typeof finalFormSchema>>({
    resolver: zodResolver(finalFormSchema),
    mode: 'onChange',
    defaultValues
  })

  async function onSubmit(values: z.infer<typeof finalFormSchema>) {
    console.log('🔴🔴🔴 SUBMIT', values)
    try {
      const result = await updateUser({ values, user })
      console.log('Update User Result:', result)
    } catch (error) {
      console.error('Error Updating User:', error)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        method="post"
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="smol-developer" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="sama@openai.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {prompts.map((prompt, index) => (
          <React.Fragment key={index}>
            <FormField
              control={form.control}
              name={`prompt_name_${index}`}
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Prompt Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Tech Guru" {...field} />
                  </FormControl>
                  <FormDescription>
                    Create a brief, descriptive title for your profile.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`prompt_body_${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt Body</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="I'm a tech enthusiast who loves discussing the latest gadgets and AI trends."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Identify your unique perspective or a perspective you&apos;d
                    like the AI to adopt. This helps the AI to tailor its
                    responses to your interests.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </React.Fragment>
        ))}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
