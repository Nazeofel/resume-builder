'use client'

import { Provider } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { userAtom } from '@/stores/user'
import { User } from '@prisma-generated/client';

function HydrateAtoms({ initialUser, children }: { initialUser?: User; children: React.ReactNode }) {
	useHydrateAtoms([[userAtom, initialUser]])
	return children
}

export function JotaiProvider({ initialUser, children }: { initialUser?: User; children: React.ReactNode }) {
	return (
		<Provider>
			<HydrateAtoms initialUser={initialUser}>{children}</HydrateAtoms>
		</Provider>
	)
}
