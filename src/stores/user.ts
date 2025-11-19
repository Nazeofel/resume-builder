import { atom } from 'jotai'
import { SubscriptionStatus } from '@prisma/client'

export type User = {
	id: string
	name: string | null
	email: string | null
	subscriptionStatus: SubscriptionStatus
	usageCount: number
	usageLimit: number
	billingPeriodStart: Date | null
	billingPeriodEnd: Date | null
}

export const userAtom = atom<User | undefined>(undefined)
