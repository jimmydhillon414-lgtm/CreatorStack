import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', { status: 400 })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Verify the payload
  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occurred', { status: 400 })
  }

  const eventType = evt.type

  // Handle user sync events with Prisma
  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id: clerkId, email_addresses, first_name, last_name, image_url } = evt.data
    const primaryEmail = email_addresses?.[0]?.email_address

    if (!primaryEmail) {
      return new Response('No email provided', { status: 400 })
    }

    // @ts-expect-error - Prisma client type caching
    await prisma.user.upsert({
      where: { clerkId: clerkId },
      update: {
        email: primaryEmail,
        firstName: first_name ?? '',
        lastName: last_name ?? '',
        imageUrl: image_url ?? '',
      },
      create: {
        clerkId: clerkId,
        email: primaryEmail,
        firstName: first_name ?? '',
        lastName: last_name ?? '',
        imageUrl: image_url ?? '',
      },
    })
  }

  if (eventType === 'user.deleted') {
    const clerkId = evt.data.id
    if (clerkId) {
      // @ts-expect-error - Prisma client type caching
      await prisma.user.delete({
        where: { clerkId: clerkId },
      })
    }
  }

  return new Response('Webhook processed successfully', { status: 200 })
}