import Link from 'next/link';
import { LayoutDashboard, Image, Users, Camera, FileText, Settings, UserCircle, PlusCircle, ArrowRight } from 'lucide-react';
import { getDashboardStats } from '@/lib/admin';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
	const stats = await getDashboardStats();

	const PRIMARY_CARDS = [
		{
			href: '/admin/portfolio',
			title: '포트폴리오 관리',
			description: '전체 포트폴리오 항목을 관리하고 노출 여부를 설정합니다.',
			icon: Image,
			metrics: [
				{ label: '전체', value: stats.portfolio.total },
				{ label: '웹 노출', value: stats.portfolio.webVisible },
				{ label: 'PDF 노출', value: stats.portfolio.pdfVisible },
			],
			color: 'text-blue-600',
			bgColor: 'bg-blue-50',
		},
		{
			href: '/admin/clients',
			title: '클라이언트 관리',
			description: '브랜드 로고와 링크를 관리합니다.',
			icon: Users,
			metrics: [
				{ label: '전체 브랜드', value: stats.clients.total },
				{ label: '활성 브랜드', value: stats.clients.active },
			],
			color: 'text-emerald-600',
			bgColor: 'bg-emerald-50',
		},
	];

	const SECONDARY_CARDS = [
		{
			href: '/admin/pdf-export',
			title: 'PDF 익스포트',
			description: '포트폴리오 브로셔를 PDF로 생성하고 다운로드합니다.',
			icon: FileText,
			color: 'text-orange-600',
			bgColor: 'bg-orange-50',
		},
		{
			href: '/admin/profile',
			title: '회사 프로필',
			description: '웹과 PDF에 표시될 회사 정보를 수정합니다.',
			icon: Settings,
			color: 'text-stone-600',
			bgColor: 'bg-stone-50',
		},
		{
			href: '/admin/accounts',
			title: '계정 관리',
			description: '관리자 접속 계정을 관리합니다.',
			icon: UserCircle,
			color: 'text-indigo-600',
			bgColor: 'bg-indigo-50',
		},
	];

	return (
		<div className="grid gap-8">
			{/* Top Hero Stats */}
			<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<MetricSummaryCard title="신규 포트폴리오 (7일)" value={stats.portfolio.recent} unit="건" description="최근 일주일 내 등록됨" />
				<MetricSummaryCard title="웹 노출 비율" value={Math.round((stats.portfolio.webVisible / (stats.portfolio.total || 1)) * 100)} unit="%" description="전체 대비 웹 공개 중" />
				<MetricSummaryCard title="PDF 노출 비율" value={Math.round((stats.portfolio.pdfVisible / (stats.portfolio.total || 1)) * 100)} unit="%" description="전체 대비 PDF 포함 중" />
				<Link
					href="/admin/upload"
					className="group relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-stone-200 bg-white p-6 transition-all hover:border-stone-900/10 hover:bg-stone-50">
					<PlusCircle className="size-8 text-stone-400 transition-transform group-hover:scale-110 group-hover:text-stone-900" />
					<span className="text-sm font-semibold text-stone-600 group-hover:text-stone-900">새 포트폴리오 업로드</span>
				</Link>
			</section>

			{/* Row 1: Primary Features (2 Columns) */}
			<section className="grid gap-6 md:grid-cols-2">
				{PRIMARY_CARDS.map(card => (
					<DashboardCard key={card.href} card={card} />
				))}
			</section>

			{/* Row 2: Secondary Features (3 Columns) */}
			<section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{SECONDARY_CARDS.map(card => (
					<DashboardCard key={card.href} card={card} />
				))}
			</section>
		</div>
	);
}

function DashboardCard({ card }: { card: any }) {
	return (
		<Link
			href={card.href}
			className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 transition-all hover:border-stone-900/10 hover:shadow-sm">
			<div className="flex flex-col gap-4">
				<div className={cn('flex size-12 items-center justify-center rounded-xl', card.bgColor)}>
					<card.icon className={cn('size-6', card.color)} />
				</div>
				<div>
					<h3 className="text-lg font-bold text-stone-900">{card.title}</h3>
					<p className="mt-1 text-sm leading-relaxed text-stone-500">{card.description}</p>
				</div>

				{card.metrics && (
					<div className="mt-2 flex flex-wrap gap-4 border-t border-stone-100 pt-4">
						{card.metrics.map((metric: any) => (
							<div key={metric.label} className="grid gap-0.5">
								<span className="text-[0.62rem] font-bold uppercase tracking-wider text-stone-400">{metric.label}</span>
								<span className="text-sm font-semibold text-stone-900">{metric.value}</span>
							</div>
						))}
					</div>
				)}
			</div>
			<div className="mt-6 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-400 transition-colors group-hover:text-stone-900">
				관리하기 <ArrowRight className="size-3" />
			</div>
		</Link>
	);
}

function MetricSummaryCard({ title, value, unit, description }: { title: string; value: number | string; unit: string; description: string }) {
	return (
		<div className="rounded-2xl border border-stone-200 bg-white p-5">
			<p className="text-[0.65rem] font-bold uppercase tracking-wider text-stone-400">{title}</p>
			<div className="mt-2 flex items-baseline gap-1">
				<span className="text-3xl font-black text-stone-900">{value}</span>
				<span className="text-sm font-medium text-stone-500">{unit}</span>
			</div>
			<p className="mt-1 text-[0.68rem] text-stone-400">{description}</p>
		</div>
	);
}
