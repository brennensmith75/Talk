import { UseChatHelpers } from 'ai/react'
import * as React from 'react'
// import Textarea from 'react-textarea-autosize' // has some SSR issue - ReferenceError: document is not defined

import { Button, buttonVariants } from '@/components/ui/button'
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger
// } from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { cn } from '@/lib/utils'
// import { useRouter } from 'next/navigation'

import { IconArrowElbow, IconPlus } from '@/components/ui/icons'
// import { PopoverContent, Popover, PopoverTrigger } from './ui/popover'
import { ModelSelector } from './model-selector'
import { Model } from '@/constants/models'

export interface PromptProps
  extends Pick<UseChatHelpers, 'input' | 'setInput'> {
  onSubmit: (value: string) => Promise<void>
  isLoading: boolean
  setModel: (model: Model) => void
  model: Model
}
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
  // const router = useRouter()

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
      <div className="relative flex flex-col-reverse w-full gap-2 overflow-hidden sm:flex-col grow bg-background sm:rounded-md sm:border sm:px-4">
        <textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={/* calculate rows based on input lines */ Math.min(8, input.split('\n').length) }
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Send a message."
          id="smol-inputbox"
          spellCheck={false}
          className="min-h-[60px] w-full resize-none bg-slate-100/10 sm:bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
        />
        <div className="right-0 flex justify-center gap-2 sm:justify-normal sm:absolute top-4 sm:right-6">
          <Button
            id="smol-submitbtn"
            type="submit"
            size="icon"
            disabled={isLoading || input === ''}
          >
            <IconArrowElbow />
            <span className="sr-only">Send message</span>
          </Button>

          <ModelSelector setModel={setModel} setInput={setInput} model={model} />
        </div>
      </div>
    </form>
  )
}
