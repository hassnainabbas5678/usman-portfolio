import { Resend } from 'resend'

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
})

const classifyResendError = (error) => {
  const detail = `${error?.name || ''} ${error?.message || ''}`.toLowerCase()

  if (/(api key|unauthorized|authentication|forbidden)/.test(detail)) return 'RESEND_AUTHENTICATION_FAILED'
  if (/(sender|from|domain|verified)/.test(detail)) return 'RESEND_SENDER_REJECTED'
  if (/(recipient|to address|destination)/.test(detail)) return 'RESEND_RECIPIENT_REJECTED'
  return 'RESEND_REQUEST_REJECTED'
}

export const handler = async (event) => {
  console.info('contact_request_received', { method: event.httpMethod })

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' })
  }

  let form
  try {
    form = JSON.parse(event.body || '{}')
  } catch {
    console.warn('contact_request_invalid_json')
    return json(400, { error: 'Invalid form data', code: 'INVALID_JSON' })
  }

  const name = String(form.name || '').trim()
  const email = String(form.email || '').trim()
  const subject = String(form.subject || '').trim()
  const message = String(form.message || '').trim()

  if (!name || !email || !subject || !message || !/^\S+@\S+\.\S+$/.test(email)) {
    console.warn('contact_request_invalid_fields', {
      hasName: Boolean(name), hasEmail: Boolean(email), hasSubject: Boolean(subject), hasMessage: Boolean(message),
    })
    return json(400, { error: 'Invalid form data', code: 'INVALID_FORM_DATA' })
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env
  const missingVariables = [
    ['RESEND_API_KEY', RESEND_API_KEY],
    ['CONTACT_TO_EMAIL', CONTACT_TO_EMAIL],
    ['CONTACT_FROM_EMAIL', CONTACT_FROM_EMAIL],
  ].filter(([, value]) => !value).map(([name]) => name)

  if (missingVariables.length) {
    console.error('contact_configuration_missing', { missingVariables })
    return json(503, { error: 'Email is not configured', code: 'EMAIL_CONFIGURATION_MISSING' })
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
      const code = classifyResendError(error)
      console.error('contact_resend_rejected', {
        code,
        name: error.name,
        message: error.message,
        statusCode: error.statusCode,
      })
      return json(502, { error: 'Unable to send email', code })
    }

    console.info('contact_email_sent')
    return json(200, { ok: true })
  } catch (error) {
    const code = classifyResendError(error)
    console.error('contact_function_failure', {
      code,
      name: error?.name,
      message: error?.message,
      statusCode: error?.statusCode,
    })
    return json(500, { error: 'Unable to send email', code })
  }
}
