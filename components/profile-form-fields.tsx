import { invertColorForText, stringToColor } from '@/lib/utils'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { UseFormReturn } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'
import { EmojiPicker } from './ui/emoji-picker'

export function PromptNameField({ form }: { form: UseFormReturn }) {
  return (
    <FormField
      control={form.control}
      name={`prompt_name`}
      render={({ field }) => (
        <div className="flex flex-1 space-x-2">
          <FormItem className="mb-4 flex-1">
            <FormLabel>Persona Name</FormLabel>
            <FormControl>
              <Input placeholder="Tech Guru" {...field} />
            </FormControl>
            <FormDescription>
              Create a brief, descriptive title for your persona.
            </FormDescription>
            <FormMessage />
          </FormItem>
          <FormItem className="flex flex-col">
            <FormLabel className="mb-2.5">Persona Color</FormLabel>
            <FormDescription
              className="w-24 rounded-md py-2 font-semibold"
              style={{
                backgroundColor: stringToColor(field.value || ''),
                color: invertColorForText(stringToColor(field.value || '')),
                textAlign: 'center'
              }}
            >
              {stringToColor(field.value || '')}
            </FormDescription>
          </FormItem>
        </div>
      )}
    />
  )
}

export function PromptEmojiField({ form }: { form: UseFormReturn }) {
  return (
    <FormField
      control={form.control}
      name={`prompt_emoji`}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <EmojiPicker value={field.value} onChange={field.onChange} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function PromptBodyField({ form }: { form: UseFormReturn }) {
  return (
    <FormField
      control={form.control}
      name={`prompt_body`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Persona Instructions</FormLabel>
          <FormControl>
            <Textarea
              placeholder="I'm a tech enthusiast who loves discussing the latest gadgets and AI trends."
              {...field}
            />
          </FormControl>
          <FormDescription>
            Identify your unique perspective or a perspective you&apos;d like
            the AI to adopt. This helps the AI to tailor its responses to your
            interests.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
