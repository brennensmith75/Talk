import React from 'react'

import { cn } from '@/lib/utils'
import { ExternalLink } from '@/components/external-link'
import Link from 'next/link'

export function FooterText({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'px-2 text-center text-xs leading-normal text-muted-foreground',
        className
      )}
      {...props}
    >
      <Link className="hover:underline" href="https://smol.ai">
        Smol Talk
      </Link>{' '}
      is a part of the{' '}
      <ExternalLink href="https://smol.ai">SmolAI</ExternalLink> family.
    </p>
  )
}
