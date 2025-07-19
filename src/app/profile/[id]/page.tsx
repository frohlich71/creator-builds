import { getProfileByName } from '@/app/service/profile'
import { getServerSession, User } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import Profile from '@/app/ui/components/Profile'
import SetupWrapper from '@/app/ui/screens/Setup/Wrapper'
import { validateProfileOwnership } from '@/app/utils/profileValidation'


export default async function Setup({ params }: { params: Promise<{ id: string }> }) {

  const session = await getServerSession(authOptions)
  const {id} = await params
  
  let profileUser: User
  let isOwner = false
  
  try {
    if (session?.accessToken) {
      profileUser = await getProfileByName(session.accessToken, id)
      isOwner = validateProfileOwnership(session.user, profileUser, id)
    } else {
      profileUser = await getProfileByName('', id)
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
    return (
      <div className="mx-auto max-w-3xl lg:mt-38 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900">Profile not found</h2>
          <p className="mt-2 text-gray-600">The profile you&apos;re looking for doesn&apos;t exist or is not available.</p>
        </div>
      </div>
    )
  }

  return (
          <div className="mx-auto max-w-3xl lg:mt-38 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <h1 className="sr-only">Profile page</h1>
            {/* Main 3 column grid */}
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">


              {/* Left column */}
              <div className="grid grid-cols-1 gap-4">
                <section aria-labelledby="section-2-title">
                  <h2 id="section-2-title" className="sr-only">
                    Profile info section
                  </h2>
                  <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                    <Profile user={profileUser} isOwner={isOwner} />
                  </div>
                </section>
              </div>

              {/* SETUP COLUMN */}
              <SetupWrapper setups={profileUser.setups} isOwner={isOwner} />
            </div>
          </div>
  )
}