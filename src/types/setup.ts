import { User } from "next-auth"
import { Product } from "./product"

export type Setup = {
  _id: string
  name: string
  owner: User
  equipments: Equipment[]
}

export type Equipment = {
  _id: string
  name: string
  product: Product
}
