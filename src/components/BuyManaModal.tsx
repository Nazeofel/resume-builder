'use client'

// , because right now, even at the end, it says that no templates are available, which is false we have a lot of templates

// Hey so when creating a Resume, it brings us to the page with the normal template, I think it would be nice if we had a pre-step where we could choose our template before entering any informations, it would need to add another step to the resume creation process and update the references everywhere, but it would be worth doing it
import { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Check } from 'lucide-react'

interface BuyManaModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	userId: string
}

export function BuyManaModal({ open, onOpenChange, userId }: BuyManaModalProps) {
	const [isLoading, setIsLoading] = useState(false)
	const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null)

	const handlePurchase = async (pkg: any) => {
		// Guard against empty userId
		if (!userId) {
			console.warn('Cannot proceed with checkout: userId is empty')
			return
		}

		try {
			setIsLoading(true)
			setSelectedPackageId(pkg.id)

			const response = await fetch('/api/checkout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					priceId: pkg.priceId,
					userId,
					quantity: 1
				})
			})

			if (!response.ok) {
				throw new Error('Failed to create checkout session')
			}

			const data = await response.json()
			window.location.href = data.url
		} catch (error) {
			console.error('Purchase error:', error)
			// Future: Add toast notification
		} finally {
			setIsLoading(false)
			setSelectedPackageId(null)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Buy Mana</DialogTitle>
					<DialogDescription>
						Purchase mana to unlock AI-powered resume features. Choose a package below.
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-6 md:grid-cols-3">
					{/* {MANA_PACKAGES.map((pkg) => (
						<Card key={pkg.id} className={pkg.popular ? 'border-primary border-2 relative' : undefined}>
							{pkg.popular && (
								<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
									Most Popular
								</div>
							)}
							<CardHeader>
								<Zap className="h-8 w-8 text-primary mx-auto" />
								<CardTitle className="text-center">{pkg.mana} Mana</CardTitle>
								<CardDescription className="text-center text-lg font-semibold">${pkg.price.toFixed(2)}</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm text-muted-foreground mb-4">
									<li className="flex items-center gap-2">
										<Check className="h-4 w-4 text-primary" />
										AI resume suggestions
									</li>
									<li className="flex items-center gap-2">
										<Check className="h-4 w-4 text-primary" />
										Job description tailoring
									</li>
								</ul>
								<Button
									id={`buy-mana-${pkg.mana}`}
									className="w-full"
									data-price-id={pkg.priceId}
									onClick={() => handlePurchase(pkg)}
									disabled={!userId || isLoading}
								>
									{isLoading && selectedPackageId === pkg.id ? 'Processing...' : 'Buy Now'}
								</Button>
							</CardContent>
						</Card>
					))} */}
				</div>

				<DialogFooter className="sm:justify-center">
					<p className="text-xs text-muted-foreground text-center">
						Secure payment powered by Stripe. Mana is added instantly after purchase.
					</p>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
