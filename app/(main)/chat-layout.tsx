'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Database } from '@/lib/db_types'
import { getUserInitials } from '@/lib/helpers'
import { Chat } from '@/lib/types'
import { Dialog, Transition } from '@headlessui/react'
import {
  Cross1Icon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  HamburgerMenuIcon
} from '@radix-ui/react-icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/supabase-js'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Fragment, useEffect, useMemo, useState, useTransition } from 'react'
import { SidebarActions } from '../../components/sidebar-actions'
import { SidebarItem } from '../../components/sidebar-item'
import { removeChat, shareChat } from '../actions'
import Link from 'next/link'

type ChatLayoutProps = {
  serverChats: Chat[]
  user?: User
  children: any
}

export default function ChatLayout({
  serverChats,
  user,
  children
}: ChatLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chats, setChats] = useState<Chat[]>(serverChats)

  const supabase = createClientComponentClient<Database>()
  const router = useRouter()
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const [_, startTransition] = useTransition()

  const onNavigate = (route: string) => {
    router.push(route)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const profileOptions = useMemo(
    () => [
      {
        label: 'Profile',
        onClick: () => onNavigate('/settings')
      },
      {
        label: 'My Plan',
        onClick: () => onNavigate('/settings/plan')
      },
      {
        label: 'Settings',
        onClick: () => onNavigate('/settings')
      },
      {
        label: theme === 'light' ? 'Dark Appearance' : 'Light Appearance',
        onClick: () =>
          startTransition(() => {
            setTheme(theme === 'light' ? 'dark' : 'light')
          })
      }
    ],
    [theme]
  )

  useEffect(() => {
    const channel = supabase
      .channel('realtime-posts')
      .on(
        // @ts-ignore
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chats'
        },
        (payload: {
          eventType: string
          new: Database['public']['Tables']['chats']['Row']
          old: Database['public']['Tables']['chats']['Row']
        }) => {
          console.log(payload)
          if (payload.eventType === 'DELETE') {
            setChats(prev => prev.filter(chat => chat.id !== payload.old.id))
          } else if (payload.eventType === 'INSERT') {
            setChats(prev =>
              [payload?.new?.payload as Chat, ...prev].sort(
                (a: Chat, b: Chat) => {
                  return b.createdAt - a.createdAt
                }
              )
            )
          }
        }
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [pathname])

  return (
    <>
      <Transition.Root show={mobileSidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setMobileSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setMobileSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <Cross1Icon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto">
                  <Sidebar
                    onSignOut={signOut}
                    setOpen={setMobileSidebarOpen}
                    profileOptions={profileOptions}
                    chats={chats}
                    user={user}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="hidden h-screen lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <Sidebar
          profileOptions={profileOptions}
          onSignOut={signOut}
          isOpen={sidebarOpen}
          setOpen={setSidebarOpen}
          chats={chats}
          user={user}
        />
      </div>

      <div className="sticky top-0 z-40 flex items-center gap-x-6 border-b p-4 sm:px-6">
        <button
          type="button"
          className="-m-2.5 p-2.5 lg:hidden"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <HamburgerMenuIcon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6">
          <Link href="/">Chat</Link>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex rounded-full p-0">
              {user?.user_metadata.avatar_url ? (
                <Image
                  height={60}
                  width={60}
                  className="h-8 w-8 select-none rounded-full ring-1 ring-zinc-100/10 transition-opacity duration-300 hover:opacity-80"
                  src={
                    user?.user_metadata?.avatar_url
                      ? `${user.user_metadata.avatar_url}&s=60`
                      : ''
                  }
                  alt={user?.user_metadata?.name ?? 'User avatar'}
                />
              ) : (
                <div className="flex h-7 w-7 shrink-0 select-none items-center justify-center rounded-full bg-muted/50 text-xs font-medium uppercase text-muted-foreground">
                  {getUserInitials(user?.user_metadata?.name ?? user?.email)}
                </div>
              )}
              <span className="sr-only">Your profile</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.user_metadata?.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.user_metadata?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {profileOptions.map(option => (
                <DropdownMenuItem key={option.label} onClick={option.onClick}>
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-destructive">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <main className="flex h-full flex-1 flex-col bg-muted/50 lg:pl-72">
        <div>{children}</div>
      </main>
    </>
  )
}

const Sidebar = ({
  isOpen,
  setOpen,
  chats,
  user,
  profileOptions,
  onSignOut
}: {
  isOpen?: boolean
  setOpen?: any
  chats: Chat[]
  user?: User
  profileOptions: any[]
  onSignOut: any
}) => {
  return (
    <>
      <div className="flex h-full flex-col overflow-y-hidden border-r bg-white dark:bg-black">
        <div className="flex items-center justify-between border-b py-4 pl-4 pr-3">
          <div className="flex items-center">
            <h1 className="ml-2 font-semibold">
              <Link href="/">🐣 Smol Talk</Link>
            </h1>
          </div>
          <div className="flex">
            <Button
              onClick={() => setOpen(!isOpen)}
              className="hidden px-2 lg:block"
              variant={'ghost'}
            >
              {isOpen ? <DoubleArrowLeftIcon /> : <DoubleArrowRightIcon />}
            </Button>
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-y-hidden">
          <Tabs defaultValue="chats" className="flex h-full w-full flex-col">
            <div className="mx-3 mt-3 flex items-center justify-center space-x-2">
              <TabsList className="flex h-9 w-full flex-1">
                <TabsTrigger className="w-full" value="chats">
                  Chats
                </TabsTrigger>
                <TabsTrigger className="w-full" value="discover">
                  Discover
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent
              value="chats"
              className="h-full overflow-y-scroll px-4"
            >
              {chats?.length ? (
                <div className="space-y-2">
                  {chats.map(
                    (chat: any, i: number) =>
                      chat && (
                        <SidebarItem
                          onClick={() => setOpen(false)}
                          key={chat.id}
                          chat={chat}
                        >
                          <SidebarActions
                            chat={chat}
                            removeChat={removeChat}
                            shareChat={shareChat}
                          />
                        </SidebarItem>
                      )
                  )}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No chat history
                  </p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="discover">
              <div className="p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Nothing to discover yet ;)
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="hidden h-16 items-center border-t lg:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-full w-full items-center justify-start gap-x-2 rounded-none px-6 py-3 text-left text-sm focus:outline-none"
              >
                {user?.user_metadata.avatar_url ? (
                  <Image
                    height={60}
                    width={60}
                    className="h-8 w-8 select-none rounded-full ring-1 ring-zinc-100/10 transition-opacity duration-300 hover:opacity-80"
                    src={
                      user?.user_metadata.avatar_url
                        ? `${user.user_metadata.avatar_url}&s=60`
                        : ''
                    }
                    alt={user?.user_metadata.name ?? 'Avatar'}
                  />
                ) : (
                  <div className="flex h-7 w-7 shrink-0 select-none items-center justify-center rounded-full bg-muted/50 text-xs font-medium uppercase text-muted-foreground">
                    {getUserInitials(user?.user_metadata.name ?? user?.email)}
                  </div>
                )}
                <span className="sr-only">Your profile</span>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.user_metadata?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.user_metadata?.email}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.user_metadata?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.user_metadata?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {profileOptions.map(option => (
                  <DropdownMenuItem key={option.label} onClick={option.onClick}>
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onSignOut}
                className="text-destructive"
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  )
}
