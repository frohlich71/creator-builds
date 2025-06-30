'use client'

import {
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { User } from 'next-auth'
import { getProfileByName } from '@/app/service/profile'
import DesktopRightSection from './components/DesktopRightSection'
import LoginDrawer from './components/LoginDrawer'
import Link from 'next/link'


export default function Header() {
  const {data: session, status} = useSession()

  const [user, setUser] = useState<User | null>(null)
  const [openDrawer, setOpenDrawer] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  useEffect(() => {
    if (status === 'authenticated') {
      setIsAuthenticated(true)

      getProfileByName(session?.accessToken?? '', session?.user?.name?? '')
      .then((res) => {
        setUser(res)
      })
    }
  }, [session?.accessToken, session?.user?.name, status])

  return (
    <>
      <LoginDrawer open={openDrawer} setOpen={setOpenDrawer} />
      <Popover as="header" className="bg-white">
        <div className="mx-auto w-full shadow-md px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center h-[4rem]  justify-center py-5 lg:justify-between">
            {/* Logo */}
            <div className="absolute left-0 shrink-0 lg:static">
              <Link href="/">
                <span className="sr-only">Creator builds logo</span>
                <Image
                  alt="Creator builds logo"
                  src="/logo.jpg"
                  width={130}
                  height={130}
                  className="h-auto w-auto"
                />
              </Link>
            </div>

            {/* Right section on desktop */}
            <DesktopRightSection isAuthenticated={isAuthenticated} profileImage={user?.profileImage} setLoginDrawerOpen={setOpenDrawer} username={user?.name}/>


            {/* Menu button */}
            <div className="absolute right-0 shrink-0 lg:hidden">
              {/* Mobile menu button */}
              <PopoverButton hidden={!isAuthenticated} className="group relative inline-flex items-center justify-center rounded-md bg-transparent p-2 text-rose-200 hover:bg-white/10 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
              </PopoverButton>
            </div>
          </div>
          <div className="hidden border-t border-white/20  lg:block">

          </div>
        </div>

        <div className="lg:hidden">
          <PopoverBackdrop
            transition
            className="fixed inset-0 z-20 bg-black/25 duration-150 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in"
          />

          <PopoverPanel
            focus
            transition
            className="absolute inset-x-0 top-0 z-30 mx-auto w-full max-w-3xl origin-top transform p-2 transition duration-150 data-closed:scale-95 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in"
          >
            <div className="divide-y divide-gray-200 rounded-lg bg-white shadow-lg ring-1 ring-black/5">
              <div className="pt-3 pb-2">
                <div className="flex items-center justify-between px-4">
                  <div>
                    <Image
                      alt="Creator builds logo"
                      src="/logo.jpg"
                      width={130}
                      height={130}
                      className="h-auto w-auto"
                    />
                  </div>
                  <div className="-mr-2">
                    <PopoverButton className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-rose-500 focus:outline-hidden focus:ring-inset">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon aria-hidden="true" className="size-6" />
                    </PopoverButton>
                  </div>
                </div>
              </div>
              <div className="pt-4 pb-2">
                <div className="flex items-center px-5">
                  <div className="shrink-0">
                    <Image
                      alt="Profile picture"
                      src={user?.profileImage && user?.profileImage.trim() !== '' ? user?.profileImage : '/fallback.png'}
                      width={32}
                      height={32}
                      className="size-8 rounded-full"
                    />
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <div className="truncate text-base font-medium text-gray-800">{user?.name}</div>
                    <div className="truncate text-sm font-medium text-gray-500">{user?.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  <a
                    href={`/profile/${user?.name}`}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                    >
                    Profile
                  </a>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="block W-full rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                    >
                    Sign out
                  </button>
                  
                </div>
              </div>
            </div>
          </PopoverPanel>
        </div>
      </Popover>
    </>
)
}