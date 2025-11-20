import { redirect } from 'next/navigation'
import { getServerUser } from '@/lib/auth-helper'
import SettingsClient from './SettingsClient'

export default async function SettingsPage() {
    const user = await getServerUser()

    if (!user?.id) {
        redirect('/auth?login=true')
    }

    return <SettingsClient />
}