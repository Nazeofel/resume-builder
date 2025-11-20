import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export interface ContactInfo {
	fullName: string
	headline: string
	email: string
	phone: string
	address: string
	linkedin: string
	website: string
}

export interface Experience {
	id: string
	jobTitle: string
	company: string
	location: string
	startDate: string
	endDate: string
	description: string
}

export interface Skill {
	id: string
	name: string
}

export interface Education {
	id: string
	degree: string
	fieldOfStudy?: string
	school: string
	startDate: string
	endDate: string
	gpa?: string
}

export interface Project {
	id: string
	name: string
	description: string
	technologies: string
	link: string
}

export interface Certification {
	id: string
	name: string
	issuer: string
	date: string
}

export interface Award {
	id: string
	name: string
	issuer: string
	date: string
}

export interface Language {
	id: string
	name: string
	proficiency: string
}

export interface ResumeData {
	contactInfo: ContactInfo
	experiences: Experience[]
	skills: Skill[]
	summary: string
	education: Education[]
	projects: Project[]
	certifications: Certification[]
	awards: Award[]
	languages: Language[]
	currentStep: number
	/** Template ID from TEMPLATES array (e.g., 'modern', 'classic', 'minimalist', 'creative') */
	selectedTemplate: string
}

/** Resume data atom with automatic localStorage persistence via atomWithStorage */
export const resumeDataAtom = atomWithStorage<ResumeData>('robo-resume-data', {
	contactInfo: {
		fullName: '',
		headline: '',
		email: '',
		phone: '',
		address: '',
		linkedin: '',
		website: ''
	},
	experiences: [],
	skills: [],
	summary: '',
	education: [],
	projects: [],
	certifications: [],
	awards: [],
	languages: [],
	currentStep: 1,
	selectedTemplate: ''
})

/** Setter atom for partial updates. Nested objects/arrays must be passed completely to avoid data loss. */
export const setResumeDataAtom = atom(null, (get, set, update: Partial<ResumeData>) => {
	set(resumeDataAtom, {
		...get(resumeDataAtom),
		...update
	})
})

export const currentStepAtom = atom((get) => get(resumeDataAtom).currentStep)

/** Setter atom for currentStep. Clamps value to range [1, 7]. */
export const setCurrentStepAtom = atom(null, (get, set, step: number) => {
	const clampedStep = Math.max(1, Math.min(7, step))
	set(resumeDataAtom, {
		...get(resumeDataAtom),
		currentStep: clampedStep
	})
})

export interface ValidationResult {
	isValid: boolean
	errors: string[]
}

/** Validates contact info: requires fullName and valid email */
export function validateContactInfo(contactInfo: ContactInfo): ValidationResult {
	const errors: string[] = []

	if (!contactInfo.fullName || contactInfo.fullName.trim() === '') {
		errors.push('Full name is required')
	}

	if (!contactInfo.email || contactInfo.email.trim() === '') {
		errors.push('Email is required')
	} else {
		// Basic email regex pattern
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(contactInfo.email)) {
			errors.push('Please enter a valid email address')
		}
	}

	return {
		isValid: errors.length === 0,
		errors
	}
}

/** Validates work experience: requires at least one entry with all required fields */
export function validateExperience(experiences: Experience[]): ValidationResult {
	const errors: string[] = []

	if (experiences.length === 0) {
		errors.push('Please add at least one work experience')
		return { isValid: false, errors }
	}

	experiences.forEach((exp, index) => {
		if (!exp.jobTitle || exp.jobTitle.trim() === '') {
			errors.push(`Experience ${index + 1}: Job title is required`)
		}
		if (!exp.company || exp.company.trim() === '') {
			errors.push(`Experience ${index + 1}: Company name is required`)
		}
		if (!exp.startDate || exp.startDate.trim() === '') {
			errors.push(`Experience ${index + 1}: Start date is required`)
		}
		if (!exp.description || exp.description.trim() === '') {
			errors.push(`Experience ${index + 1}: Job description is required`)
		}
	})

	return {
		isValid: errors.length === 0,
		errors
	}
}

/** Validates skills: requires at least 3 skills */
export function validateSkills(skills: Skill[]): ValidationResult {
	const errors: string[] = []

	if (skills.length < 3) {
		errors.push('Please add at least 3 skills to showcase your expertise')
	}

	return {
		isValid: errors.length === 0,
		errors
	}
}

/** Validates professional summary: requires at least 50 characters */
export function validateSummary(summary: string): ValidationResult {
	const errors: string[] = []

	if (!summary || summary.trim().length < 50) {
		errors.push('Please write at least 50 characters for your professional summary')
	}

	return {
		isValid: errors.length === 0,
		errors
	}
}

/** Validates education: optional section, but if present all required fields must be filled */
export function validateEducation(education: Education[]): ValidationResult {
	const errors: string[] = []

	// Education is optional, so empty array is valid
	if (education.length === 0) {
		return { isValid: true, errors: [] }
	}

	// If education entries exist, validate required fields
	education.forEach((edu, index) => {
		if (!edu.degree || edu.degree.trim() === '') {
			errors.push(`Education ${index + 1}: Degree is required`)
		}
		if (!edu.school || edu.school.trim() === '') {
			errors.push(`Education ${index + 1}: School is required`)
		}
		if (!edu.startDate || edu.startDate.trim() === '') {
			errors.push(`Education ${index + 1}: Start date is required`)
		}
		if (!edu.endDate || edu.endDate.trim() === '') {
			errors.push(`Education ${index + 1}: End date is required`)
		}
	})

	return {
		isValid: errors.length === 0,
		errors
	}
}

/** Validates projects: all optional, always returns valid */
export function validateProjects(projects: Project[]): ValidationResult {
	return {
		isValid: true,
		errors: []
	}
}

/** Validates template selection: requires non-empty template ID */
export function validateTemplate(selectedTemplate: string): ValidationResult {
	if (!selectedTemplate || selectedTemplate.trim() === '') {
		return {
			isValid: false,
			errors: ['Please select a template to proceed']
		}
	}
	return {
		isValid: true,
		errors: []
	}
}

/** Routes to appropriate validator based on step number */
export function validateStep(step: number, data: ResumeData): ValidationResult {
	switch (step) {
		case 1:
			return validateTemplate(data.selectedTemplate)
		case 2:
			return validateContactInfo(data.contactInfo)
		case 3: {
			// Step 3 combines experience and skills validation
			const expValidation = validateExperience(data.experiences)
			const skillsValidation = validateSkills(data.skills)

			const combinedErrors = [...expValidation.errors, ...skillsValidation.errors]

			return {
				isValid: expValidation.isValid && skillsValidation.isValid,
				errors: combinedErrors
			}
		}
		case 4:
			return validateSummary(data.summary)
		case 5:
			return validateEducation(data.education)
		case 6:
			return validateProjects(data.projects)
		case 7:
			// Review step doesn't need validation, but we can check everything again if we want
			return { isValid: true, errors: [] }
		default:
			return { isValid: true, errors: [] }
	}
}
