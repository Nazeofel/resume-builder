'use client'

import Link from 'next/link'
import { useApp } from '@/contexts/AppContext'
import { ComponentProps } from 'react'

type TransitionLinkProps = ComponentProps<typeof Link>

export default function TransitionLink({ href, children, onClick, ...props }: TransitionLinkProps) {
	const { startTransition } = useApp()

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault()
		startTransition()

		// Call original onClick if provided
		onClick?.(e)

		// Navigate after animation starts
		setTimeout(() => {
			window.location.href = href.toString()
		}, 500)
	}

	return (
		<Link href={href} onClick={handleClick} {...props}>
			{children}
		</Link>
	)
}
