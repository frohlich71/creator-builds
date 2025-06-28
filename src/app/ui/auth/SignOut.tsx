"use client"

import { signOut } from "next-auth/react"

export default function SignOut () {
  return (
    <div>
      <button className="bg-blue-500 rounded-md p-2" onClick={() => signOut()}>SignOut</button>
    </div>
  )
}