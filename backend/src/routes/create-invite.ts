import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import { getMailClient } from "../lib/mail";
import nodemailer from 'nodemailer'
import { ClintError } from "../errors/client-error";
import { env } from "../env";

export async function createInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripId/invites', {
    schema: {
      params: z.object({
        tripId: z.string().uuid()
      }),
      body: z.object({
        email: z.string().email()
      })
    }
  }, async (request) => {
    const { tripId } = request.params
    const { email } = request.body

    const trip = await prisma.trip.findUnique({
      where: { id: tripId }
    })

    if (!trip) {
      throw new ClintError('Trip not found')
    }

    const participant = await prisma.participant.create({
      data: {
        email,
        trip_id: tripId
      }
    })

    const formatedStartDate = dayjs(trip.starts_at).format('LL')
    const formatedEndDate = dayjs(trip?.ends_at).format('LL')

    const mail = await getMailClient()
    const confirmationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`
    const message = await mail.sendMail({
      from: {
        name: "equipe plann.er",
        address: "oi@plann.er"
      },
      to: [participant.email],
      subject: `Você foi convidado para participar de uma viagem para ${trip.destination} em ${formatedStartDate}`,
      html: `
            <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
              <p>Você foi convidado para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de
              <strong>${formatedStartDate}</strong> até <strong>${formatedEndDate}</strong>.</p>
                <br>
              <p>para confirmar sua presença ma viagem, clique no link abaixo</p>
                <br>
              <p>
                <a href="${confirmationLink}">confirmar viagem</a>
              </p>
                <br>
              <p>caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mai</p>
            </div>
          `.trim()
    })

    console.log(nodemailer.getTestMessageUrl(message))

    return { participantId: participant.id }

  })
}