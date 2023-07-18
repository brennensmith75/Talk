'use client'

// Supabase
// import { type Session } from '@supabase/auth-helpers-nextjs'

import { updateUser } from '@/app/actions'

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
 * Create form schema.
 */
const createFormSchema = (prompts: Record<string, string>) => {
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

  for (let prompt in prompts) {
    dynamicSchema[prompt] = z
      .string()
      .max(1000, {
        message: 'System prompt must be less than 1000 characters long'
      })
  }

  return z.object(dynamicSchema)
}

interface CreateDefaultFormValuesProps {
  user: Session['user']
  prompts: Record<string, string>
}

const createDefaultFormValues = ({
  user,
  prompts
}: CreateDefaultFormValuesProps) => {
  let defaultValues: Record<string, any> = {
    username: user.user_metadata.user_name,
    email: user.user_metadata.email
  }

  for (let prompt in prompts) defaultValues[prompt] = prompts[prompt]

  return defaultValues
}

/**
 * Create a form for the user to edit their profile and system prompts.
 */
export async function ProfileForm({
  user,
  prompts
}: {
  user: Session['user']
  prompts: Record<string, string>
}) {
  // Initialize supabase client

  const formSchema = createFormSchema(prompts)
  const defaultValues = createDefaultFormValues({ user, prompts })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let updatedProfileData = { ...values }
    await updateUser({ updatedProfileData, user })

  }

  return "hi"
  // return (
  //   <Form {...form}>
  //     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
  //       <FormField
  //         control={form.control}
  //         name="username"
  //         render={({ field }) => (
  //           <FormItem>
  //             <FormLabel>Username</FormLabel>
  //             <FormControl>
  //               <Input placeholder="smol-developer" {...field} />
  //             </FormControl>
  //             <FormMessage />
  //           </FormItem>
  //         )}
  //       />
  //       <FormField
  //         control={form.control}
  //         name="email"
  //         render={({ field }) => (
  //           <FormItem>
  //             <FormLabel>Email</FormLabel>
  //             <FormControl>
  //               <Input placeholder="sama@openai.com" {...field} />
  //             </FormControl>
  //             <FormMessage />
  //           </FormItem>
  //         )}
  //       />

  //       {/* Dynamically generate form fields for prompts */}
  //       {Object.keys(prompts).map(prompt => {

  //         return (
  //           <FormField
  //             key={prompt}
  //             control={form.control}
  //             name={prompt}
  //             render={({ field }) => (
  //               <FormItem>
  //                 <FormLabel>{prompt}</FormLabel>
  //                 <FormControl>
  //                   <Textarea
  //                     placeholder="I love to learn about technology trends and enjoy humor in responses."
  //                     {...field}
  //                   />
  //                 </FormControl>
  //                 <FormDescription>
  //                   Tailor your AI experience here. Each time you interact with
  //                   the AI, it refers to this text to personalize its responses.
  //                   Please keep your description focused and direct. For
  //                   instance: &quot;I have a deep interest in history and prefer
  //                   analogies to explain complex concepts.&quot;
  //                 </FormDescription>
  //                 <FormMessage />
  //               </FormItem>
  //             )}
  //           />
  //         )
  //       })}

  //       <Button type="submit" className="dark:bg-secondary dark:text-white">
  //         Submit
  //       </Button>
  //     </form>
  //   </Form>
  // )
}
