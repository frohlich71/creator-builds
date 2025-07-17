import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import UpdatePasswordForm from '@/app/update-password/UpdatePasswordForm'

export default async function UpdatePasswordPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.name || !session?.accessToken) {
    redirect('/')
  }

  return (
    <div className="mx-auto overflow-auto max-w-7xl mt-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <UpdatePasswordForm accessToken={session.accessToken} />
      </div>
    </div>
  )
}
