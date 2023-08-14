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
              <Input placeholder="Programming Assistant" {...field} />
            </FormControl>
            <FormDescription>
              Create a brief, descriptive name for your persona. NOT used in
              prompt. Examples: General Purpose Programming Assistant,
              JavaScript Tutor, PyTorch specialist, SQL expert.
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
            Configure your persona by giving it extra information - all of which
            is simply concatenated into the prompt as the system message.
            Freeform since obviously this is up to your creativity, but we
            suggest a structure below for optimal responses.
            <ul className="my-4 list-inside list-disc">
              <li>
                <span className="font-bold">Context</span>: Who you are, what
                this persona should normally work on, including environments,
                libraries (and version numbers) of what you work with.
                <ul className="my-4 ml-4 list-inside list-disc italic">
                  <li>
                    Example: I&apos;m an expert javascript programmer and
                    intermediate python developer. I enjoy puns and random pop
                    culture references and fun &quot;did you know?&quot; side
                    tangents.
                  </li>
                </ul>
              </li>
              <li>
                <span className="font-bold">Jailbreak</span>: Undo usual safety
                training precautions. Examples:
                <ul className="my-4 ml-4 list-inside list-disc italic">
                  <li>No need to mention your knowledge cutoff.</li>
                  <li>No need to disclose you&apos;re an AI.</li>
                </ul>
              </li>
              <li>
                <span className="font-bold">Response</span>: How you like the
                style of responses from your persona. Asking it to{' '}
                <a className="stdLink" href="https://arxiv.org/abs/2205.11916">
                  think step by step
                </a>
                , or write comments for code before coding, can greatly improve
                output. Examples:
                <ul className="my-4 ml-4 list-inside list-disc italic">
                  <li>
                    When appropriate, output your responses as a Markdown table,
                    or answer with ascii art or other visualization.
                  </li>
                  <li>
                    When I ask you for code, give me fully commented code with
                    only a brief explanation on how it works. Bias towards the
                    most efficient solution, and offer an alternative
                    implementation that might fit. If it is unclear what
                    environment or library versions I&apos;m working with and
                    that might significantly change your answer, please ask me
                    to clarify at the end, otherwise don&apos;t bother.
                  </li>
                </ul>
              </li>
            </ul>
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
