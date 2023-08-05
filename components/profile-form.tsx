'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { updateUser } from '@/app/actions'
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
import { toast } from 'react-hot-toast'

export default function ProfileForm({ user }: { user: any }) {
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

  const finalFormSchema = z.object(formSchema)

  const form = useForm<z.infer<typeof finalFormSchema>>({
    resolver: zodResolver(finalFormSchema),
    mode: 'onChange',
    defaultValues
  })

  const { isDirty, isValid } = form.formState

  async function onSubmit(values: z.infer<typeof finalFormSchema>) {
    toast
      .promise(
        updateUser({ values, user }),
        {
          loading: 'Saving...',
          success: 'Profile Saved!',
          error: 'Error Updating User.'
        },
        {
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
        }
      )
      .then(result => {
        console.log('Update User Result:', result)
      })
      .catch(error => {
        console.error(error)
      })
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
                <Input
                  className="select-none bg-gray-100 dark:bg-gray-800"
                  readOnly={true}
                  placeholder="smol-developer"
                  {...field}
                />
              </FormControl>
              <FormDescription>This is your account username.</FormDescription>
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
        <Button type="submit" disabled={!isDirty || !isValid}>
          Save
        </Button>
      </form>
    </Form>
  )
}
