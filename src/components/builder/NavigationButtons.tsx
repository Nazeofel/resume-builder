'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface NavigationButtonsProps {
	onPrevious?: () => void;
	onNext?: () => void;
	showPrevious?: boolean;
	showNext?: boolean;
	previousLabel?: string;
	nextLabel?: string;
	previousDisabled?: boolean;
	nextDisabled?: boolean;
	className?: string;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
	onPrevious,
	onNext,
	showPrevious = true,
	showNext = true,
	previousLabel = 'Previous Step',
	nextLabel = 'Next Step',
	previousDisabled = false,
	nextDisabled = false,
	className,
}) => {
	return (
		<div
			className={cn(
				'flex items-center justify-between border-t border-border-color/30 pt-6',
				className
			)}
		>
			{showPrevious ? (
				<Button
					type="button"
					onClick={onPrevious}
					disabled={previousDisabled}
					className={cn(
						'h-12 rounded-lg bg-border-color/60 px-6 text-base font-bold tracking-[0.015em] text-text-main',
						'transition-colors hover:bg-border-color/80',
						'disabled:cursor-not-allowed disabled:opacity-50'
					)}
				>
					{previousLabel}
				</Button>
			) : (
				<div />
			)}
			{showNext && (
				<Button
					type="button"
					onClick={onNext}
					disabled={nextDisabled}
					className={cn(
						'h-12 rounded-lg bg-primary px-6 text-base font-bold tracking-[0.015em] text-white',
						'transition-colors hover:bg-primary/90',
						'disabled:cursor-not-allowed disabled:opacity-50'
					)}
				>
					{nextLabel}
				</Button>
			)}
		</div>
	);
};

NavigationButtons.displayName = 'NavigationButtons';
