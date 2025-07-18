'use client'

import normalizeUrl from "@/app/utils/normalizeUrl";
import { CheckBadgeIcon } from "@heroicons/react/20/solid";
import { ArrowTopRightOnSquareIcon, PencilIcon, ShieldCheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
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
        {user.isVerified && (
          <span className="absolute right-0 bottom-2 group-hover:opacity-0 transition-opacity duration-300"> 
            <CheckBadgeIcon className="size-5 text-blue-500" />
          </span>
        )}
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
      
      {/* Email verification badge */}
      <div className="mt-2">
        {user.isEmailVerified ? (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            <ShieldCheckIcon className="size-3 mr-1" />
            Email Verified
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
            <ExclamationTriangleIcon className="size-3 mr-1" />
            Email Not Verified
          </span>
        )}
      </div>
      
      {isOwner && (
        <div className="mt-2">
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            Your Profile
          </span>
        </div>
      )}
      {user.website && (
        <Link href={normalizeUrl(user.website)} className="group inline-flex items-center gap-x-2 text-sm text-blue-500 transition-all duration-300 hover:text-blue-900 hover:underline">
          <i className="group-hover:text-blue-900">{user.website}</i>
          <ArrowTopRightOnSquareIcon className="size-4 group-hover:text-blue-900 group-hover:underline" />
        </Link>
      )}

      {(user.x || user.instagram || user.youtube || user.tiktok || user.snapchat || user.facebook || user.linkedin || user.pinterest || user.twitch) && (
        <div className="mt-6 w-full max-w-xs text-left">
          <p className="text-md font-bold text-black mb-1">Social Media</p>
          <ul className="space-y-1">
            {user.x && (
              <li>
              <SocialIcon style={{height: 20, width: 20}}  url={normalizeUrl(user.x)} target="_blank"  />
              <a href={normalizeUrl(user.x)} target="_blank" className="text-blue-500 ml-2 hover:text-blue-900 hover:underline text-sm transition-all duration-300">
                X
              </a>
            </li>
            )}
            {user.instagram && (
              <li>
                <SocialIcon style={{height: 20, width: 20}}  url={normalizeUrl(user.instagram)} target="_blank"  />
                <a href={normalizeUrl(user.instagram)} target="_blank" className="text-blue-500 ml-2 hover:text-blue-900 hover:underline text-sm transition-all duration-300">
                  Instagram
                </a>
              </li>
            )}
            
            {user.youtube && (
              <li>
                <SocialIcon style={{height: 20, width: 20}}  url={normalizeUrl(user.youtube)} target="_blank"  />
                <a href={normalizeUrl(user.youtube)} target="_blank" className="text-blue-500 ml-2 hover:text-blue-900 hover:underline text-sm transition-all duration-300">
                  Youtube
                </a>
              </li>
            )}

            {user.tiktok && (
              <li>
                <SocialIcon style={{height: 20, width: 20}}  url={normalizeUrl(user.tiktok)} target="_blank"  />
                <a href={normalizeUrl(user.tiktok)} target="_blank" className="text-blue-500 ml-2 hover:text-blue-900 hover:underline text-sm transition-all duration-300">
                  TikTok
                </a>
              </li>
            )}

            {user.snapchat && (
              <li>
                <SocialIcon style={{height: 20, width: 20}}  url={normalizeUrl(user.snapchat)} target="_blank"  />
                <a href={normalizeUrl(user.snapchat)} target="_blank" className="text-blue-500 ml-2 hover:text-blue-900 hover:underline text-sm transition-all duration-300">
                  Snapchat
                </a>
              </li>
            )}

            {user.facebook && (
              <li>
                <SocialIcon style={{height: 20, width: 20}}  url={normalizeUrl(user.facebook)} target="_blank"  />
                <a href={normalizeUrl(user.facebook)} target="_blank" className="text-blue-500 ml-2 hover:text-blue-900 hover:underline text-sm transition-all duration-300">
                  Facebook
                </a>
              </li>
            )}

            {user.linkedin && (
              <li>
                <SocialIcon style={{height: 20, width: 20}}  url={normalizeUrl(user.linkedin)} target="_blank"  />
                <a href={normalizeUrl(user.linkedin)} target="_blank" className="text-blue-500 ml-2 hover:text-blue-900 hover:underline text-sm transition-all duration-300">
                  LinkedIn
                </a>
              </li>
            )}

            {user.pinterest && (
              <li>
                <SocialIcon style={{height: 20, width: 20}}  url={normalizeUrl(user.pinterest)} target="_blank"  />
                <a href={normalizeUrl(user.pinterest)} target="_blank" className="text-blue-500 ml-2 hover:text-blue-900 hover:underline text-sm transition-all duration-300">
                  Pinterest
                </a>
              </li>
            )}

            {user.twitch && (
              <li>
                <SocialIcon style={{height: 20, width: 20}}  url={normalizeUrl(user.twitch)} target="_blank"  />
                <a href={normalizeUrl(user.twitch)} target="_blank" className="text-blue-500 ml-2 hover:text-blue-900 hover:underline text-sm transition-all duration-300">
                  Twitch
                </a>
              </li>
            )}
          </ul>
        </div>
      )}

      
    </div>
  )
}