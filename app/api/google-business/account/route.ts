import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const account = await prisma.googleBusinessAccount.findUnique({
    where: { userId: session.user.id },
    select: {
      id: true,
      accountName: true,
      locationName: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return Response.json({ account })
}

export async function DELETE() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  await prisma.googleBusinessAccount.delete({
    where: { userId: session.user.id },
  })

  return Response.json({ success: true })
}
