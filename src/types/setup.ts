import { User } from "next-auth"

export type Setup = {
  _id: string
  name: string
  owner: User
  equipments: Equipment[]
}

export type Equipment = {
  _id: string
  name: string
  brand: string
  model: string
  icon: string
  link: string
}
