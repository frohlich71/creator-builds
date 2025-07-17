import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import EditProfileFormComponent from './EditProfileFormComponent'
import { getProfileByName } from '@/app/service/profile'

export default async function EditProfile() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.name || !session?.accessToken) {
    redirect('/')
  }

  // Get user profile data server-side
  const userProfile = await getProfileByName(session.accessToken, session.user.name)
  
  if (!userProfile) {
    return (
      <div className="mx-auto overflow-auto max-w-7xl mt-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-red-600">Failed to load profile data.</p>
          <div className="text-center mt-4">
            <Link href="/" className="text-rose-600 hover:text-rose-500">
              Go back to home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto overflow-auto max-w-7xl mt-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <EditProfileFormComponent 
          user={userProfile} 
          accessToken={session.accessToken} 
        />
      </div>
    </div>
  )
}