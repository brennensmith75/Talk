export const types = ['OpenAI', 'Anthropic', 'OpenAI-Long', 'Anthropic-Long'] as const

export type ModelType = typeof types[number]

export interface Model<Type = string> {
  id: string
  name: string
  description: string
  strengths?: string
  type: Type
  tokens: string
}

export const models: Model<ModelType>[] = [
  {
    id: 'gpt-4',
    name: 'gpt-4',
    description:
      'Improves on GPT-3.5 and can understand and generate natural language or code. Optimized for chat but works well for traditional completions tasks.',
    type: 'OpenAI',
    tokens: '8,192 tokens',
    strengths:
      'Improved language and code understanding, optimized for chat and traditional completions'
  },
  {
    id: 'gpt-4-0613',
    name: 'gpt-4-0613',
    description:
      'Snapshot of gpt-4 from June 13th 2023 with function calling data. This model will not receive updates, and will be deprecated 3 months after a new version is released.',
    type: 'OpenAI',
    tokens: '8,192 tokens',
    strengths: 'Function calling data, snapshot model'
  },
  {
    id: 'gpt-4-32k',
    name: 'gpt-4-32k',
    description:
      'Same capabilities as the base gpt-4 model but with 4x the context length.',
    type: 'OpenAI-Long',
    tokens: '32,768 tokens',
    strengths: 'Extended context capabilities'
  },
  {
    id: 'gpt-4-32k-0613',
    name: 'gpt-4-32k-0613',
    description:
      'Snapshot of gpt-4-32 from June 13th 2023. This model will not receive updates, and will be deprecated 3 months after a new version is released.',
    type: 'OpenAI-Long',
    tokens: '32,768 tokens',
    strengths: 'Extended context capabilities, snapshot model'
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'gpt-3.5-turbo',
    description:
      'Most capable GPT-3.5 model and optimized for chat at 1/10th the cost of text-davinci-003. Will be updated with our latest model iteration 2 weeks after it is released.',
    type: 'OpenAI',
    tokens: '4,096 tokens',
    strengths: 'Optimized for chat, cost-effective, regularly updated'
  },
  {
    id: 'gpt-3.5-turbo-16k',
    name: 'gpt-3.5-turbo-16k',
    description:
      'Same capabilities as the standard gpt-3.5-turbo model but with 4 times the context.',
    type: 'OpenAI-Long',
    tokens: '16,384 tokens',
    strengths: 'Extended context capabilities'
  },
  {
    id: 'gpt-3.5-turbo-0613',
    name: 'gpt-3.5-turbo-0613',
    description:
      'Snapshot of gpt-3.5-turbo from June 13th 2023 with function calling data. Unlike gpt-3.5-turbo, this model will not receive updates, and will be deprecated 3 months after a new version is released.',
    type: 'OpenAI',
    tokens: '4,096 tokens',
    strengths: 'Function calling data, snapshot model'
  },
  {
    id: 'gpt-3.5-turbo-16k-0613',
    name: 'gpt-3.5-turbo-16k-0613',
    description:
      'Snapshot of gpt-3.5-turbo-16k from June 13th 2023. Unlike gpt-3.5-turbo-16k, this model will not receive updates, and will be deprecated 3 months after a new version is released.',
    type: 'OpenAI-Long',
    tokens: '16,384 tokens',
    strengths: 'Extended context capabilities, snapshot model'
  },
  {
    id: 'claude-1',
    name: 'claude-1',
    description:
      "Claude's first model, ideal for a wide range of more complex tasks."
    type: 'Anthropic',
    tokens: '8k tokens',
    strengths: 'Unsure'
  },
  {
    id: 'claude-2',
    name: 'claude-2',
    description:
      "Anthropic's largest model, ideal for a wide range of more complex tasks. Superior performance on tasks that require complex reasoning",
    type: 'Anthropic',
    tokens: '8k tokens',
    strengths: 'Unsure'
  },
  {
    id: 'claude-instant-1',
    name: 'claude-instant-1',
    description:
      'A smaller model with far lower latency, high throughput sampling at roughly 40 words/sec! Its output quality is somewhat lower than the latest claude-1 model, particularly for complex tasks. However, it is much less expensive and blazing fast. We believe that this model provides more than adequate performance on a range of tasks including text classification, summarization, and lightweight chat applications, as well as search result summarization.',
    type: 'Anthropic',
    tokens: '8k tokens',
    strengths: 'Unsure'
  },
  {
    id: 'claude-1-100k',
    name: 'claude-1-100k',
    description:
      'Our largest model, ideal for a wide range of more complex tasks.',
    type: 'Anthropic-Long',
    tokens: '8k tokens',
    strengths: 'Unsure'
  },
  {
    id: 'claude-instant-1-100k',
    name: 'claude-instant-1-100k',
    description:
      'A smaller model with far lower latency, sampling at roughly 40 words/sec! Its output quality is somewhat lower than the latest claude-1 model, particularly for complex tasks. However, it is much less expensive and blazing fast. We believe that this model provides more than adequate performance on a range of tasks including text classification, summarization, and lightweight chat applications, as well as search result summarization.',
    type: 'Anthropic-Long',
    tokens: '8k tokens',
    strengths: 'Unsure'
  },
]
