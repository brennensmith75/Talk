'use client'

import { PopoverProps } from '@radix-ui/react-popover'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'
import { useMutationObserver } from '@/lib/hooks/use-mutation-observer'

import {
  IconArrowRight,
  IconChevronUpDown,
  IconPlus
} from '@/components/ui/icons'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Model, models, types } from '@/constants/models'

interface ModelSelectorProps extends PopoverProps {
  setModel: (model: Model) => void
  setInput: React.Dispatch<React.SetStateAction<string>>
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

export function ModelSelector({
  setModel,
  setInput,
  model,
  ...props
}: ModelSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const [peekedModel, setPeekedModel] = React.useState<Model>(models[0])

  return (
    <div className="grid gap-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild></HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-[260px] text-sm"
          side="left"
        >
          The model which will generate the completion. Some models are suitable
          for natural language tasks, others specialize in code. Learn more.
        </HoverCardContent>
      </HoverCard>
      <Popover open={open} onOpenChange={setOpen} {...props}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a model"
            className="w-15 justify-between truncate"
          >
            {model ? model.name : 'Select a model...'}
            <IconChevronUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[250px] p-0">
          <div className="flex flex-col items-start space-y-2 rounded-t-2xl border-b-2 border-b-foreground bg-background px-2 py-4 text-foreground">
            <Link href="/" className="h-auto p-0 text-sm">
              <Button
                onClick={e => {
                  e.preventDefault()
                  router.refresh()
                  router.push('/')
                }}
                variant="link"
                className="h-auto p-0 text-sm"
              >
                <IconPlus className="mr-2 text-muted-foreground" />
                New Chat
              </Button>
            </Link>

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
          <HoverCard>
            <HoverCardContent
              side="left"
              align="start"
              forceMount
              className="hidden min-h-[280px] lg:block"
            >
              <div className="grid gap-2">
                <h4 className="font-medium leading-none">{peekedModel.name}</h4>
                <div className="text-sm text-muted-foreground">
                  {peekedModel.description}
                </div>
                {peekedModel.strengths ? (
                  <div className="mt-4 grid gap-2">
                    <h5 className="text-sm font-medium leading-none">
                      Strengths
                    </h5>
                    <ul className="text-sm text-muted-foreground">
                      {peekedModel.strengths}
                    </ul>
                  </div>
                ) : null}
              </div>
            </HoverCardContent>
            <Command loop>
              <CommandList className="h-[var(--cmdk-list-height)] max-h-[400px]">
                <CommandEmpty>No Models found.</CommandEmpty>
                <HoverCardTrigger />
                {types.map(type => (
                  <CommandGroup key={type} heading={type}>
                    {models
                      .filter(model => model.type === type)
                      .map(model => (
                        <ModelItem
                          key={model.id}
                          model={model}
                          isSelected={model?.id === model.id}
                          onPeek={model => setPeekedModel(model)}
                          onSelect={() => {
                            setModel(model)
                            setOpen(false)
                          }}
                        />
                      ))}
                  </CommandGroup>
                ))}
              </CommandList>
            </Command>
          </HoverCard>
        </PopoverContent>
      </Popover>
    </div>
  )
}

interface ModelItemProps {
  model: Model
  isSelected: boolean
  onSelect: () => void
  onPeek: (model: Model) => void
}

function ModelItem({ model, isSelected, onSelect, onPeek }: ModelItemProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  useMutationObserver(ref, mutations => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes') {
        if (mutation.attributeName === 'aria-selected') {
          onPeek(model)
        }
      }
    }
  })

  return (
    <CommandItem
      key={model.id}
      onSelect={onSelect}
      onMouseEnter={() => onPeek(model)}
      ref={ref}
      className="aria-selected:bg-primary aria-selected:text-primary-foreground"
    >
      {model.name}
      {/* <IconCheck
        className={cn(
          'ml-auto h-4 w-4',
          isSelected ? 'opacity-100' : 'opacity-0'
        )}
      /> */}
    </CommandItem>
  )
}
