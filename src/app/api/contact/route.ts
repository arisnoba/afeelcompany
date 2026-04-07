import { createHash } from 'node:crypto'

import { getSiteCompanyProfile } from '@/lib/site'
import { resend } from '@/lib/resend'

type ContactRequestPayload = {
	name?: string
	company?: string
	email?: string
	message?: string
	website?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DUPLICATE_WINDOW_MS = 2 * 60 * 1000

type ContactSubmissionStore = Map<string, number>

declare global {
	var __contactSubmissionStore: ContactSubmissionStore | undefined
}

const contactSubmissionStore =
	globalThis.__contactSubmissionStore ?? new Map<string, number>()

globalThis.__contactSubmissionStore = contactSubmissionStore

function normalizeField(value: unknown, maxLength: number) {
	return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function normalizeForFingerprint(value: string) {
	return value.trim().replaceAll(/\s+/g, ' ').toLowerCase()
}

function escapeHtml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;')
}

function pruneExpiredSubmissions(now: number) {
	for (const [fingerprint, submittedAt] of contactSubmissionStore) {
		if (now - submittedAt >= DUPLICATE_WINDOW_MS) {
			contactSubmissionStore.delete(fingerprint)
		}
	}
}

function buildSubmissionFingerprint({
	name,
	company,
	email,
	message,
}: {
	name: string
	company: string
	email: string
	message: string
}) {
	const normalizedPayload = JSON.stringify({
		name: normalizeForFingerprint(name),
		company: normalizeForFingerprint(company),
		email: normalizeForFingerprint(email),
		message: normalizeForFingerprint(message),
	})

	return createHash('sha256').update(normalizedPayload).digest('hex')
}

export async function POST(request: Request): Promise<Response> {
	const body = (await request.json()) as ContactRequestPayload

	const name = normalizeField(body.name, 100)
	const company = normalizeField(body.company, 100)
	const email = normalizeField(body.email, 200)
	const message = normalizeField(body.message, 5000)
	const website = normalizeField(body.website, 500)

	if (website) {
		return Response.json({ success: true })
	}

	if (!name || !email || !message) {
		return Response.json({ success: false, error: 'INVALID_PAYLOAD' }, { status: 400 })
	}

	if (!EMAIL_PATTERN.test(email)) {
		return Response.json({ success: false, error: 'INVALID_EMAIL' }, { status: 400 })
	}

	const submittedAt = Date.now()
	pruneExpiredSubmissions(submittedAt)

	const submissionFingerprint = buildSubmissionFingerprint({
		name,
		company,
		email,
		message,
	})

	const previousSubmittedAt = contactSubmissionStore.get(submissionFingerprint)
	if (previousSubmittedAt && submittedAt - previousSubmittedAt < DUPLICATE_WINDOW_MS) {
		return Response.json({ success: true, duplicate: true })
	}

	contactSubmissionStore.set(submissionFingerprint, submittedAt)

	const fromEmail = process.env.RESEND_FROM_EMAIL?.trim()
	if (!resend || !fromEmail) {
		contactSubmissionStore.delete(submissionFingerprint)
		return Response.json({ success: false, error: 'EMAIL_NOT_CONFIGURED' }, { status: 500 })
	}

	const profile = await getSiteCompanyProfile()
	const toEmail = profile.contactEmail.trim()

	if (!toEmail) {
		contactSubmissionStore.delete(submissionFingerprint)
		return Response.json({ success: false, error: 'CONTACT_DESTINATION_NOT_CONFIGURED' }, { status: 500 })
	}

	const escapedName = escapeHtml(name)
	const escapedCompany = escapeHtml(company || '-')
	const escapedEmail = escapeHtml(email)
	const escapedMessage = escapeHtml(message).replaceAll('\n', '<br />')

	const { error } = await resend.emails.send({
		from: fromEmail,
		to: [toEmail],
		replyTo: email,
		subject: `[AFEEL 문의] ${name}`,
		text: [
			'AFEEL 웹사이트 문의가 도착했습니다.',
			`이름: ${name}`,
			`회사명: ${company || '-'}`,
			`이메일: ${email}`,
			'',
			'[문의 내용]',
			message,
		].join('\n'),
		html: `
			<div style="background:#f5f3ef;padding:32px 20px;font-family:Arial,sans-serif;color:#171717;">
				<div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e7e1d8;padding:32px;">
					<p style="margin:0 0 8px;font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:#715a3e;">AFEEL Contact</p>
					<h1 style="margin:0 0 24px;font-size:28px;line-height:1.2;font-weight:600;">웹사이트 문의가 도착했습니다.</h1>
					<table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
						<tr>
							<td style="padding:10px 0;border-bottom:1px solid #eee7de;font-size:13px;color:#7b776f;">이름</td>
							<td style="padding:10px 0;border-bottom:1px solid #eee7de;font-size:15px;color:#171717;">${escapedName}</td>
						</tr>
						<tr>
							<td style="padding:10px 0;border-bottom:1px solid #eee7de;font-size:13px;color:#7b776f;">회사명</td>
							<td style="padding:10px 0;border-bottom:1px solid #eee7de;font-size:15px;color:#171717;">${escapedCompany}</td>
						</tr>
						<tr>
							<td style="padding:10px 0;border-bottom:1px solid #eee7de;font-size:13px;color:#7b776f;">이메일</td>
							<td style="padding:10px 0;border-bottom:1px solid #eee7de;font-size:15px;color:#171717;">${escapedEmail}</td>
						</tr>
					</table>
					<div style="font-size:13px;color:#7b776f;margin-bottom:8px;">문의 내용</div>
					<div style="font-size:15px;line-height:1.7;color:#171717;white-space:normal;">${escapedMessage}</div>
				</div>
			</div>
		`,
	})

	if (error) {
		contactSubmissionStore.delete(submissionFingerprint)
		return Response.json({ success: false, error: 'SEND_FAILED' }, { status: 502 })
	}

	return Response.json({ success: true })
}
