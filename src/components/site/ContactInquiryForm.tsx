'use client';

import { FormEvent, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

type ContactInquiryFormProps = {
	canSubmit: boolean;
	text: {
		nameLabel: string;
		namePlaceholder: string;
		companyLabel: string;
		companyPlaceholder: string;
		emailLabel: string;
		emailPlaceholder: string;
		websiteLabel: string;
		messageLabel: string;
		messagePlaceholder: string;
		submitIdleLabel: string;
		submitPendingLabel: string;
		replyNotice: string;
		unavailableNotice: string;
		successLabel: string;
		errorMessages: Record<string, string>;
	};
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

function FieldLabel({ children }: { children: React.ReactNode }) {
	return <span className="text-[0.62rem] font-semibold uppercase leading-none tracking-[0.32em] text-stone-400">{children}</span>;
}

export default function ContactInquiryForm({ canSubmit, text }: ContactInquiryFormProps) {
	const [form, setForm] = useState<ContactFormState>(INITIAL_STATE);
	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const errorMessages = text.errorMessages as Record<NonNullable<Extract<ContactApiResponse, { success: false }>['error']>, string>;

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
				setError(errorMessages[errorCode]);
				return;
			}

			if (result.duplicate) {
				setSuccessMessage(errorMessages.DUPLICATE_SUBMISSION);
				return;
			}

			setForm(INITIAL_STATE);
			setSuccessMessage(text.successLabel);
		} catch {
			setError(errorMessages.SEND_FAILED);
		} finally {
			setIsPending(false);
		}
	}

	return (
		<form className="grid gap-10" onSubmit={handleSubmit}>
			<div className="grid gap-10 md:grid-cols-2 md:gap-12">
				<label className="flex flex-col items-start gap-1.5">
					<FieldLabel>{text.nameLabel}</FieldLabel>
					<input
						name="name"
						value={form.name}
						onChange={event => setForm(current => ({ ...current, name: event.target.value }))}
						placeholder={text.namePlaceholder}
						className="w-full border-0 border-b border-stone-300/60 bg-transparent px-0 py-3 text-base text-stone-900 placeholder:text-stone-400/80 focus:border-stone-900 focus:outline-none"
						required
					/>
				</label>

				<label className="flex flex-col items-start gap-1.5">
					<FieldLabel>{text.companyLabel}</FieldLabel>
					<input
						name="company"
						value={form.company}
						onChange={event => setForm(current => ({ ...current, company: event.target.value }))}
						placeholder={text.companyPlaceholder}
						className="w-full border-0 border-b border-stone-300/60 bg-transparent px-0 py-3 text-base text-stone-900 placeholder:text-stone-400/80 focus:border-stone-900 focus:outline-none"
					/>
				</label>
			</div>

			<label className="flex flex-col items-start gap-1.5">
				<FieldLabel>{text.emailLabel}</FieldLabel>
				<input
					type="email"
					name="email"
					value={form.email}
					onChange={event => setForm(current => ({ ...current, email: event.target.value }))}
					placeholder={text.emailPlaceholder}
					className="w-full border-0 border-b border-stone-300/60 bg-transparent px-0 py-3 text-base text-stone-900 placeholder:text-stone-400/80 focus:border-stone-900 focus:outline-none"
					required
				/>
			</label>

			<label className="hidden" aria-hidden="true">
				<FieldLabel>{text.websiteLabel}</FieldLabel>
				<input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={event => setForm(current => ({ ...current, website: event.target.value }))} />
			</label>

			<label className="flex flex-col items-start gap-1.5">
				<FieldLabel>{text.messageLabel}</FieldLabel>
				<textarea
					name="message"
					rows={6}
					value={form.message}
					onChange={event => setForm(current => ({ ...current, message: event.target.value }))}
					placeholder={text.messagePlaceholder}
					className="min-h-40 w-full resize-none border-0 border-b border-stone-300/60 bg-transparent px-0 py-3 text-base text-stone-900 placeholder:text-stone-400/80 focus:border-stone-900 focus:outline-none"
					required
				/>
			</label>

			<div className="grid gap-4 pt-4">
				{canSubmit ? (
					<button
						type="submit"
						className="group inline-flex w-fit items-center gap-6 bg-[#274133] px-10 py-5 text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[#ccead6] transition hover:bg-stone-950 disabled:cursor-not-allowed disabled:opacity-60"
						disabled={isPending}>
						{isPending ? text.submitPendingLabel : text.submitIdleLabel}
						<ArrowUpRight className="size-4 opacity-70 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
					</button>
				) : (
					<p className="text-sm leading-7 text-stone-500">{text.unavailableNotice}</p>
				)}

				{error ? <p className="text-sm leading-7 text-red-700">{error}</p> : null}
				{successMessage ? <p className="text-sm leading-7 text-[#274133]">{successMessage}</p> : null}
				<p className="text-sm leading-7 text-stone-500">{text.replyNotice}</p>
			</div>
		</form>
	);
}
