'use client';

import { FormEvent, useState } from 'react';

type ContactInquiryFormProps = {
	canSubmit: boolean;
};

type ContactFormState = {
	name: string;
	company: string;
	email: string;
	message: string;
	website: string;
};

type ContactApiResponse =
	| { success: true; duplicate?: boolean }
	| {
			success: false;
			error?: 'INVALID_PAYLOAD' | 'DUPLICATE_SUBMISSION' | 'INVALID_EMAIL' | 'EMAIL_NOT_CONFIGURED' | 'CONTACT_DESTINATION_NOT_CONFIGURED' | 'SEND_FAILED';
	  };

const INITIAL_STATE: ContactFormState = {
	name: '',
	company: '',
	email: '',
	message: '',
	website: '',
};

const ERROR_MESSAGES = {
	INVALID_PAYLOAD: '이름, 이메일, 문의 내용을 다시 확인해 주세요.',
	DUPLICATE_SUBMISSION: '같은 문의가 이미 접수되어 한 번만 전달했습니다.',
	INVALID_EMAIL: '올바른 이메일 주소를 입력해 주세요.',
	EMAIL_NOT_CONFIGURED: '메일 전송 설정이 아직 완료되지 않았습니다.',
	CONTACT_DESTINATION_NOT_CONFIGURED: '수신 이메일이 아직 설정되지 않았습니다.',
	SEND_FAILED: '문의 메일 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
} satisfies Record<NonNullable<Extract<ContactApiResponse, { success: false }>['error']>, string>;

function FieldLabel({ children }: { children: React.ReactNode }) {
	return <span className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-stone-400">{children}</span>;
}

export default function ContactInquiryForm({ canSubmit }: ContactInquiryFormProps) {
	const [form, setForm] = useState<ContactFormState>(INITIAL_STATE);
	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!canSubmit || isPending) {
			return;
		}

		setIsPending(true);
		setError(null);
		setSuccessMessage(null);

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(form),
			});

			const result = (await response.json()) as ContactApiResponse;

			if (!response.ok || !result.success) {
				const errorCode = result.success ? 'SEND_FAILED' : (result.error ?? 'SEND_FAILED');
				setError(ERROR_MESSAGES[errorCode]);
				return;
			}

			if (result.duplicate) {
				setSuccessMessage(ERROR_MESSAGES.DUPLICATE_SUBMISSION);
				return;
			}

			setForm(INITIAL_STATE);
			setSuccessMessage('문의가 전송되었습니다. 확인 후 빠르게 답변드리겠습니다.');
		} catch {
			setError(ERROR_MESSAGES.SEND_FAILED);
		} finally {
			setIsPending(false);
		}
	}

	return (
		<form className="grid gap-10" onSubmit={handleSubmit}>
			<div className="grid gap-10 md:grid-cols-2 md:gap-12">
				<label className="grid gap-2">
					<FieldLabel>Name</FieldLabel>
					<input
						name="name"
						value={form.name}
						onChange={event => setForm(current => ({ ...current, name: event.target.value }))}
						placeholder="Your Name"
						className="border-0 border-b border-stone-300/60 bg-transparent px-0 py-3 text-base text-stone-900 placeholder:text-stone-400/80 focus:border-stone-900 focus:outline-none"
						required
					/>
				</label>

				<label className="grid gap-2">
					<FieldLabel>Company</FieldLabel>
					<input
						name="company"
						value={form.company}
						onChange={event => setForm(current => ({ ...current, company: event.target.value }))}
						placeholder="Organization"
						className="border-0 border-b border-stone-300/60 bg-transparent px-0 py-3 text-base text-stone-900 placeholder:text-stone-400/80 focus:border-stone-900 focus:outline-none"
					/>
				</label>
			</div>

			<label className="grid gap-2">
				<FieldLabel>Email Address</FieldLabel>
				<input
					type="email"
					name="email"
					value={form.email}
					onChange={event => setForm(current => ({ ...current, email: event.target.value }))}
					placeholder="email@address.com"
					className="border-0 border-b border-stone-300/60 bg-transparent px-0 py-3 text-base text-stone-900 placeholder:text-stone-400/80 focus:border-stone-900 focus:outline-none"
					required
				/>
			</label>

			<label className="hidden" aria-hidden="true">
				<FieldLabel>Website</FieldLabel>
				<input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={event => setForm(current => ({ ...current, website: event.target.value }))} />
			</label>

			<label className="grid gap-2">
				<FieldLabel>Message</FieldLabel>
				<textarea
					name="message"
					rows={6}
					value={form.message}
					onChange={event => setForm(current => ({ ...current, message: event.target.value }))}
					placeholder="Project details and inquiry"
					className="min-h-40 resize-none border-0 border-b border-stone-300/60 bg-transparent px-0 py-3 text-base text-stone-900 placeholder:text-stone-400/80 focus:border-stone-900 focus:outline-none"
					required
				/>
			</label>

			<div className="grid gap-4 pt-4">
				{canSubmit ? (
					<button
						type="submit"
						className="group inline-flex w-fit items-center gap-6 bg-[#274133] px-10 py-5 text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[#ccead6] transition hover:bg-stone-950 disabled:cursor-not-allowed disabled:opacity-60"
						disabled={isPending}>
						{isPending ? 'Sending...' : 'Submit Inquiry'}
						<span aria-hidden="true" className="text-sm transition group-hover:translate-x-1">
							↗
						</span>
					</button>
				) : (
					<p className="text-sm leading-7 text-stone-500">문의 수신 이메일 또는 메일 발신 설정이 아직 완료되지 않았습니다.</p>
				)}

				{error ? <p className="text-sm leading-7 text-red-700">{error}</p> : null}
				{successMessage ? <p className="text-sm leading-7 text-[#274133]">{successMessage}</p> : null}
				<p className="text-sm leading-7 text-stone-500">회신은 입력하신 이메일 주소로 보내드립니다.</p>
			</div>
		</form>
	);
}
