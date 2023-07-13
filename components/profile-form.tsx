'use client'

// Supabase Auth
import { type Session } from '@supabase/auth-helpers-nextjs'


// Zod
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodTypeAny, z } from 'zod'

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
import { Textarea } from './ui/textarea'

/**
 * Create form schema with a dynamic number of system profile prompts based on user's number of profiles.

* @param numProfiles Number of profiles the user has. Initialized to 1 inside ProfileForm component.
 * @returns Zod object schema
 */
const createFormSchema = (numProfiles: number) => {
  let dynamicSchema: Record<string, ZodTypeAny> = {
    username: z
      .string()
      .min(2, {
        message: 'Username must be at least 2 characters long'
      })
      .max(50),
    email: z.string().email({
      message: 'Please enter a valid email address'
    })
  }

  for (let i = 0; i < numProfiles; i++) {
    dynamicSchema[`systemPrompt-profile${i.toString()}`] = z
      .string()
      .max(1000, {
        message: 'System prompt must be less than 1000 characters long'
      })
  }

  return z.object(dynamicSchema)
}

interface ProfileFormProps {
  user: Session['user'] | undefined
}

/**
 * Create a form for the user to edit their profile and system prompts.
 * @param user User object from Supabase
 * @returns Form component
 */
export function ProfileForm({ user }: ProfileFormProps) {
  // Default to 1 profile if user has no profiles
  const profileCount = user?.user_metadata.num_profiles ?? 1
  const formSchema = createFormSchema(profileCount)

  // Populate form with user's existing data from Supabase
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.user_metadata.user_name,
      email: user?.user_metadata.email,
      systemPrompt: user?.user_metadata.system_prompt
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Update user metadata in Supabase
    console.log(values)
  }
  console.log('user', user);

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

        <FormField
          key={`systemPrompt-profile${profileCount.toString()}`}
          control={form.control}
          name={`systemPrompt-profile${profileCount.toString()}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>System Prompt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="I love to learn about technology trends and enjoy humor in responses."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Tailor your AI experience here. Each time you interact with the
                AI, it refers to this text to personalize its responses. Please
                keep your description focused and direct. For instance: &quot;I
                have a deep interest in history and prefer analogies to explain
                complex concepts.&quot;
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="dark:bg-secondary dark:text-white">
          Submit
        </Button>
      </form>
    </Form>
  )
}
// {"iss":"https://api.github.com","sub":"882952","name":"Sean Oliver","email":"helloseanoliver@gmail.com","full_name":"Sean Oliver","user_name":"seanoliver","avatar_url":"https://avatars.githubusercontent.com/u/882952?v=4","provider_id":"882952","email_verified":true,"preferred_username":"seanoliver"}
