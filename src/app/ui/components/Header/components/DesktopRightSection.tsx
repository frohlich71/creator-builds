import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import Image from "next/image";
import ComboWithImage from "../../ComboWithImage";
import { useUserSearch } from "@/app/hooks/useUserSearch";
import { SearchUser } from "@/types/search";
import { useRouter } from "next/navigation";


export default function DesktopRightSection({isAuthenticated, setLoginDrawerOpen, username, profileImage}: {isAuthenticated: boolean, setLoginDrawerOpen: (open: boolean) => void, username: string | undefined| null, profileImage?: string}) {
  
  const { users, handleQueryChange, isLoading: isSearchLoading } = useUserSearch()
  const router = useRouter()

  async function handleSignOut() {
    await signOut({callbackUrl: '/'})
  }

  const handleUserSelect = (selectedUser: SearchUser | null) => {
    if (selectedUser) {
      router.push(`/profile/${selectedUser.name}`)
    }
  }

  const getUserLabel = (user: SearchUser) => user.nickname || user.name
  const getUserImage = (user: SearchUser) => user.image || user.profileImage || '/fallback.png'

  return (
    <>
      {isAuthenticated ? (<div className="hidden lg:ml-4 lg:flex lg:items-center lg:pr-0.5">
            {/* Search creators combo */}
            <div className="w-64 mr-4">
              <ComboWithImage
                options={users}
                value={null}
                onChange={handleUserSelect}
                label="Search creators"
                getLabel={getUserLabel}
                getImageUrl={getUserImage}
                onInputChange={handleQueryChange}
                isLoading={isSearchLoading}
                noResultsMessage="No creators found"
                hideChevron={true}
              />
            </div>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-4 shrink-0">
              <div>
                <MenuButton className="relative flex rounded-full bg-white text-sm ring-2 ring-white/20 focus:ring-white focus:outline-hidden">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <Image 
                    alt="Profile picture" 
                    src={profileImage && profileImage.trim() !== '' ? profileImage : '/fallback.png'} 
                    width={32}
                    height={32}
                    className="size-8 rounded-full" 
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute -right-2 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-75 data-leave:ease-in data-closed:data-leave:scale-95 data-closed:data-leave:transform data-closed:data-leave:opacity-0"
              >
                <MenuItem key={'profile_menu_item'}>
                    <a
                      href={(username !== null && username !== undefined) ? `/profile/${username}`: '/'}
                      className="block cursor-pointer text-left px-4 py-2 text-sm transition-all duration-300 text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      Profile
                    </a>
                  </MenuItem>
                  <MenuItem key={'update_password_menu_item'}>
                    <a
                      href="/update-password"
                      className="block cursor-pointer text-left px-4 py-2 text-sm transition-all duration-300 text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      Update Password
                    </a>
                  </MenuItem>
                  <MenuItem key={'signOut_menu_item'}>
                    <button
                      onClick={handleSignOut}
                      className="block cursor-pointer text-left w-full px-4 py-2 text-sm transition-all duration-300 text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      Sign out
                    </button>
                  </MenuItem>
              </MenuItems>
            </Menu>
          </div>) : (
              <div className="absolute right-0 z-10 lg:relative lg:right-auto lg:z-auto">
                <button
                  type="button"
                  onClick={() => setLoginDrawerOpen(true)}
                  className="inline-flex cursor-pointer items-center gap-x-1.5 rounded-md hover:bg-rose-600 duration-300 transition-all bg-rose-700 px-3 py-2 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                  Sign in
                  <ArrowRightIcon aria-hidden="true" className="-mr-0.5 size-5" />
                </button>
              </div>
            )}
    </>
    

    
  )
}