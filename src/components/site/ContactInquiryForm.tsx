'use client';

import { FormEvent, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';

import { hasInquiryMessageContent } from '@/lib/contact-inquiry';

type ContactInquiryFormProps = {
	canSubmit: boolean;
	text: {
		nameLabel: string;
		namePlaceholder: string;
		companyLabel: string;
		companyPlaceholder: string;
		emailLabel: string;
		emailPlaceholder: string;
		phoneLabel: string;
		phonePlaceholder: string;
		websiteLabel: string;
		messageLabel: string;
		messagePlaceholder: string;
		messageTemplate: string;
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
	phone: string;
	message: string;
	website: string;
};

type ContactApiResponse =
	| { success: true; duplicate?: boolean }
	| {
			success: false;
			error?: 'INVALID_PAYLOAD' | 'EMPTY_MESSAGE' | 'DUPLICATE_SUBMISSION' | 'INVALID_EMAIL' | 'EMAIL_NOT_CONFIGURED' | 'CONTACT_DESTINATION_NOT_CONFIGURED' | 'SEND_FAILED';
	  };

const INITIAL_STATE: ContactFormState = {
	name: '',
	company: '',
	email: '',
	phone: '',
	message: '',
	website: '',
};

function FieldLabel({ children }: { children: React.ReactNode }) {
	return <span className="text-[0.62rem] font-semibold uppercase leading-none tracking-[0.32em] text-stone-400">{children}</span>;
}

export default function ContactInquiryForm({ canSubmit, text }: ContactInquiryFormProps) {
	const initialState = { ...INITIAL_STATE, message: text.messageTemplate };
	const [form, setForm] = useState<ContactFormState>(initialState);
	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const submissionPending = useRef(false);
	const errorMessages = text.errorMessages as Record<NonNullable<Extract<ContactApiResponse, { success: false }>['error']>, string>;

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!canSubmit || submissionPending.current) {
			return;
		}

		if (!hasInquiryMessageContent(form.message)) {
			setError(errorMessages.EMPTY_MESSAGE);
			setSuccessMessage(null);
			toast.error(errorMessages.EMPTY_MESSAGE, { id: 'contact-inquiry', position: 'top-center', description: undefined, duration: 8000 });
			return;
		}

		submissionPending.current = true;
		setIsPending(true);
		setError(null);
		setSuccessMessage(null);
		const toastId = toast.loading(text.submitPendingLabel, { id: 'contact-inquiry', position: 'top-center', description: undefined });

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
				const message = errorMessages[errorCode] ?? errorMessages.SEND_FAILED;
				setError(message);
				toast.error(message, { id: toastId, position: 'top-center', duration: 8000 });
				return;
			}

			if (result.duplicate) {
				setForm(initialState);
				setSuccessMessage(errorMessages.DUPLICATE_SUBMISSION);
				toast.info(errorMessages.DUPLICATE_SUBMISSION, { id: toastId, position: 'top-center', duration: 8000 });
				return;
			}

			setForm(initialState);
			setSuccessMessage(text.successLabel);
			toast.success(text.successLabel, { id: toastId, position: 'top-center', description: text.replyNotice, duration: 8000 });
		} catch {
			setError(errorMessages.SEND_FAILED);
			toast.error(errorMessages.SEND_FAILED, { id: toastId, position: 'top-center', duration: 8000 });
		} finally {
			submissionPending.current = false;
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

			<div className="grid gap-10 md:grid-cols-2 md:gap-12">
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
				<label className="flex flex-col items-start gap-1.5">
					<FieldLabel>{text.phoneLabel}</FieldLabel>
					<input
						type="tel"
						name="phone"
						autoComplete="tel"
						maxLength={50}
						value={form.phone}
						onChange={event => setForm(current => ({ ...current, phone: event.target.value }))}
						placeholder={text.phonePlaceholder}
						className="w-full border-0 border-b border-stone-300/60 bg-transparent px-0 py-3 text-base text-stone-900 placeholder:text-stone-400/80 focus:border-stone-900 focus:outline-none"
					/>
				</label>
			</div>

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
