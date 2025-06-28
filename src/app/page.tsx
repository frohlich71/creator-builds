'use client'

import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useCurrentUser } from "./hooks/useCurrentUser";
import { useUserSearch } from "./hooks/useUserSearch";
import Link from "next/link";
import Image from "next/image";
import ComboWithImage from "./ui/components/ComboWithImage";
import { SearchUser } from "@/types/search";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isAuthenticated, isLoading, user } = useCurrentUser()
  const { users, handleQueryChange, isLoading: isSearchLoading } = useUserSearch()
  const router = useRouter()

  const handleUserSelect = (selectedUser: SearchUser | null) => {
    if (selectedUser) {
      router.push(`/profile/${selectedUser.name}`)
    }
  }
  const getUserLabel = (user: SearchUser) => user.nickname || user.name
  const getUserImage = (user: SearchUser) => user.image || user.profileImage || '/fallback.png'

  return (
    <div className="relative isolate overflow-hidden bg-white">
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full mask-[radial-gradient(100%_100%_at_top_right,white,transparent)] stroke-gray-200"
      >
        <defs>
          <pattern
            x="50%"
            y={-1}
            id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
            width={200}
            height={200}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <rect fill="url(#ec3434c5-978c-4f66-83c7-11c213f99cb7)" width="100%" height="100%" strokeWidth={2} />
      </svg>
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:shrink-0 lg:pt-8">
          <Image
            alt="Your Company"
            src="/record.png"
            width={44}
            height={44}
            className="h-11 w-auto"
          />
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href="#" className="inline-flex space-x-6">
              <span className="rounded-full bg-rose-600/10 px-3 py-1 text-sm/6 font-semibold text-rose-600 ring-1 ring-rose-600/10 ring-inset">
                What is new
              </span>
              <span className="inline-flex items-center space-x-2 text-sm/6 font-medium text-gray-600">
                <span>Just shipped v1.0</span>
                <ChevronRightIcon aria-hidden="true" className="size-5 text-gray-400" />
              </span>
            </a>
          </div>
          <h1 className="mt-10 text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-7xl">
            The gear behind your favorite creators
          </h1>
          <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            Find out the gear your favorite creators use to make their content.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <div className="w-full max-w-lg lg:max-w-xs">
              <ComboWithImage
                options={users}
                value={null}
                onChange={handleUserSelect}
                label="Search creators"
                getLabel={getUserLabel}
                getImageUrl={getUserImage}
                onInputChange={handleQueryChange}
                isLoading={isSearchLoading}
                noResultsMessage="Nenhum criador encontrado"
              />
            </div>
            
            {/* Botão dinâmico baseado na autenticação */}
            {isLoading ? (
              <div className="rounded-md bg-gray-300 px-3.5 py-2.5 text-sm font-semibold text-gray-500 shadow-xs animate-pulse">
                Loading...
              </div>
            ) : isAuthenticated ? (
              <a
                href={`/profile/${user?.name}`}
                className="rounded-md transition-all duration-300 bg-rose-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-rose-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              >
                View my profile
              </a>
            ) : (
              <Link
                href="/register"
                className="rounded-md transition-all duration-300 bg-rose-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-rose-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              >
                Register your setup
              </Link>
            )}
          </div>
        </div>
        <div className="mx-auto mt-16 hidden sm:flex max-w-2xl sm:mt-24 lg:mt-0 lg:mr-0 lg:ml-10 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-gray-900/10 ring-inset lg:-m-4 lg:rounded-2xl lg:p-4">
              <Image
                alt="App screenshot"
                src="/hero_section_image.jpg"
                width={2432}
                height={1442}
                className="w-304 rounded-md shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}