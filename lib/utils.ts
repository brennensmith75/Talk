import { clsx, type ClassValue } from 'clsx'
import { customAlphabet } from 'nanoid'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7
) // 7-character random string

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init)

  if (!res.ok) {
    const json = await res.json()
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number
      }
      error.status = res.status
      throw error
    } else {
      throw new Error('An unexpected error occurred')
    }
  }

  return res.json()
}

export function formatDate(input: string | number | Date): string {
  const date = new Date(input)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}



// thanks chatgpt
export function stringToColor(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    // Multiply by a prime number and add ASCII value of current character
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'
  for (let i = 0; i < 3; i++) {
    // Bitwise AND operation with 'hash', shifted by (i * 8) bits
    const value = (hash >> (i * 8)) & 0xff
    // Convert to hexadecimal and append to 'color' string
    color += ('00' + value.toString(16)).substr(-2)
  }

  return color
}

// thanks claude
export function invertColorForText(bgColor: string) {
  // Convert hex to RGB
  let r = parseInt(bgColor.substring(1, 3), 16)
  let g = parseInt(bgColor.substring(3, 5), 16)
  let b = parseInt(bgColor.substring(5, 7), 16)

  // Calculate luminance
  let luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b

  // Return black or white color based on luminance
  return luminance > 128 ? '#000' : '#fff'
}
