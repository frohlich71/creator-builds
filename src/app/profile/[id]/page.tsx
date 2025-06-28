import { getProfileByName } from '@/app/service/profile'
import { getServerSession, User } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Profile from '@/app/ui/components/Profile'
import { redirect } from 'next/navigation'
import SetupWrapper from '@/app/ui/screens/Setup/Wrapper'
import { validateProfileOwnership } from '@/app/utils/profileValidation'


export default async function Setup({ params }: { params: { id: string }}) {

  const session = await getServerSession(authOptions)

  if (!session || !session.accessToken) {
    redirect('/auth')
  }

  const {id} = await params
  const profileUser: User = await getProfileByName(session?.accessToken ?? '', id)
  
  const isOwner = validateProfileOwnership(session.user, profileUser, id)

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