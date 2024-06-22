import { Resend } from "resend"
import generateActivationEmailHTML from "./templates/accountActivation"

const noreplyEmail = "noreply@2048vs.com"

class EmailService {
  private resend
  constructor(private apiKey?: string) {
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not set")
    }
    this.resend = new Resend(this.apiKey)
  }

  sendAccountActivationEmail = ({ to, activationUrl }: { to: string; activationUrl: string }) => {
    const { subject, html } = generateActivationEmailHTML(activationUrl)
    this.resend.emails.send({
      from: noreplyEmail,
      to,
      subject,
      html,
    })
  }
}

export default new EmailService(process.env.RESEND_API_KEY)
