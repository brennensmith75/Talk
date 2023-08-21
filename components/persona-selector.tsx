import { Pencil1Icon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'
import { IconCheck, IconChevronUpDown, IconPlus } from '@/components/ui/icons'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Persona } from '@/constants/personas'
import { cn } from '@/lib/utils'
import { PopoverProps } from '@radix-ui/react-popover'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

import { useMutationObserver } from '@/lib/hooks/use-mutation-observer'
import { usePersonaStore } from '@/lib/usePersonaStore'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

interface PersonaSelectorProps extends PopoverProps {
  user: any
}

export function PersonaSelector({ user, ...props }: PersonaSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const { personas, setPersona, persona } = usePersonaStore()
  const [peekedPersona, setPeekedPersona] = React.useState<Persona | null>(null)
  const router = useRouter()

  const onOpenChange = () => {
    setOpen(!open)
    if (open) {
      setPeekedPersona(personas.find(p => p.id === persona?.id) || personas[0])
    }
    setSearch('')
  }

  return (
    <div className="grid gap-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild></HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-[260px] whitespace-pre-line text-sm"
          side="left"
        />
      </HoverCard>
      <TooltipProvider>
        <Popover open={open} onOpenChange={onOpenChange} {...props}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  aria-label="Select a persona"
                  className="pl-2 pr-0"
                >
                  {persona ? persona.emoji : '🤖'}
                  <IconChevronUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>{persona ? persona.prompt_name : 'Choose Persona'}</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent align="start" className="w-[250px] p-0">
            <HoverCard>
              <HoverCardContent
                side="left"
                align="start"
                hidden={!peekedPersona}
                forceMount
                className="hidden min-h-[40px] whitespace-pre-line lg:block"
              >
                <div className="grid gap-2">
                  <h4 className="font-medium leading-none">
                    {peekedPersona?.emoji} {peekedPersona?.prompt_name}
                  </h4>
                  <div className="text-sm text-muted-foreground">
                    {/* truncate for readbility */}
                    {peekedPersona?.prompt_body
                      ?.split(' ')
                      .slice(0, 30)
                      .join(' ') + '...'}
                  </div>
                  <Link
                    href="/settings/personas"
                    className="flex h-auto grow-0 p-0 text-sm"
                  >
                    <Button
                      onClick={e => {
                        e.preventDefault()
                        router.push('/settings/personas')
                      }}
                      variant="link"
                      className="h-auto p-0 text-sm"
                    >
                      Edit
                    </Button>
                  </Link>
                </div>
              </HoverCardContent>
              <Command loop>
                {personas.length > 5 && (
                  <CommandInput
                    value={search}
                    onValueChange={setSearch}
                    placeholder="Search persona..."
                  />
                )}

                <CommandList className="h-[var(--cmdk-list-height)] max-h-[400px]">
                  <CommandEmpty className="p-2">
                    <Link href="/" className="h-auto p-0 text-sm">
                      <Button
                        onClick={e => {
                          e.preventDefault()
                          router.push('/')
                        }}
                        variant="link"
                        className="h-auto w-full justify-start truncate p-0 text-sm"
                      >
                        <IconPlus className="mr-2 shrink-0 text-muted-foreground" />
                        <div className="flex truncate">
                          <span className="truncate">
                            Create {`"${search}"`}
                          </span>
                        </div>
                      </Button>
                    </Link>
                  </CommandEmpty>
                  <HoverCardTrigger />
                  <CommandGroup heading={'Personas'}>
                    {personas?.map(_persona => (
                      <PersonaItem
                        key={_persona.id}
                        persona={_persona}
                        isSelected={persona?.id === _persona.id}
                        onSelect={() => {
                          setPersona(_persona)
                          setOpen(false)
                        }}
                        onPeek={setPeekedPersona}
                      />
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </HoverCard>

            <div className="flex flex-col items-start space-y-2 rounded-b-2xl border-t-2 border-t-foreground bg-background px-2 py-4 text-foreground">
              <Link href="/" className="h-auto p-0 text-sm">
                <Button
                  onClick={e => {
                    e.preventDefault()
                    router.push('/settings/personas')
                  }}
                  variant="link"
                  className="h-auto p-0 text-sm"
                >
                  <IconPlus className="mr-2 text-muted-foreground" />
                  Add New
                </Button>
              </Link>
              <Link href="/settings/personas" className="h-auto p-0 text-sm">
                <Button
                  onClick={e => {
                    e.preventDefault()
                    router.push('/settings/personas')
                  }}
                  variant="link"
                  className="h-auto p-0 text-sm"
                >
                  <Pencil1Icon className="mr-2 text-muted-foreground" />
                  Manage Personas
                </Button>
              </Link>
            </div>
          </PopoverContent>
        </Popover>
      </TooltipProvider>
    </div>
  )
}

interface PersonaItemProps {
  persona: Persona
  isSelected: boolean
  onSelect: (persona: Persona) => void
  onPeek: (persona: Persona) => void
}

function PersonaItem({
  persona,
  isSelected,
  onSelect,
  onPeek
}: PersonaItemProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  useMutationObserver(ref, mutations => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes') {
        if (mutation.attributeName === 'aria-selected') {
          onPeek(persona)
        }
      }
    }
  })

  return (
    <CommandItem
      key={persona.id}
      onSelect={() => onSelect(persona)}
      onMouseEnter={() => onPeek(persona)}
      ref={ref}
      className="aria-selected:bg-primary aria-selected:text-primary-foreground"
    >
      <div className="flex items-center justify-center space-x-2 truncate">
        <div>{persona.emoji}</div>
        <div className="truncate">{persona.prompt_name}</div>
      </div>
      <IconCheck
        className={cn(
          'ml-auto h-4 w-4',
          isSelected ? 'opacity-100' : 'opacity-0'
        )}
      />
    </CommandItem>
  )
}
