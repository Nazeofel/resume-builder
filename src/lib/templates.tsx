import type { ResumeData } from '@/stores/builder'

export interface Template {
	id: string
	name: string
	description: string
	component: React.ComponentType<{ resumeData: ResumeData }>
	previewComponent: React.ReactNode
}

interface TemplateStyleConfig {
	header: {
		container: string
		name: string
		headline: string
		contactRow: string
		linksRow: string
	}
	section: {
		title: string
		container: string
	}
	experience: {
		jobTitle: string
		dateRange: string
		company: string
		description: string
	}
	project: {
		name: string
		description: string
		technologies: string
		link: string
	}
	award: {
		name: string
		details: string
	}
	skills: {
		text: string
		label: string
	}
	education: {
		degree: string
		dateRange: string
		school: string
		gpa: string
	}
}

/** Shared Resume Layout Component */
function BaseResumeLayout({ resumeData, styles }: { resumeData: ResumeData; styles: TemplateStyleConfig }) {
	const { contactInfo, summary, experiences, skills, education, projects, certifications, languages, awards } =
		resumeData

	const hasSummary = summary.trim().length > 0

	return (
		<div className="bg-white p-12">
			{/* Header Section */}
			<header className={styles.header.container}>
				<h1 className={styles.header.name}>{contactInfo.fullName || 'Your Name'}</h1>
				{contactInfo.headline && <p className={styles.header.headline}>{contactInfo.headline}</p>}

				{/* Contact Info Row */}
				<div className={styles.header.contactRow}>
					{contactInfo.phone && <span>{contactInfo.phone}</span>}
					{contactInfo.phone && contactInfo.email && <span>|</span>}
					{contactInfo.email && <span>{contactInfo.email}</span>}
					{contactInfo.email && contactInfo.address && <span>|</span>}
					{contactInfo.address && <span>{contactInfo.address}</span>}
				</div>

				{/* Links Row */}
				{(contactInfo.linkedin || contactInfo.website) && (
					<div className={styles.header.linksRow}>
						{contactInfo.linkedin && (
							<a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
								{contactInfo.linkedin}
							</a>
						)}
						{contactInfo.website && (
							<a href={contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
								{contactInfo.website}
							</a>
						)}
					</div>
				)}
			</header>

			{/* Summary Section */}
			{hasSummary && (
				<section className={styles.section.container}>
					<h2 className={styles.section.title}>Summary</h2>
					<p className="text-sm text-text-main mt-3 leading-relaxed">{summary}</p>
				</section>
			)}

			{/* Experience Section */}
			{experiences.length > 0 && (
				<section className={styles.section.container}>
					<h2 className={styles.section.title}>Experience</h2>
					{experiences.map((exp, index) => {
						const startDate = exp.startDate.trim()
						const endDate = exp.endDate.trim()
						const displayEndDate = endDate || 'Present'

						return (
							<div key={index} className="mt-3">
								<div className="flex justify-between items-center">
									<h3 className={styles.experience.jobTitle}>{exp.jobTitle}</h3>
									{startDate && (
										<span className={styles.experience.dateRange}>
											{startDate} - {displayEndDate}
										</span>
									)}
								</div>
								<p className={styles.experience.company}>
									{exp.company}
									{exp.location && ` | ${exp.location}`}
								</p>
								{exp.description && typeof exp.description === 'string' && (
									<ul className={styles.experience.description}>
										{exp.description
											.split('\n')
											.filter((line) => line.trim())
											.map((line, i) => (
												<li key={i}>{line}</li>
											))}
									</ul>
								)}
							</div>
						)
					})}
				</section>
			)}

			{/* Projects Section */}
			{projects.length > 0 && (
				<section className={styles.section.container}>
					<h2 className={styles.section.title}>Projects</h2>
					{projects.map((project, index) => (
						<div key={index} className="mt-3">
							<h3 className={styles.project.name}>{project.name}</h3>
							{project.description && <p className={styles.project.description}>{project.description}</p>}
							{project.technologies && <p className={styles.project.technologies}>Technologies: {project.technologies}</p>}
							{project.link && (
								<a
									href={project.link.startsWith('http') ? project.link : `https://${project.link}`}
									target="_blank"
									rel="noopener noreferrer"
									className={styles.project.link}
								>
									{project.link}
								</a>
							)}
						</div>
					))}
				</section>
			)}

			{/* Awards Section */}
			{awards.length > 0 && (
				<section className={styles.section.container}>
					<h2 className={styles.section.title}>Awards</h2>
					{awards.map((award, index) => (
						<div key={index} className="mt-3">
							<h3 className={styles.award.name}>{award.name}</h3>
							{(award.issuer || award.date) && (
								<p className={styles.award.details}>
									{award.issuer && award.date ? `${award.issuer} | ${award.date}` : award.issuer || award.date}
								</p>
							)}
						</div>
					))}
				</section>
			)}

			{/* Skills, Certifications & Languages Section */}
			{(skills.length > 0 || certifications.length > 0 || languages.length > 0) && (
				<section className={styles.section.container}>
					<h2 className={styles.section.title}>
						{(() => {
							if (skills.length > 0 && certifications.length > 0) {
								return 'Skills & Certifications'
							}
							if (skills.length > 0) {
								return 'Skills'
							}
							if (certifications.length > 0 && languages.length > 0) {
								return 'Certifications & Languages'
							}
							if (certifications.length > 0) {
								return 'Certifications'
							}
							return 'Languages'
						})()}
					</h2>
					<div className="mt-3">
						{skills.length > 0 && <p className={styles.skills.text}>{skills.map((skill) => skill.name).join(', ')}</p>}
						{certifications.length > 0 && (
							<p className={`${styles.skills.text} mt-2`}>
								<span className={styles.skills.label}>Certifications:</span> {certifications.map((cert) => cert.name).join(', ')}
							</p>
						)}
						{languages.length > 0 && (
							<p className={`${styles.skills.text} mt-2`}>
								<span className={styles.skills.label}>Languages:</span>{' '}
								{languages.map((lang) => `${lang.name} (${lang.proficiency})`).join(', ')}
							</p>
						)}
					</div>
				</section>
			)}

			{/* Education Section */}
			{education.length > 0 && (
				<section className={styles.section.container}>
					<h2 className={styles.section.title}>Education</h2>
					{education.map((edu, index) => (
						<div key={index} className="mt-3">
							<div className="flex justify-between items-center">
								<h3 className={styles.education.degree}>
									{edu.degree}
									{edu.fieldOfStudy ? ` - ${edu.fieldOfStudy}` : ''}
								</h3>
								<span className={styles.education.dateRange}>
									{edu.startDate} - {edu.endDate || 'Present'}
								</span>
							</div>
							<p className={styles.education.school}>{edu.school}</p>
							{edu.gpa && <p className={styles.education.gpa}>GPA: {edu.gpa}</p>}
						</div>
					))}
				</section>
			)}
		</div>
	)
}

/** Modern Template Component */
function ModernTemplate({ resumeData }: { resumeData: ResumeData }) {
	const modernStyles: TemplateStyleConfig = {
		header: {
			container: 'text-center border-b-2 border-border-color pb-4',
			name: 'text-4xl font-bold text-text-main tracking-tight',
			headline: 'text-lg text-primary font-medium mt-1',
			contactRow: 'flex justify-center items-center gap-x-6 gap-y-1 text-sm text-text-subtle mt-3 flex-wrap',
			linksRow: 'flex justify-center items-center gap-x-6 text-sm mt-2 flex-wrap'
		},
		section: {
			title: 'text-xl font-bold text-primary tracking-wide uppercase border-b-2 border-border-color pb-1',
			container: 'mt-6'
		},
		experience: {
			jobTitle: 'text-lg font-bold text-text-main',
			dateRange: 'text-sm font-medium text-text-subtle',
			company: 'text-md font-semibold text-text-subtle',
			description: 'list-disc pl-5 mt-2 text-sm text-text-main space-y-1'
		},
		project: {
			name: 'text-base font-bold text-text-main',
			description: 'text-sm text-text-main mt-1',
			technologies: 'text-sm text-text-subtle mt-1',
			link: 'text-sm text-primary hover:underline'
		},
		award: {
			name: 'text-base font-bold text-text-main',
			details: 'text-sm text-text-subtle mt-1'
		},
		skills: {
			text: 'text-sm text-text-main',
			label: 'font-semibold'
		},
		education: {
			degree: 'text-lg font-bold text-text-main',
			dateRange: 'text-sm font-medium text-text-subtle',
			school: 'text-md font-semibold text-text-subtle',
			gpa: 'text-sm text-text-subtle mt-1'
		}
	}

	return <BaseResumeLayout resumeData={resumeData} styles={modernStyles} />
}

/** Classic Template Component */
function ClassicTemplate({ resumeData }: { resumeData: ResumeData }) {
	const classicStyles: TemplateStyleConfig = {
		header: {
			container: 'text-left border-b-2 border-border-color pb-4',
			name: 'text-4xl font-bold text-text-main tracking-tight',
			headline: 'text-lg text-primary font-medium mt-1',
			contactRow: 'flex justify-start items-center gap-x-6 gap-y-1 text-sm text-text-subtle mt-3 flex-wrap',
			linksRow: 'flex justify-start items-center gap-x-6 text-sm mt-2 flex-wrap'
		},
		section: {
			title: 'text-xl font-bold text-text-main tracking-wide uppercase border-b border-border-color pb-1',
			container: 'mt-6'
		},
		experience: {
			jobTitle: 'text-lg font-bold text-text-main',
			dateRange: 'text-sm font-medium text-text-subtle',
			company: 'text-md font-semibold text-text-subtle',
			description: 'list-disc pl-5 mt-2 text-sm text-text-main space-y-1'
		},
		project: {
			name: 'text-base font-bold text-text-main',
			description: 'text-sm text-text-main mt-1',
			technologies: 'text-sm text-text-subtle mt-1',
			link: 'text-sm text-primary hover:underline'
		},
		award: {
			name: 'text-base font-bold text-text-main',
			details: 'text-sm text-text-subtle mt-1'
		},
		skills: {
			text: 'text-sm text-text-main',
			label: 'font-semibold'
		},
		education: {
			degree: 'text-lg font-bold text-text-main',
			dateRange: 'text-sm font-medium text-text-subtle',
			school: 'text-md font-semibold text-text-subtle',
			gpa: 'text-sm text-text-subtle mt-1'
		}
	}

	return <BaseResumeLayout resumeData={resumeData} styles={classicStyles} />
}

/** Minimalist Template Component */
function MinimalistTemplate({ resumeData }: { resumeData: ResumeData }) {
	const minimalistStyles: TemplateStyleConfig = {
		header: {
			container: 'text-center border-b border-border-color/50 pb-4',
			name: 'text-3xl font-bold text-text-main tracking-tight',
			headline: 'text-lg text-primary font-medium mt-1',
			contactRow: 'flex justify-center items-center gap-x-6 gap-y-1 text-sm text-text-subtle mt-3 flex-wrap',
			linksRow: 'flex justify-center items-center gap-x-6 text-sm mt-2 flex-wrap'
		},
		section: {
			title: 'text-lg font-bold text-text-main uppercase pb-1',
			container: 'mt-6'
		},
		experience: {
			jobTitle: 'text-lg font-bold text-text-main',
			dateRange: 'text-sm font-medium text-text-subtle',
			company: 'text-md font-semibold text-text-subtle',
			description: 'list-disc pl-5 mt-2 text-sm text-text-main space-y-1'
		},
		project: {
			name: 'text-base font-bold text-text-main',
			description: 'text-sm text-text-main mt-1',
			technologies: 'text-sm text-text-subtle mt-1',
			link: 'text-sm text-primary hover:underline'
		},
		award: {
			name: 'text-base font-bold text-text-main',
			details: 'text-sm text-text-subtle mt-1'
		},
		skills: {
			text: 'text-sm text-text-main',
			label: 'font-semibold'
		},
		education: {
			degree: 'text-lg font-bold text-text-main',
			dateRange: 'text-sm font-medium text-text-subtle',
			school: 'text-md font-semibold text-text-subtle',
			gpa: 'text-sm text-text-subtle mt-1'
		}
	}

	return <BaseResumeLayout resumeData={resumeData} styles={minimalistStyles} />
}

/** Creative Template Component */
function CreativeTemplate({ resumeData }: { resumeData: ResumeData }) {
	const creativeStyles: TemplateStyleConfig = {
		header: {
			container: 'text-center border-b-2 border-primary pb-4',
			name: 'text-4xl font-bold text-primary tracking-tight',
			headline: 'text-lg text-primary font-medium mt-1',
			contactRow: 'flex justify-center items-center gap-x-6 gap-y-1 text-sm text-text-subtle mt-3 flex-wrap',
			linksRow: 'flex justify-center items-center gap-x-6 text-sm mt-2 flex-wrap'
		},
		section: {
			title: 'text-xl font-bold text-primary tracking-wide uppercase border-b-2 border-primary pb-1',
			container: 'mt-6'
		},
		experience: {
			jobTitle: 'text-lg font-bold text-text-main',
			dateRange: 'text-sm font-medium text-text-subtle',
			company: 'text-md font-semibold text-text-subtle',
			description: 'list-disc pl-5 mt-2 text-sm text-text-main space-y-1'
		},
		project: {
			name: 'text-base font-bold text-text-main',
			description: 'text-sm text-text-main mt-1',
			technologies: 'text-sm text-text-subtle mt-1',
			link: 'text-sm text-primary hover:underline'
		},
		award: {
			name: 'text-base font-bold text-text-main',
			details: 'text-sm text-text-subtle mt-1'
		},
		skills: {
			text: 'text-sm text-text-main',
			label: 'font-semibold'
		},
		education: {
			degree: 'text-lg font-bold text-text-main',
			dateRange: 'text-sm font-medium text-text-subtle',
			school: 'text-md font-semibold text-text-subtle',
			gpa: 'text-sm text-text-subtle mt-1'
		}
	}

	return <BaseResumeLayout resumeData={resumeData} styles={creativeStyles} />
}

/** Preview Components */
const ModernPreview = (
	<div className="aspect-[8.5/11] bg-white rounded border p-4 flex flex-col gap-2">
		<div className="w-2/3 h-3 bg-primary rounded mx-auto" />
		<div className="w-1/2 h-2 bg-text-subtle/30 rounded mx-auto" />
		<div className="mt-2 space-y-1">
			<div className="w-full h-1.5 bg-text-subtle/20 rounded" />
			<div className="w-full h-1.5 bg-text-subtle/20 rounded" />
			<div className="w-3/4 h-1.5 bg-text-subtle/20 rounded" />
		</div>
		<div className="mt-2 space-y-1">
			<div className="w-full h-1.5 bg-text-subtle/20 rounded" />
			<div className="w-full h-1.5 bg-text-subtle/20 rounded" />
		</div>
	</div>
)

const ClassicPreview = (
	<div className="aspect-[8.5/11] bg-white rounded border p-4 flex flex-col gap-2">
		<div className="w-1/2 h-3 bg-text-main rounded" />
		<div className="w-1/3 h-2 bg-text-subtle/30 rounded" />
		<div className="mt-2 space-y-1">
			<div className="w-full h-1.5 bg-text-subtle/20 rounded" />
			<div className="w-full h-1.5 bg-text-subtle/20 rounded" />
			<div className="w-4/5 h-1.5 bg-text-subtle/20 rounded" />
		</div>
		<div className="mt-2 space-y-1">
			<div className="w-full h-1.5 bg-text-subtle/20 rounded" />
			<div className="w-full h-1.5 bg-text-subtle/20 rounded" />
		</div>
	</div>
)

const MinimalistPreview = (
	<div className="aspect-[8.5/11] bg-white rounded border p-4 flex flex-col gap-2">
		<div className="w-1/3 h-2.5 bg-text-main rounded" />
		<div className="border-t border-text-subtle/20 my-1" />
		<div className="space-y-1.5">
			<div className="w-full h-1 bg-text-subtle/20 rounded" />
			<div className="w-full h-1 bg-text-subtle/20 rounded" />
			<div className="w-2/3 h-1 bg-text-subtle/20 rounded" />
		</div>
		<div className="border-t border-text-subtle/20 my-1" />
		<div className="space-y-1.5">
			<div className="w-full h-1 bg-text-subtle/20 rounded" />
			<div className="w-3/4 h-1 bg-text-subtle/20 rounded" />
		</div>
	</div>
)

const CreativePreview = (
	<div className="aspect-[8.5/11] bg-white rounded border p-4 flex gap-2">
		<div className="w-1/3 bg-primary/20 rounded p-2 space-y-1">
			<div className="w-full h-2 bg-primary rounded" />
			<div className="w-2/3 h-1.5 bg-primary/60 rounded" />
			<div className="mt-2 space-y-1">
				<div className="w-full h-1 bg-primary/40 rounded" />
				<div className="w-full h-1 bg-primary/40 rounded" />
			</div>
		</div>
		<div className="flex-1 space-y-1.5">
			<div className="w-2/3 h-2 bg-text-main rounded" />
			<div className="w-full h-1 bg-text-subtle/20 rounded" />
			<div className="w-full h-1 bg-text-subtle/20 rounded" />
			<div className="w-4/5 h-1 bg-text-subtle/20 rounded" />
		</div>
	</div>
)

/** Templates Array */
export const TEMPLATES: Template[] = [
	{
		id: 'modern',
		name: 'Modern',
		description: 'Clean and contemporary design with bold typography and primary color accents',
		component: ModernTemplate,
		previewComponent: ModernPreview
	},
	{
		id: 'classic',
		name: 'Classic',
		description: 'Traditional resume format with left-aligned header and conservative styling',
		component: ClassicTemplate,
		previewComponent: ClassicPreview
	},
	{
		id: 'minimalist',
		name: 'Minimalist',
		description: 'Clean and simple design with thin dividers and restrained typography',
		component: MinimalistTemplate,
		previewComponent: MinimalistPreview
	},
	{
		id: 'creative',
		name: 'Creative',
		description: 'Two-column layout with primary-colored sidebar and bold visual hierarchy',
		component: CreativeTemplate,
		previewComponent: CreativePreview
	}
]
