'use client'

import normalizeUrl from "@/app/utils/normalizeUrl";
import { CheckIcon } from "@heroicons/react/20/solid";
import { ArrowTopRightOnSquareIcon, PencilIcon } from "@heroicons/react/24/outline";
import { User } from "next-auth";
import Link from "next/link";
import { SocialIcon } from "react-social-icons";
import Image from "next/image";

export default function Profile ({user, isOwner = false}: {user: User, isOwner?: boolean}) {

  return (
    <div className="flex flex-col items-center p-6">
      <span className="relative inline-block group">
        <Image
          alt="Profile picture"
          src={user.profileImage && user.profileImage.trim() !== '' ? user.profileImage : '/fallback.png'}
          width={104}
          height={104}
          className="size-26 rounded-full"
        />
        <span className="absolute right-0 bottom-2 block size-4 rounded-full bg-blue-400 ring-2 ring-white group-hover:opacity-0 transition-opacity duration-300"> 
          <CheckIcon className="size-3 ml-0.5 mt-0.5 text-white" />
        </span>
        {isOwner && (
          <Link 
            href="/edit-profile"
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <PencilIcon className="size-6 text-white" />
          </Link>
        )}
      </span>
      <p className="mt-4 text-lg font-semibold">{user.nickname}</p>
      <p className="text-sm text-gray-500">@{user.name}</p>
      {isOwner && (
        <div className="mt-2">
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            Your Profile
          </span>
        </div>
      )}
      {user.website && (
        <Link href={normalizeUrl(user.website)} className="group inline-flex items-center gap-x-2 text-sm text-red-900 transition-all duration-300 hover:text-red-600 hover:underline">
          <i className="group-hover:text-red-600">{user.website}</i>
          <ArrowTopRightOnSquareIcon className="size-4 group-hover:text-red-600 group-hover:underline" />
        </Link>
      )}

      {(user.x || user.instagram || user.youtube) && (
        <div className="mt-6 w-full max-w-xs text-left">
          <p className="text-md font-bold text-black mb-1">Redes sociais</p>
          <ul className="space-y-1">
            {user.x && (
              <li>
              <SocialIcon style={{height: 20, width: 20}}  url={normalizeUrl(user.x)} target="_blank"  />
              <a href={normalizeUrl(user.x)} target="_blank" className="text-red-500 hover:text-red-900 hover:underline text-sm transition-all duration-300">
                X
              </a>
            </li>
            )}
            {user.instagram && (
              <li>
                <SocialIcon style={{height: 20, width: 20}}  url={normalizeUrl(user.instagram)} target="_blank"  />
                <a href={normalizeUrl(user.instagram)} target="_blank" className="text-red-500 ml-2 hover:text-red-900 hover:underline text-sm transition-all duration-300">
                  Instagram
                </a>
              </li>
            )}
            
            {user.youtube && (
              <li>
                <SocialIcon style={{height: 20, width: 20}}  url={normalizeUrl(user.youtube)} target="_blank"  />
                <a href={normalizeUrl(user.youtube)} target="_blank" className="text-red-500 hover:text-red-900 hover:underline text-sm transition-all duration-300">
                  Youtube
                </a>
              </li>
            )}
          </ul>
        </div>
      )}

      
    </div>
  )
}