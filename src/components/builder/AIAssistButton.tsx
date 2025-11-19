import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * AI Assist Button Component (Presentational)
 *
 * This is a presentational component that renders an AI assist button.
 * AI feature gating should be handled by the parent component or API route.
 *
 * Parent components should check subscription status and usage limits before
 * enabling this button (using the `disabled` prop). Reference the
 * `src/lib/subscription.ts` utility for checking permissions.
 *
 * @example
 * ```tsx
 * const user = await getUser()
 * const canUseAI = canUseAIFeatures(user)
 * <AIAssistButton disabled={!canUseAI} onClick={handleAIAssist} />
 * ```
 */
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
