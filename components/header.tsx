import Link from 'next/link'
import * as React from 'react'

import { clearChats } from '@/app/actions'
import { auth } from '@/auth'
import { ClearHistory } from '@/components/clear-history'
import { Sidebar } from '@/components/sidebar'
import { SidebarFooter } from '@/components/sidebar-footer'
import { SidebarList } from '@/components/sidebar-list'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import {
  // IconGitHub,
  // IconNextChat,
  IconSeparator
} from '@/components/ui/icons'
import { UserMenu } from '@/components/user-menu'
import { cookies } from 'next/headers'
// import { LoginButton } from '@/components/login-button'
// import { ModelSelector } from './model-selector'
// import { models, types } from '@/constants/models'

export async function Header() {
  const readOnlyRequestCookies = cookies()
  const session = await auth({ readOnlyRequestCookies })

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-gradient-to-b from-background/10 via-background/50 to-background/80 px-4 backdrop-blur-xl">
      <div className="flex items-center">
        {session?.user ? (
          <Sidebar>
            <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
              {/* @ts-ignore */}
              <SidebarList userId={session?.user?.id} />
            </React.Suspense>
            <SidebarFooter>
              <ThemeToggle />
              <ClearHistory clearChats={clearChats} />
            </SidebarFooter>
          </Sidebar>
        ) : (
          <Link href="/" target="_blank" rel="nofollow">
            {/* <IconNextChat className="w-6 h-6 mr-2 dark:hidden" inverted />
            <IconNextChat className="hidden w-6 h-6 mr-2 dark:block" /> */}
            🐣 Smol Talk
          </Link>
        )}
        <div className="flex items-center">
          <IconSeparator className="h-6 w-6 text-muted-foreground/50" />
          {session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <Button variant="link" asChild className="-ml-2">
              <Link href="/sign-in">Login</Link>
            </Button>
          )}
        </div>
      </div>

      {/* <div className="flex items-center justify-end space-x-2">
        <a
          href="https://twitter.com/smolmodels"
          target="_blank"
          className={cn(buttonVariants())}
        >
          <span className="hidden sm:block">🐣 Smol Talk</span>
          <span className="sm:hidden">🐣 Talk</span>
        </a>
      </div> */}
    </header>
  )
}
