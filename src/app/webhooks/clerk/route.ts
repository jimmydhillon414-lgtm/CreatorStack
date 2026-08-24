import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env')
  }

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch {
    return new Response('Error verifying webhook', { status: 400 })
  }

  const eventType = evt.type

  if (eventType === 'user.created') {
    const data = evt.data
    await prisma.user.create({
      data: {
        clerkId: data.id,
        email: data.email_addresses[0]?.email_address || '',
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        imageUrl: data.image_url || '',
        credits: 10,
      },
    })
  }

  if (eventType === 'user.updated') {
    const data = evt.data
    await prisma.user.update({
      where: { clerkId: data.id },
      data: {
        email: data.email_addresses[0]?.email_address || '',
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        imageUrl: data.image_url || '',
      },
    })
  }

  if (eventType === 'user.deleted') {
    const data = evt.data
    if (data.id) {
      await prisma.user.delete({
        where: { clerkId: data.id },
      })
    }
  }

  return new Response('Webhook processed successfully', { status: 200 })
}