export interface SearchUser {
  id: string
  name: string
  nickname?: string
  image?: string
  profileImage?: string
}

export interface SearchResult {
  users: SearchUser[]
  total: number
}
