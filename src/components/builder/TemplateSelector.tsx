'use client'

import { TEMPLATES } from '@/lib/templates'

interface TemplateSelectorProps {
	selectedTemplate: string
	onSelect: (template: string) => void
}

export function TemplateSelector({ selectedTemplate, onSelect }: TemplateSelectorProps) {
	if (TEMPLATES.length === 0) {
		return <div className="text-center p-8 text-text-subtle">No templates available</div>
	}

	return (
		<div className="grid grid-cols-2 gap-4">
			{TEMPLATES.map((template) => {
				const isSelected = selectedTemplate === template.id

				return (
					<button
						key={template.id}
						onClick={() => onSelect(template.id)}
						className={`
              border-2 rounded-lg p-4 transition-all
              hover:border-primary hover:scale-105
              ${isSelected ? 'border-primary bg-highlight/30' : 'border-border-color/40'}
            `}
					>
						{template.previewComponent}
						<div
							className={`mt-3 flex flex-col items-center gap-2 font-medium ${
								isSelected ? 'text-primary' : 'text-text-subtle'
							}`}
						>
							<div className="flex items-center gap-2">
								{isSelected && <span className="material-symbols-outlined text-base">check_circle</span>}
								{template.name}
							</div>
						</div>
						<p className="text-xs text-text-subtle mt-2">{template.description}</p>
					</button>
				)
			})}
		</div>
	)
}
