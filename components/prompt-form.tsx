import { UseChatHelpers } from 'ai/react'
import * as React from 'react'
// import Textarea from 'react-textarea-autosize' // has some SSR issue - ReferenceError: document is not defined

import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

import { IconArrowElbow, IconArrowRight, IconPlus } from '@/components/ui/icons'
import { Label } from '@/components/ui/label'
import { PopoverContent, Popover, PopoverTrigger } from './ui/popover'
import { ModelSelector } from './model-selector'
import { Model } from '@/constants/models'

export interface PromptProps
  extends Pick<UseChatHelpers, 'input' | 'setInput'> {
  onSubmit: (value: string) => Promise<void>
  isLoading: boolean
  setModel: (model: Model) => void
  model: Model
}
const exampleMessages = [
  {
    heading: 'Explain technical concepts',
    message: `What is a "serverless function"?`
  },
  {
    heading: 'Summarize an article',
    message: 'Summarize the following article for a 2nd grader:'
  },
  {
    heading: 'Draft an email',
    message: `Draft an email to my boss about the following:`
  }
]
export function PromptForm({
  onSubmit,
  input,
  setInput,
  setModel,
  model,
  isLoading
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        if (!input?.trim()) {
          return
        }
        setInput('')
        await onSubmit(input)
      }}
      ref={formRef}
    >
      {/* <div className="relative flex flex-col w-full px-8 overflow-hidden max-h-60 grow bg-background sm:rounded-md sm:border sm:px-12">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={e => {
                e.preventDefault()
                router.refresh()
                router.push('/')
              }} */}
      <div className="relative flex flex-col w-full px-8 overflow-hidden grow bg-background sm:rounded-md sm:border sm:px-12">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                buttonVariants({ size: 'sm', variant: 'outline' }),
                'absolute left-0 top-4 h-8 w-8 rounded-full bg-background p-0 sm:left-4'
              )}
            >
              <IconPlus />
              {/* <span className="sr-only">New Chat</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip> */}
              {/* <IconPlus className="w-4 h-4" /> */}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-65">
            <div className="flex flex-col items-start mt-4 space-y-2">
              <Link href="/" className="h-auto p-0 text-sm">
                <Button variant="link" className="h-auto p-0 text-sm">
                  <IconPlus className="mr-2 text-muted-foreground" />
                  New Chat
                </Button>
              </Link>

              <Label className="mb-2 text-xs text-muted-foreground">
                Models
              </Label>
              <ModelSelector setModel={setModel} model={model} />
              <Label className="mb-2 text-xs text-muted-foreground">
                Template
              </Label>
              {exampleMessages.map((message, index) => (
                <Button
                  key={index}
                  variant="link"
                  className="h-auto p-0 text-sm"
                  onClick={() => {
                    setInput(message.message)
                  }}
                >
                  <IconArrowRight className="mr-2 text-muted-foreground" />
                  {message.heading}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Send a message."
          id="smol-inputbox"
          spellCheck={false}
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
        />
        <div className="absolute right-0 top-4 sm:right-4">
          <Button
            id="smol-submitbtn"
            type="submit"
            size="icon"
            disabled={isLoading || input === ''}
          >
            <IconArrowElbow />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </form>
  )
}
