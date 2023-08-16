import Metaphor, { DocumentContent, Result } from 'metaphor-node'

const metaphorKey = process.env.NEXT_PUBLIC_METAPHOR_API_KEY as string
export const metaphor = new Metaphor(metaphorKey)

export async function processSearchResult(
  result: Result
): Promise<DocumentContent> {
  // Use the Metaphor instance to get the contents of the first result
  const contentResponse = await metaphor.getContents([result])

  // Get the contents of the first result
  const resultContent = contentResponse.contents[0]

  return resultContent
}
