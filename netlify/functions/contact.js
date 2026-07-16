import { Resend } from 'resend'

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' })
  }

  let form
  try {
    form = JSON.parse(event.body || '{}')
  } catch {
    return json(400, { error: 'Invalid form data' })
  }

  const name = String(form.name || '').trim()
  const email = String(form.email || '').trim()
  const subject = String(form.subject || '').trim()
  const message = String(form.message || '').trim()

  if (!name || !email || !subject || !message || !/^\S+@\S+\.\S+$/.test(email)) {
    return json(400, { error: 'Invalid form data' })
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    return json(503, { error: 'Email is not configured' })
  }

  try {
    const resend = new Resend(RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `Portfolio enquiry: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nProject: ${subject}\n\nMessage:\n${message}\n\nSubmitted: ${new Date().toISOString()}`,
    })

    if (error) {
      console.error('Resend email error:', error.name)
      return json(502, { error: 'Unable to send email' })
    }

    return json(200, { ok: true })
  } catch (error) {
    console.error('Contact function error:', error.name)
    return json(500, { error: 'Unable to send email' })
  }
}
