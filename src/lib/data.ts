import { prisma } from "./prisma"

export async function getUsersResumes(userId: string) {
    const resumes = await prisma.resume.findMany({
        where: {
            userId,
        },
    })

    if (!resumes) {
        return []
    }

    return resumes
}
