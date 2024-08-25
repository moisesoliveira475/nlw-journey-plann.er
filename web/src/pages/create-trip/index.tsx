import { useState } from "react"
import { DateRange } from "react-day-picker"
import { useNavigate } from "react-router-dom"
import { ConfirmTripModal } from "./confirm-trip-modal"
import { InviteGuestsModal } from "./invite-guests-modal"
import { DestinationAndDateStep } from "./steps/destination-and-date-step"
import { InviteGuestsStep } from "./steps/invite-guests-step"
import { api } from "../../lib/axios"

export function CreateTripPage() {

  const navigate = useNavigate()

  const [isGuestsInputOpen, setIsGuestsInputOpen] = useState(false)
  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false)
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false)
  const [emailsToInvite, setEmailsToInvite] = useState<string[]>(['moises@gmail.com'])
  const [destination, setDestination] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [eventStartAndDates, setEventStartAndDates] = useState<DateRange | undefined>()


  function openGuestsInput() {
    setIsGuestsInputOpen(!isGuestsInputOpen)
  }

  function openGuestsModal() {
    setIsGuestsModalOpen(!isGuestsModalOpen)
  }

  function openConfirmTripModal() {
    setIsConfirmTripModalOpen(!isConfirmTripModalOpen)
  }

  function addNewEmailToInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const email = data.get('email')?.toString()

    if (!email) {
      return
    }

    if (emailsToInvite.includes(email)) {
      return
    }

    setEmailsToInvite([
      ...emailsToInvite, email
    ])

    event.currentTarget.reset()
  }

  function removeEmailFromInvite(emailToRemove: string) {
    const newEmailList = emailsToInvite.filter((email) => email !== emailToRemove)

    setEmailsToInvite(newEmailList)
  }

    async function createTrip(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!destination) {
      return
    }
    if (!eventStartAndDates?.from || !eventStartAndDates?.to) {
      return
    }
    if (emailsToInvite.length === 0) {
      return
    }
    if (!ownerEmail || !ownerName) {
      return
    }

    const response = await api.post("/trips", {
      destination,
      starts_at: eventStartAndDates.from,
      ends_at: eventStartAndDates.to,
      emails_to_invite: emailsToInvite,
      owner_name: ownerName,
      owner_email: ownerEmail
  })

  const { tripId } = response.data

  navigate(`/trips/${tripId}`)

  }

  return (
    <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
      <div className="max-w-3xl w-full px-6 text-center space-y-10">
        <div className="flex flex-col items-center gap-3">
          <img src="/logo.svg" alt="plann.er" />
          <p className="zinc-300 text-lg">Convide seus amigos e planeje sua próxima viagem!</p>
        </div>

        <div className="space-y-4">
          <DestinationAndDateStep
          isGuestsInputOpen={isGuestsInputOpen}
          openGuestsInput={openGuestsInput}
          setDestination={setDestination}
          eventStartAndDates={eventStartAndDates}
          setEventStartAndDates={setEventStartAndDates}
          />
          {isGuestsInputOpen && (
            <InviteGuestsStep emailsToInvite={emailsToInvite} openConfirmTripModal={openConfirmTripModal} openGuestsModal={openGuestsModal} />
          )}
        </div>
        <p className="text-sm text-zinc-500">Ao planejar sua viagem pela plann.er você automaticamente concorda <br />
          com nossos <a href="#" className="text-zinc-300 underline">termos de uso</a> e <a href="#" className="text-zinc-300 underline">políticas de privacidade</a>
        </p>
      </div>
      {
        isGuestsModalOpen && (
          <InviteGuestsModal
            addNewEmailToInvite={addNewEmailToInvite}
            openGuestsModal={openGuestsModal}
            emailsToInvite={emailsToInvite}
            removeEmailFromInvite={removeEmailFromInvite} />
        )}
      {isConfirmTripModalOpen && (
        <ConfirmTripModal
          openConfirmTripModal={openConfirmTripModal}
          createTrip={createTrip}
          setOwnerName={setOwnerName}
          setOwnerEmail={setOwnerEmail}
          />
      )}
    </div>
  )
}