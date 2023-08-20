'use client'

import { UseChatOptions, useChat, type Message } from 'ai/react'

import { getPersonas } from '@/app/actions'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import { EmptyScreen } from '@/components/empty-screen'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Model, models } from '@/constants/models'
import {
  processSearchResult,
  searchTheWeb
} from '@/lib/functions/chat-functions'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { SmolTalkMessage } from '@/lib/types'
import { cn, nanoid } from '@/lib/utils'
import { ChatRequest, FunctionCallHandler } from 'ai'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Persona } from '../constants/personas'
import { usePersonaStore } from '../lib/usePersonaStore'
import { AlertAuth } from './alert-auth'
import { Input } from './ui/input'

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'
export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
  user: any
}

function useSmolTalkChat(
  opts: UseChatOptions & {
    initialMessages?: SmolTalkMessage[] // overriding just to fit our needs
  }
) {
  const { initialMessages, ...rest } = opts
  return useChat({
    ...rest,
    initialMessages: initialMessages?.map(message => ({
      ...message
    }))
  })
}

/* ========================================================================== */
/* Function Call Handler                                                      */
/* ========================================================================== */

const functionCallHandler: FunctionCallHandler = async (
  chatMessages,
  functionCall
) => {
  let functionResponse: ChatRequest

  /* ========================================================================== */
  /* Handle searchTheWeb function call                                          */
  /* ========================================================================== */

  if (functionCall.name === 'searchTheWeb') {
    if (functionCall.arguments) {
      const parsedFunctionCallArguments = JSON.parse(functionCall.arguments)
      const results = await searchTheWeb(parsedFunctionCallArguments.query)
      return (functionResponse = {
        messages: [
          ...chatMessages,
          {
            id: nanoid(),
            name: 'searchTheWeb',
            role: 'function' as const,
            content: JSON.stringify({
              query: functionCall.arguments.query,
              results:
                results ||
                'Sorry, I could not find anything on the internet about that.'
            })
          }
        ]
      })
    }
  }

  /* ========================================================================== */
  /* Handle processSearchResult function call                                   */
  /* ========================================================================== */

  if (functionCall.name === 'processSearchResult') {
    const parsedFunctionCallArguments = JSON.parse(functionCall.arguments)
    const processedContent = await processSearchResult(
      parsedFunctionCallArguments.id
    )

    const { title, url, id, publishedDate, author, score } =
      functionCall.arguments

    return (functionResponse = {
      messages: [
        ...chatMessages,
        {
          id: nanoid(),
          name: 'processSearchResult',
          role: 'function' as const,
          content: JSON.stringify({
            link: {
              title: title,
              url: url,
              publishedDate: publishedDate || null,
              author: author || null,
              score: score || null,
              id: id
            },
            results: processedContent
          })
        }
      ]
    })
  }
}

/* ========================================================================== */
/* Chat Component                                                             */
/* ========================================================================== */

export function Chat({ user, id, initialMessages, className }: ChatProps) {
  const { persona, setPersonas } = usePersonaStore()
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    'ai-token',
    null
  )

  const [model, setModel] = useState<Model>(models[0])

  const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW)
  const [previewTokenInput, setPreviewTokenInput] = useState(previewToken ?? '')
  const { messages, append, reload, stop, isLoading, input, setInput, error } =
    useSmolTalkChat({
      initialMessages,
      id,
      body: {
        id,
        previewToken,
        model: model,
        persona: persona
      },
      // SWYXTODO: check this 401 issue?
      onResponse(response) {
        if (response.status === 401) {
          toast.error(response.statusText)
        }
      },
      experimental_onFunctionCall: functionCallHandler
    })

  useEffect(() => {
    const fetchPersonas = async () => {
      const result = (await getPersonas(user)) as Persona[]
      setPersonas(result)
    }
    fetchPersonas()
  }, [setPersonas, user])

  const isAuthError = error?.message.includes('Unauthorized')

  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {messages.length > 0 ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : !isLoading ? (
          <EmptyScreen setInput={setInput} />
        ) : null}
      </div>
      {isAuthError && <AlertAuth />}
      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
        setModel={setModel}
        model={model}
        user={user}
      />
      {/* @ts-ignore */}
      <Dialog open={previewTokenDialog} onOpenChange={setPreviewTokenDialog}>
        {/* @ts-ignore */}
        <DialogContent>
          <DialogHeader>
            {/* @ts-ignore */}
            <DialogTitle>Enter your OpenAI Key</DialogTitle>
            {/* @ts-ignore */}
            <DialogDescription>
              If you have not obtained your OpenAI API key, you can do so by{' '}
              <a
                href="https://platform.openai.com/signup/"
                className="underline"
              >
                signing up
              </a>{' '}
              on the OpenAI website. This is only necessary for preview
              environments so that the open source community can test the app.
              The token will be saved to your browser&apos;s local storage under
              the name <code className="font-mono">ai-token</code>.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={previewTokenInput}
            placeholder="OpenAI API key"
            onChange={e => setPreviewTokenInput(e.target.value)}
          />
          <DialogFooter className="items-center">
            <Button
              onClick={() => {
                setPreviewToken(previewTokenInput)
                setPreviewTokenDialog(false)
              }}
            >
              Save Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
