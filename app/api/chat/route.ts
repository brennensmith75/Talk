import { getPersonaById } from '@/app/actions'
import { Database } from '@/lib/db_types'
import {
  createRouteHandlerClient,
  type User
} from '@supabase/auth-helpers-nextjs'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { cookies } from 'next/headers'
import 'server-only'
import { Configuration, OpenAIApi } from 'smolai'

import { auth } from '@/auth'
import { Persona } from '@/constants/personas'
import { nanoid } from '@/lib/utils'
import { ChatCompletionFunctions } from 'smolai'
import PromptBuilder from './prompt-builder'

export const runtime = 'nodejs'

const processSearchResultSchema: ChatCompletionFunctions = {
  name: 'processSearchResult',
  description:
    'Read the contents of the first or next search result and return it along with the remaining search results.',
  parameters: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'The title of the search result.'
      },
      url: {
        type: 'string',
        description: 'The URL of the search result.'
      },
      publishedDate: {
        type: 'string',
        description: 'The date the search result was published.'
      },
      author: {
        type: 'string',
        description: 'The author of the search result.'
      },
      score: {
        type: 'number',
        descripion:
          'Relevance score of the search result on a scale of 0 to 1, with 1 being the most relevant.'
      },
      id: {
        type: 'string',
        description: 'Unique identifier for the search result.'
      }
    },
    required: ['title', 'url', 'id']
  }
}

const searchTheWebSchema: ChatCompletionFunctions = {
  name: 'searchTheWeb',
  description:
    'Perform a web search and returns the top 20 search results based on the search query.',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'The query to search for.'
      }
    },
    required: ['query']
  }
}

const functionSchema = [searchTheWebSchema, processSearchResultSchema]

export async function POST(req: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore
  })

  const json = await req.json()
  const { messages, previewToken, model, persona } = json

  const currentDate = new Date()

  const userId = (await auth({ cookieStore }))?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  /*
   * Create the system prompt from modular templates in prompts.json.
   */
  const promptBuilder = new PromptBuilder()
    .addTemplate('intro')
    .addTemplate('tone')
    .addTemplate('webSearch', { date: currentDate })
    .addTemplate('outro')

  if (userId && persona?.id) {
    const storedPersona = await getPersonaById(
      { id: userId } as User,
      { id: persona.id } as Persona
    )

    // @ts-ignore
    if (storedPersona?.error) {
      // @ts-ignore
      console.error(storedPersona.error)
      return
    }

    // @ts-ignore
    if (storedPersona?.id !== null) {
      promptBuilder.addTemplate('customPersona', {
        // @ts-ignore
        personaName: storedPersona.prompt_name,
        // @ts-ignore
        personaBody: storedPersona.prompt_body
      })
    }
  }

  const systemPrompt = {
    role: 'system',
    content: promptBuilder.build()
  }

  const configuration = new Configuration({
    apiKey: previewToken || process.env.OPENAI_API_KEY
  })

  const openai = new OpenAIApi(configuration)

  const res = await openai.createChatCompletion({
    model: model.id || 'gpt-4-0613',
    messages: [
      systemPrompt,
      // personaPrompts,
      ...messages
    ],
    functions: functionSchema,
    temperature: 0.5,
    stream: true
  })

  for (const [key, value] of Object.entries(res.headers)) {
    console.log(key + ': ' + value)
  }

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100)
      const id = json.id ?? nanoid()
      const createdAt = Date.now()
      const path = `/chat/${id}`
      const payload = {
        id,
        title,
        userId,
        createdAt,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: 'assistant'
          }
        ]
      }

      // Insert chat into database.
      await supabase.from('chats').upsert({ id, payload }).throwOnError()
    }

    //   experimental_onFunctionCall: async (
    //     { name, arguments: args },
    //     createFunctionCallMessages
    //   ) => {
    //     // if you skip the function call and return nothing, the `function_call`
    //     // message will be sent to the client for it to handle
    //     if (name === 'searchTheWeb') {
    //       console.log('🔵 called searchTheWeb: ', args)

    //       const results = await searchTheWeb(args.query as string)
    //       console.log('🟢 results: ', results)

    //       try {
    //         JSON.stringify(results)
    //       } catch (e) {
    //         console.error('Serialization error: ', e)
    //       }

    //       if (results === undefined) {
    //         return 'Sorry, I could not find anything on the internet about that.'
    //       }

    //       // Generate function messages to keep in conversation context.
    //       // @ts-ignore
    //       const newMessages = createFunctionCallMessages(results)
    //       console.log('🟠 newMessages: ', newMessages)

    //       return openai.createChatCompletion({
    //         messages: [...messages, ...newMessages],
    //         stream: true,
    //         model: 'gpt-4-0613',
    //         functions: functionSchema
    //       })
    //     }
    //     if (name === 'processSearchResult') {
    //       console.log('🔵 called processSearchResult: ', args)

    //       // @ts-ignore
    //       const processedResults = await processSearchResult(args)
    //       console.log('🟢 processedResults: ', processedResults)

    //       // Generate function messages to keep conversation context.
    //       // @ts-ignore
    //       const newMessages = createFunctionCallMessages(processedResults)
    //       console.log('🟠 newMessages: ', newMessages)

    //       return openai.createChatCompletion({
    //         messages: [...messages, ...newMessages],
    //         stream: true,
    //         model: 'gpt-4-0613',
    //         functions: functionSchema
    //       })
    //     }
    //   }
  })

  return new StreamingTextResponse(stream)
}
