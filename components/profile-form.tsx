'use client'

import { type Session } from '@supabase/auth-helpers-nextjs'

// Zod
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// UI
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

import { useForm } from 'react-hook-form'

const formSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters long'
    })
    .max(50),
  email: z.string().email()
})

interface ProfileFormProps {
  user: Session['user'] | undefined
}

export function ProfileForm({ user }: ProfileFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.user_metadata.user_name,
      email: user?.user_metadata.email
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                {/* Your public display name. */}
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
              <FormDescription>
                {/* Your public display name. */}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
// {"iss":"https://api.github.com","sub":"882952","name":"Sean Oliver","email":"helloseanoliver@gmail.com","full_name":"Sean Oliver","user_name":"seanoliver","avatar_url":"https://avatars.githubusercontent.com/u/882952?v=4","provider_id":"882952","email_verified":true,"preferred_username":"seanoliver"}