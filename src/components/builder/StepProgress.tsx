'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export interface StepProgressProps {
	currentStep: number;
	totalSteps?: number;
	stepLabel: string;
	className?: string;
}

export const StepProgress: React.FC<StepProgressProps> = ({
	currentStep,
	totalSteps = 6,
	stepLabel,
	className,
}) => {
	// Clamp the current step between 0 and totalSteps to prevent out-of-range progress
	const normalizedStep = Math.max(0, Math.min(currentStep, totalSteps));
	const progressPercentage = (normalizedStep / totalSteps) * 100;

	return (
		<div className={cn('flex flex-col gap-3', className)}>
			<p className="text-base font-medium text-text-main">
				Step {currentStep} of {totalSteps}: {stepLabel}
			</p>
			<Progress
				value={progressPercentage}
				className="h-2 rounded-full bg-border-color/30"
				indicatorClassName="bg-primary"
			/>
		</div>
	);
};

StepProgress.displayName = 'StepProgress';
