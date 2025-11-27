import { getUserData } from '@/lib/auth-helper'
import DashboardClient from './DashboardClient'
import { getUsersResumes } from '@/lib/data'

export default async function DashboardPage() {
	const user = await getUserData()
	if (!user) {
		return <div>A terrible error has happened, please contact website administrator</div>
	}
	const resumes = await getUsersResumes(user.id)
	return <DashboardClient user={user} resumes={resumes} />
}
