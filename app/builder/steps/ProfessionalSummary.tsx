import { useAtom } from 'jotai'
import { resumeDataAtom, setResumeDataAtom } from '@/stores/builder'
import { BuilderTextarea, NavigationButtons, StepProgress } from '@/components/builder'

interface ProfessionalSummaryProps {
    onNext: () => void
    onPrevious: () => void
}

export function ProfessionalSummary({ onNext, onPrevious }: ProfessionalSummaryProps) {
    const [resumeData] = useAtom(resumeDataAtom)
    const [, setResumeDataPartial] = useAtom(setResumeDataAtom)

    const handleSummaryChange = (value: string) => {
        setResumeDataPartial({ summary: value })
    }

    return (
        <>
            <StepProgress currentStep={4} totalSteps={7} stepLabel="Professional Summary" />
            <div className="flex flex-col gap-8 bg-secondary-bg/50 p-6 md:p-8 rounded-xl border border-border-color/30">
                <div className="flex flex-col gap-3">
                    <h1 className="text-4xl font-black leading-tight tracking-[-0.033em]">Professional Summary</h1>
                    <p className="text-text-subtle text-base font-normal leading-normal">
                        Write a compelling 2-3 paragraph summary highlighting your career highlights and strengths.
                    </p>
                </div>

                <div>
                    <BuilderTextarea
                        id="summary"
                        label="Summary"
                        value={resumeData.summary}
                        onChange={(e) => handleSummaryChange(e.target.value)}
                        placeholder="Start with your most recent role and key achievements..."
                        rows={8}
                        showAIButton={true}
                        onAIClick={() => { }}
                    />
                </div>

                {/* Navigation Buttons */}
                <NavigationButtons
                    onPrevious={onPrevious}
                    onNext={onNext}
                    previousDisabled={false}
                    showPrevious={true}
                    showNext={true}
                />
            </div>
        </>
    )
}
