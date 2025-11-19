'use client'

import { useState } from 'react'
import { useAtom } from 'jotai'
import {
	resumeDataAtom,
	setResumeDataAtom,
	currentStepAtom,
	setCurrentStepAtom,
	Experience,
	Education,
	Skill,
	Project,
	Certification,
	Language,
	validateStep
} from '@/stores/builder'
import { BuilderFormField, BuilderTextarea, BuilderSelect, ExperienceCard, EducationCard, SkillTag, ProjectCard, CertificationTag, LanguageTag, TemplateSelector, ExportButtons, StepProgress, NavigationButtons, ResumePreview } from '@/components/builder'
import Link from 'next/link'

export default function BuilderPage() {
	const [resumeData] = useAtom(resumeDataAtom)
	const [, setResumeDataPartial] = useAtom(setResumeDataAtom)
	const [currentStep] = useAtom(currentStepAtom)
	const [, setCurrentStep] = useAtom(setCurrentStepAtom)
	const [skillInput, setSkillInput] = useState('')
	const [certificationInput, setCertificationInput] = useState('')
	const [languageInput, setLanguageInput] = useState('')
	const [languageProficiency, setLanguageProficiency] = useState('Native')
	const [validationErrors, setValidationErrors] = useState<string[]>([])

	const handleContactChange = (field: keyof typeof resumeData.contactInfo, value: string) => {
		setResumeDataPartial({
			contactInfo: {
				...resumeData.contactInfo,
				[field]: value
			}
		})
	}

	// Experience handlers
	const handleAddExperience = () => {
		const newExperience: Experience = {
			id: crypto.randomUUID(),
			jobTitle: '',
			company: '',
			location: '',
			startDate: '',
			endDate: '',
			description: ''
		}
		setResumeDataPartial({
			experiences: [...resumeData.experiences, newExperience]
		})
	}

	const handleRemoveExperience = (id: string) => {
		setResumeDataPartial({
			experiences: resumeData.experiences.filter((exp) => exp.id !== id)
		})
	}

	const handleUpdateExperience = (id: string, field: keyof Experience, value: string) => {
		setResumeDataPartial({
			experiences: resumeData.experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
		})
	}

	// Skills handlers
	const handleAddSkill = () => {
		if (!skillInput.trim()) return

		const newSkill: Skill = {
			id: crypto.randomUUID(),
			name: skillInput.trim()
		}
		setResumeDataPartial({
			skills: [...resumeData.skills, newSkill]
		})
		setSkillInput('')
	}

	const handleRemoveSkill = (id: string) => {
		setResumeDataPartial({
			skills: resumeData.skills.filter((skill) => skill.id !== id)
		})
	}

	// Summary handler
	const handleSummaryChange = (value: string) => {
		setResumeDataPartial({ summary: value })
	}

	// Education handlers
	const handleAddEducation = () => {
		const newEducation: Education = {
			id: crypto.randomUUID(),
			degree: '',
			fieldOfStudy: '',
			school: '',
			startDate: '',
			endDate: '',
			gpa: ''
		}
		setResumeDataPartial({
			education: [...resumeData.education, newEducation]
		})
	}

	const handleRemoveEducation = (id: string) => {
		setResumeDataPartial({
			education: resumeData.education.filter((edu) => edu.id !== id)
		})
	}

	const handleUpdateEducation = (id: string, field: keyof Education, value: string) => {
		setResumeDataPartial({
			education: resumeData.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
		})
	}

	// Project handlers
	const handleAddProject = () => {
		const newProject: Project = {
			id: crypto.randomUUID(),
			name: '',
			link: '',
			description: '',
			technologies: ''
		}
		setResumeDataPartial({
			projects: [...resumeData.projects, newProject]
		})
	}

	const handleRemoveProject = (id: string) => {
		setResumeDataPartial({
			projects: resumeData.projects.filter((project) => project.id !== id)
		})
	}

	const handleUpdateProject = (id: string, field: keyof Project, value: string) => {
		setResumeDataPartial({
			projects: resumeData.projects.map((project) => (project.id === id ? { ...project, [field]: value } : project))
		})
	}

	// Certification handlers
	const handleAddCertification = () => {
		if (!certificationInput.trim()) return

		const newCertification: Certification = {
			id: crypto.randomUUID(),
			name: certificationInput.trim(),
			issuer: '',
			date: ''
		}
		setResumeDataPartial({
			certifications: [...resumeData.certifications, newCertification]
		})
		setCertificationInput('')
	}

	const handleRemoveCertification = (id: string) => {
		setResumeDataPartial({
			certifications: resumeData.certifications.filter((cert) => cert.id !== id)
		})
	}

	// Language handlers
	const handleAddLanguage = () => {
		if (!languageInput.trim()) return

		const newLanguage: Language = {
			id: crypto.randomUUID(),
			name: languageInput.trim(),
			proficiency: languageProficiency
		}
		setResumeDataPartial({
			languages: [...resumeData.languages, newLanguage]
		})
		setLanguageInput('')
		setLanguageProficiency('Native')
	}

	const handleRemoveLanguage = (id: string) => {
		setResumeDataPartial({
			languages: resumeData.languages.filter((lang) => lang.id !== id)
		})
	}

	/** Receives template ID from TemplateSelector and updates resume data */
	const handleTemplateSelect = (template: string) => {
		setResumeDataPartial({
			selectedTemplate: template
		})
	}

	const handleNext = () => {
		// Validate current step before proceeding
		const validation = validateStep(currentStep, resumeData)

		if (!validation.isValid) {
			// Show validation errors and prevent step change
			setValidationErrors(validation.errors)
			return
		}

		// Clear errors and proceed to next step
		setValidationErrors([])
		setCurrentStep(currentStep + 1)

		// Scroll to top for better UX
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const handlePrevious = () => {
		// Clear validation errors when going back
		setValidationErrors([])
		setCurrentStep(currentStep - 1)

		// Scroll to top for better UX
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const handleSave = () => {
		try {
			// Manual backup save to localStorage (atomWithStorage already handles auto-save)
			localStorage.setItem('robo-resume-data', JSON.stringify(resumeData))

			// Log timestamp for debugging
			console.log('[Resume Save] Manual save triggered at:', new Date().toISOString())

			// Show success feedback to user
			window.alert('Resume saved successfully! Your data is safely stored locally.')
		} catch (error) {
			console.error('[Resume Save] Error saving resume:', error)
			window.alert('Failed to save resume. Please try again.')
		}
	}

	const handleDownload = (format: 'pdf' | 'word' | 'text' = 'pdf') => {
		// TODO: Integrate PDF export library (e.g., jsPDF, react-pdf) in future phases
		console.log(`[Resume Download] Format: ${format}, Current resume data:`, resumeData)

		// Placeholder alert for MVP
		window.alert(`Download as ${format.toUpperCase()} functionality coming soon! Your resume data is saved locally.`)
	}

	return (
		<div className="flex flex-col min-h-screen bg-background-light">
			{/* Header */}
			<header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-color/50 px-6 md:px-10 py-3 bg-background-light sticky top-0 z-20">
				<div className="flex items-center gap-4 text-text-main">
					<div className="size-4">
						<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M39.7107 13.2608L40.0732 12.2742L39.7107 13.2608ZM41.835 22.2146L42.8302 22.4381L41.835 22.2146ZM39.7107 34.7392L40.0732 35.7258L39.7107 34.7392ZM8.28928 34.7392L7.92678 35.7258L8.28928 34.7392ZM6.16502 22.2146L5.16978 22.4381L6.16502 22.2146ZM8.28928 13.2608L7.92678 12.2742L8.28928 13.2608ZM39.3482 14.2474C37.4285 13.5762 35.4156 13.2143 33.3571 13.2143V11.2143C35.6235 11.2143 37.8405 11.6094 39.9512 12.3408L39.3482 14.2474ZM33.3571 13.2143H14.6429V11.2143H33.3571V13.2143ZM14.6429 13.2143C12.5844 13.2143 10.5715 13.5762 8.65178 14.2474L8.06538 12.3408C10.1761 11.6094 12.3931 11.2143 14.6429 11.2143V13.2143ZM8.65178 14.2474C4.38652 15.7085 1.21429 19.6241 1.21429 24.214H-0.785713C-0.785713 18.6762 3.00066 14.0058 7.92678 12.2742L8.65178 14.2474ZM1.21429 24.214C1.21429 28.804 4.38652 32.7195 8.65178 34.1806L8.06538 36.0872C3.00066 34.3556 -0.785713 29.6852 -0.785713 24.214H1.21429ZM8.65178 34.1806C10.5715 34.8518 12.5844 35.2137 14.6429 35.2137V37.2137C12.3931 37.2137 10.1761 36.8186 8.06538 36.0872L8.65178 34.1806ZM14.6429 35.2137H33.3571V37.2137H14.6429V35.2137ZM33.3571 35.2137C35.4156 35.2137 37.4285 34.8518 39.3482 34.1806L39.9512 36.0872C37.8405 36.8186 35.6235 37.2137 33.3571 37.2137V35.2137ZM39.3482 34.1806C43.6135 32.7195 46.7857 28.804 46.7857 24.214H48.7857C48.7857 29.6852 44.9993 34.3556 40.0732 36.0872L39.3482 34.1806ZM46.7857 24.214C46.7857 19.6241 43.6135 15.7085 39.3482 14.2474L39.9512 12.3408C44.9993 14.0058 48.7857 18.6762 48.7857 24.214H46.7857Z"
								fill="currentColor"
							/>
						</svg>
					</div>
					<h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">ResumeBuilder</h2>
				</div>
				<div className="flex flex-1 justify-end gap-8">
					<div className="hidden md:flex items-center gap-9">
						<Link href="/dashboard" className="text-sm font-medium leading-normal">
							Dashboard
						</Link>
						<Link href="/templates" className="text-sm font-medium leading-normal">
							Templates
						</Link>
					</div>
					<div className="flex gap-2">
						<button
							onClick={handleSave}
							className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-border-color/60 text-text-main text-sm font-bold leading-normal tracking-[0.015em] hover:bg-border-color/80 transition-colors"
						>
							<span className="truncate">Save</span>
						</button>
						<button
							onClick={handleDownload}
							className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
						>
							<span className="truncate">Download</span>
						</button>
					</div>
					<div
						className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
						style={{
							backgroundImage: 'url("https://cdn.usegalileo.ai/stability/e2060837-caa0-48f0-a90e-f776319037f7.png")'
						}}
					></div>
				</div>
			</header>

			{/* Main Content */}
			<main className="flex-grow w-full max-w-screen-2xl mx-auto px-6 md:px-10 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
					{/* Left Column - Form */}
					<div className="flex flex-col gap-8">
						{/* Validation Errors Display */}
						{validationErrors.length > 0 && (
							<div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 md:p-6">
								<div className="flex items-start gap-3">
									<div className="flex-shrink-0 w-6 h-6 text-red-600">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<circle cx="12" cy="12" r="10" />
											<line x1="12" y1="8" x2="12" y2="12" />
											<line x1="12" y1="16" x2="12.01" y2="16" />
										</svg>
									</div>
									<div className="flex-1">
										<h3 className="text-red-900 font-bold text-lg mb-2">Please fix the following errors:</h3>
										<ul className="list-disc list-inside space-y-1">
											{validationErrors.map((error, index) => (
												<li key={index} className="text-red-800 text-sm">
													{error}
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>
						)}

						{/* Step 1: Contact Info */}
						{currentStep === 1 && (
							<>
								<StepProgress currentStep={1} totalSteps={6} stepLabel="Contact Info" />
								<div className="flex flex-col gap-8 bg-secondary-bg/50 p-6 md:p-8 rounded-xl border border-border-color/30">
									<div className="flex flex-col gap-3">
										<h1 className="text-4xl font-black leading-tight tracking-[-0.033em]">Contact Information</h1>
										<p className="text-text-subtle text-base font-normal leading-normal">
											Let's start with the basics. Enter your contact information below.
										</p>
									</div>

									<div className="flex flex-col gap-6">
										{/* Row 1: Full Name and Headline */}
										<div className="flex flex-col md:flex-row gap-6">
											<div className="flex-1 min-w-40">
												<BuilderFormField
													id="fullName"
													name="fullName"
													label="Full Name"
													type="text"
													placeholder="John Doe"
													value={resumeData.contactInfo.fullName}
													onChange={(e) => handleContactChange('fullName', e.target.value)}
												/>
											</div>
											<div className="flex-1 min-w-40">
												<BuilderFormField
													id="headline"
													name="headline"
													label="Headline"
													type="text"
													placeholder="Software Engineer"
													value={resumeData.contactInfo.headline}
													onChange={(e) => handleContactChange('headline', e.target.value)}
												/>
											</div>
										</div>

										{/* Row 2: Email and Phone */}
										<div className="flex flex-col md:flex-row gap-6">
											<div className="flex-1 min-w-40">
												<BuilderFormField
													id="email"
													name="email"
													label="Email Address"
													type="email"
													placeholder="john@example.com"
													value={resumeData.contactInfo.email}
													onChange={(e) => handleContactChange('email', e.target.value)}
												/>
											</div>
											<div className="flex-1 min-w-40">
												<BuilderFormField
													id="phone"
													name="phone"
													label="Phone Number"
													type="tel"
													placeholder="+1 (555) 123-4567"
													value={resumeData.contactInfo.phone}
													onChange={(e) => handleContactChange('phone', e.target.value)}
												/>
											</div>
										</div>

										{/* Row 3: Address (full width) */}
										<div>
											<BuilderFormField
												id="address"
												name="address"
												label="Address"
												type="text"
												placeholder="City, State, Country"
												value={resumeData.contactInfo.address}
												onChange={(e) => handleContactChange('address', e.target.value)}
											/>
										</div>

										{/* Row 4: LinkedIn and Website */}
										<div className="flex flex-col md:flex-row gap-6">
											<div className="flex-1 min-w-40">
												<BuilderFormField
													id="linkedin"
													name="linkedin"
													label="LinkedIn Profile"
													type="url"
													placeholder="linkedin.com/in/johndoe"
													value={resumeData.contactInfo.linkedin}
													onChange={(e) => handleContactChange('linkedin', e.target.value)}
												/>
											</div>
											<div className="flex-1 min-w-40">
												<BuilderFormField
													id="website"
													name="website"
													label="Website/Portfolio"
													type="url"
													placeholder="johndoe.com"
													value={resumeData.contactInfo.website}
													onChange={(e) => handleContactChange('website', e.target.value)}
												/>
											</div>
										</div>
									</div>

									{/* Navigation Buttons */}
									<NavigationButtons
										onPrevious={handlePrevious}
										onNext={handleNext}
										previousDisabled={currentStep === 1}
										showPrevious={true}
										showNext={true}
									/>
								</div>
							</>
						)}

						{/* Step 2: Experience & Skills */}
						{currentStep === 2 && (
							<>
								<StepProgress currentStep={2} totalSteps={6} stepLabel="Experience" />
								<div className="flex flex-col gap-8 bg-secondary-bg/50 p-6 md:p-8 rounded-xl border border-border-color/30">
									{/* Work Experience Section */}
									<div className="flex flex-col gap-6">
										<div className="flex flex-col gap-3">
											<h1 className="text-4xl font-black leading-tight tracking-[-0.033em]">Work Experience</h1>
											<p className="text-text-subtle text-base font-normal leading-normal">
												Share your relevant work history. Start with your most recent job.
											</p>
										</div>

										{/* Experience Cards */}
										<div className="flex flex-col gap-6">
											{resumeData.experiences.map((experience, index) => (
												<ExperienceCard
													key={experience.id}
													experience={experience}
													index={index}
													onUpdate={(field, value) => handleUpdateExperience(experience.id, field, value)}
													onDelete={() => handleRemoveExperience(experience.id)}
												/>
											))}

											{/* Add Experience Button */}
											<button
												onClick={handleAddExperience}
												className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-border-color bg-border-color/20 hover:bg-border-color/40 rounded-lg transition-colors"
											>
												<span className="font-medium">Add another experience</span>
											</button>
										</div>
									</div>

									{/* Skills Section */}
									<div className="pt-8 border-t border-border-color/30 flex flex-col gap-6">
										<div className="flex flex-col gap-3">
											<h2 className="text-2xl font-bold">Skills</h2>
											<p className="text-text-subtle text-base font-normal leading-normal">
												Highlight your key skills.
											</p>
										</div>

										{/* Existing Skills */}
										{resumeData.skills.length > 0 && (
											<div className="flex flex-wrap gap-3">
												{resumeData.skills.map((skill) => (
													<SkillTag key={skill.id} skill={skill} onRemove={() => handleRemoveSkill(skill.id)} />
												))}
											</div>
										)}

										{/* Add Skill Input */}
										<div className="flex items-end gap-4">
											<div className="flex-1 relative">
												<BuilderFormField
													id="skillInput"
													name="skillInput"
													label="Add a skill"
													type="text"
													placeholder="e.g., UI/UX Design"
													value={skillInput}
													onChange={(e) => setSkillInput(e.target.value)}
													onKeyDown={(e) => {
														if (e.key === 'Enter') {
															e.preventDefault()
															handleAddSkill()
														}
													}}
												/>
											</div>
											<button
												onClick={handleAddSkill}
												className="h-14 px-6 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
											>
												Add
											</button>
										</div>
									</div>

									{/* Navigation Buttons */}
									<NavigationButtons
										onPrevious={handlePrevious}
										onNext={handleNext}
										previousDisabled={false}
										showPrevious={true}
										showNext={true}
									/>
								</div>
							</>
						)}

						{/* Step 3: Professional Summary */}
						{currentStep === 3 && (
							<>
								<StepProgress currentStep={3} totalSteps={6} stepLabel="Professional Summary" />
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
											onAIClick={() => {}}
										/>
									</div>

									{/* Navigation Buttons */}
									<NavigationButtons
										onPrevious={handlePrevious}
										onNext={handleNext}
										previousDisabled={false}
										showPrevious={true}
										showNext={true}
									/>
								</div>
							</>
						)}

						{/* Step 4: Education */}
						{currentStep === 4 && (
							<>
								<StepProgress currentStep={4} totalSteps={6} stepLabel="Education" />
								<div className="flex flex-col gap-8 bg-secondary-bg/50 p-6 md:p-8 rounded-xl border border-border-color/30">
									<div className="flex flex-col gap-3">
										<h1 className="text-4xl font-black leading-tight tracking-[-0.033em]">Education</h1>
										<p className="text-text-subtle text-base font-normal leading-normal">
											Add your educational background, including degrees, certifications, and relevant coursework.
										</p>
									</div>

									{/* Education Cards */}
									<div className="flex flex-col gap-6">
										{resumeData.education.map((education, index) => (
											<EducationCard
												key={education.id}
												education={education}
												index={index}
												onUpdate={(field, value) => handleUpdateEducation(education.id, field, value)}
												onDelete={() => handleRemoveEducation(education.id)}
											/>
										))}

										{/* Add another education button */}
										<button
											onClick={handleAddEducation}
											className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-border-color bg-border-color/20 hover:bg-border-color/40 rounded-lg transition-colors"
										>
											<span className="material-symbols-rounded">add</span>
											<span className="text-base font-bold text-text-main">Add another education</span>
										</button>
									</div>

									{/* Navigation Buttons */}
									<NavigationButtons
										onPrevious={handlePrevious}
										onNext={handleNext}
										previousDisabled={false}
										showPrevious={true}
										showNext={true}
									/>
								</div>
							</>
						)}

						{/* Step 5: Projects & Extras */}
						{currentStep === 5 && (
							<>
								<StepProgress currentStep={5} totalSteps={6} stepLabel="Projects & Extras" />
								<div className="flex flex-col gap-8 bg-secondary-bg/50 p-6 md:p-8 rounded-xl border border-border-color/30">
									<div className="flex flex-col gap-3">
										<h1 className="text-4xl font-black leading-tight tracking-[-0.033em]">Projects & Extras</h1>
										<p className="text-text-subtle text-base font-normal leading-normal">
											Showcase your projects, certifications, and languages to stand out from the crowd.
										</p>
									</div>

									{/* Projects Section */}
									<div className="flex flex-col gap-4">
										<h2 className="text-2xl font-bold text-text-main">Projects</h2>
										<div className="space-y-4">
											{resumeData.projects.map((project, index) => (
												<ProjectCard
													key={project.id}
													project={project}
													index={index}
													onUpdate={(field, value) => handleUpdateProject(project.id, field, value)}
													onDelete={() => handleRemoveProject(project.id)}
												/>
											))}
										</div>
										<button
											onClick={handleAddProject}
											className="flex items-center justify-center gap-2 p-4 bg-white/30 border-2 border-dashed border-border-color/50 rounded-lg text-text-subtle hover:border-primary hover:text-primary transition-colors"
										>
											<span className="material-symbols-outlined">add</span>
											<span>Add another project</span>
										</button>
									</div>

									{/* Certifications Section */}
									<div className="flex flex-col gap-4 pt-6 border-t border-border-color/30">
										<h2 className="text-2xl font-bold text-text-main">Certifications</h2>
										{resumeData.certifications.length > 0 && (
											<div className="flex flex-wrap gap-2">
												{resumeData.certifications.map((cert) => (
													<CertificationTag
														key={cert.id}
														certification={cert}
														onRemove={() => handleRemoveCertification(cert.id)}
													/>
												))}
											</div>
										)}
										<div className="flex gap-2">
											<BuilderFormField
												id="certificationInput"
												name="certificationInput"
												label=""
												value={certificationInput}
												onChange={(e) => setCertificationInput(e.target.value)}
												placeholder="E.g., AWS Certified Solutions Architect"
												onKeyDown={(e) => {
													if (e.key === 'Enter') {
														e.preventDefault()
														handleAddCertification()
													}
												}}
											/>
											<button
												onClick={handleAddCertification}
												className="mt-auto h-12 px-6 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
											>
												Add
											</button>
										</div>
									</div>

									{/* Languages Section */}
									<div className="flex flex-col gap-4 pt-6 border-t border-border-color/30">
										<h2 className="text-2xl font-bold text-text-main">Languages</h2>
										{resumeData.languages.length > 0 && (
											<div className="flex flex-wrap gap-2">
												{resumeData.languages.map((lang) => (
													<LanguageTag
														key={lang.id}
														language={lang}
														onRemove={() => handleRemoveLanguage(lang.id)}
													/>
												))}
											</div>
										)}
										<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
											<BuilderFormField
												id="languageInput"
												name="languageInput"
												label=""
												value={languageInput}
												onChange={(e) => setLanguageInput(e.target.value)}
												placeholder="E.g., Spanish"
												onKeyDown={(e) => {
													if (e.key === 'Enter') {
														e.preventDefault()
														handleAddLanguage()
													}
												}}
											/>
											<div className="flex gap-2">
												<BuilderSelect
													id="languageProficiency"
													label=""
													value={languageProficiency}
													onValueChange={setLanguageProficiency}
													options={[
														{ value: 'Native', label: 'Native' },
														{ value: 'Fluent', label: 'Fluent' },
														{ value: 'Conversational', label: 'Conversational' },
														{ value: 'Basic', label: 'Basic' }
													]}
												/>
												<button
													onClick={handleAddLanguage}
													className="mt-auto h-12 px-6 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
												>
													Add
												</button>
											</div>
										</div>
									</div>

									{/* Navigation Buttons */}
									<NavigationButtons
										onPrevious={handlePrevious}
										onNext={handleNext}
										previousDisabled={false}
										showPrevious={true}
										showNext={true}
									/>
								</div>
							</>
						)}

						{/* Step 6: Review & Export */}
						{currentStep === 6 && (
							<>
								<div className="flex items-center justify-between gap-4">
									<StepProgress currentStep={6} totalSteps={6} stepLabel="Review & Export" />
									<span className="text-primary text-base font-bold flex items-center gap-2">
										<span className="material-symbols-outlined">check_circle</span>
										Complete!
									</span>
								</div>
								<div className="flex flex-col gap-8 bg-secondary-bg/50 p-6 md:p-8 rounded-xl border border-border-color/30">
									<div className="flex flex-col gap-3">
										<h1 className="text-4xl font-black leading-tight tracking-[-0.033em]">Review & Export</h1>
										<p className="text-text-subtle text-base font-normal leading-normal">
											Choose your template and export your resume in your preferred format.
										</p>
									</div>

									{/* Template Selection Section */}
									<div className="flex flex-col gap-4">
										<h2 className="text-2xl font-bold text-text-main">Choose Template</h2>
										<TemplateSelector
											selectedTemplate={resumeData.selectedTemplate}
											onSelect={handleTemplateSelect}
										/>
									</div>

									{/* Export Format Section */}
									<div className="flex flex-col gap-4 pt-6 border-t border-border-color/30">
										<h2 className="text-2xl font-bold text-text-main">Export Format</h2>
										<ExportButtons onExport={handleDownload} />
									</div>

									{/* Pro Tip */}
									<div className="bg-highlight/30 rounded-lg border border-border-color/30 p-4 flex gap-3">
										<span className="material-symbols-outlined text-primary">info</span>
										<div className="flex-1">
											<p className="text-text-main font-medium">Pro Tip</p>
											<p className="text-text-subtle text-sm">
												Download multiple formats for different application systems. PDF for email, plain text for ATS.
											</p>
										</div>
									</div>

									{/* Validation Errors */}
									{validationErrors.length > 0 && (
										<div className="bg-red-50 border border-red-200 rounded-lg p-4">
											<h3 className="text-red-800 font-semibold mb-2">Please fix the following:</h3>
											<ul className="list-disc list-inside text-red-700 text-sm space-y-1">
												{validationErrors.map((error, index) => (
													<li key={index}>{error}</li>
												))}
											</ul>
										</div>
									)}

									{/* Navigation Buttons */}
									<NavigationButtons
										onPrevious={handlePrevious}
										onNext={handleNext}
										previousDisabled={false}
										nextDisabled={!resumeData.selectedTemplate}
										showPrevious={true}
										showNext={true}
										nextLabel="Finalize & Download"
									/>
								</div>
							</>
						)}
					</div>

					{/* Right Column - Live Preview */}
					<ResumePreview />
				</div>
			</main>
		</div>
	)
}
