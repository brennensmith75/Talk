'use client'

import {
  createClientComponentClient,
  type Session
} from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { HomeIcon } from '@radix-ui/react-icons'
import { getUserInitials } from '@/lib/helpers'

export interface UserMenuProps {
  user: Session['user']
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()
  const path = usePathname()

  // Create a Supabase client configured to use cookies
  const supabase = createClientComponentClient()

  const signOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <div className="flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0">
            {user?.user_metadata.avatar_url ? (
              <Image
                height={60}
                width={60}
                className="h-6 w-6 select-none rounded-full ring-1 ring-zinc-100/10 transition-opacity duration-300 hover:opacity-80"
                src={
                  user?.user_metadata.avatar_url
                    ? `${user.user_metadata.avatar_url}&s=60`
                    : ''
                }
                alt={user.user_metadata.name ?? 'Avatar'}
              />
            ) : (
              <div className="flex h-7 w-7 shrink-0 select-none items-center justify-center rounded-full bg-muted/50 text-xs font-medium uppercase text-muted-foreground">
                {getUserInitials(user?.user_metadata.name ?? user?.email)}
              </div>
            )}
            <span className="ml-2">{user?.user_metadata.name ?? '👋🏼'}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={8} align="start" className="w-[180px]">
          <DropdownMenuItem
            onClick={() => router.push('/settings')}
            className="cursor-pointer flex-col items-start"
          >
            <div className="text-xs font-medium">Settings</div>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer flex-col items-start">
            <div className="text-xs font-medium">
              {user?.user_metadata.name}
            </div>
            <div className="text-xs text-zinc-500">{user?.email}</div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem asChild>
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between w-full text-xs"
            >
              Vercel Homepage
              <IconExternalLink className="w-3 h-3 ml-auto" />
            </a>
          </DropdownMenuItem> */}
          <DropdownMenuItem
            onClick={signOut}
            className="cursor-pointer text-xs text-red-300 hover:bg-red-700"
          >
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {path.includes('/settings') && (
        <Button
          variant={'default'}
          onClick={() => router.push('/')}
          className="ml-4 flex flex-row items-center"
        >
          <HomeIcon className="mr-2 h-4 w-4" /> Home
        </Button>
      )}
    </div>
  )
}
