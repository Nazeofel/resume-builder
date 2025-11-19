'use client'

import { Provider } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { userAtom, type User } from '@/stores/user'

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
