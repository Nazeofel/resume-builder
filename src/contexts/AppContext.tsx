'use client'

import { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react'
import { animate } from 'motion'
import { motion, AnimatePresence } from 'motion/react'
import { usePathname } from 'next/navigation'

interface AppContextType {
	startTransition: () => void
	isTransitioning: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
	const [isTransitioning, setIsTransitioning] = useState(false)
	const transitionRef = useRef<HTMLDivElement>(null)
	const pathname = usePathname()

	// Animate out when pathname changes
	useEffect(() => {
		if (isTransitioning && transitionRef.current) {
			// Change origin to top-left and shrink
			transitionRef.current.style.transformOrigin = 'top left'

			animate(transitionRef.current, { scale: 0 }, { duration: 1, easing: 'easeOut' }).then(() => {
				setIsTransitioning(false)
			})
		}
	}, [pathname, isTransitioning])

	const startTransition = () => {
		setIsTransitioning(true)
	}

	return (
		<AppContext.Provider value={{ startTransition, isTransitioning }}>
			<AnimatePresence>
				{isTransitioning && (
					<motion.div
						ref={transitionRef}
						initial={{ scale: 0 }}
						animate={{ scale: 3 }}
						transition={{ duration: 1.5, ease: 'easeIn' }}
						style={{
							position: 'absolute',
							bottom: 0,
							right: 0,
							width: '100vw',
							height: '100vh',
							backgroundColor: '#d4a373',
							transformOrigin: 'bottom right',
							zIndex: 9999,
							pointerEvents: 'none'
						}}
					/>
				)}
			</AnimatePresence>
			{children}
		</AppContext.Provider>
	)
}

export function useApp() {
	const context = useContext(AppContext)
	if (context === undefined) {
		throw new Error('useApp must be used within an AppProvider')
	}
	return context
}
