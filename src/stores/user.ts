import { atom } from 'jotai'
import { SubscriptionStatus } from '@prisma/client'
import { User } from '@prisma-generated/client'

export const userAtom = atom<User | undefined>(undefined)
