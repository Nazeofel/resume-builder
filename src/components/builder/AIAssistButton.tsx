import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AIAssistButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	ariaLabel?: string;
}

export const AIAssistButton = React.forwardRef<
	HTMLButtonElement,
	AIAssistButtonProps
>(({ className, onClick, disabled, ariaLabel, ...props }, ref) => {
	return (
		<button
			ref={ref}
			type="button"
			onClick={onClick}
			disabled={disabled}
			aria-label={ariaLabel || 'AI Assist'}
			className={cn(
				'size-10 rounded-md bg-highlight text-text-subtle transition-colors',
				'hover:bg-primary hover:text-white',
				'flex items-center justify-center',
				'disabled:opacity-50 disabled:cursor-not-allowed',
				className
			)}
			{...props}
		>
			<span className="material-symbols-outlined !text-xl">auto_awesome</span>
		</button>
	);
});

AIAssistButton.displayName = 'AIAssistButton';
