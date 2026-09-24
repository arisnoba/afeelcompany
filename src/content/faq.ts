import type { Locale } from '@/i18n/config';

type Localized<T> = Record<Locale, T>;
type FaqCategoryId = 'brand' | 'budget' | 'process' | 'agency' | 'results';

export type FaqEntry = {
	id: string;
	category: FaqCategoryId;
	published: boolean;
	// Internal review guidance only. Never rendered in the public page or JSON-LD.
	reviewNote?: string;
	content: Localized<{ question: string; answer: string[] }>;
};

export const FAQ_CATEGORIES: Array<{ id: FaqCategoryId; label: Localized<string> }> = [
	{ id: 'brand', label: { ko: '브랜드와 서비스', en: 'Brands & services', zh: '品牌与服务' } },
	{ id: 'budget', label: { ko: '비용과 협찬 방식', en: 'Budget & placement', zh: '费用与合作方式' } },
	{ id: 'process', label: { ko: '준비와 진행', en: 'Preparation & process', zh: '准备与流程' } },
	{ id: 'agency', label: { ko: '대행사 선택', en: 'Choosing an agency', zh: '选择合作公司' } },
	{ id: 'results', label: { ko: '결과와 이미지 활용', en: 'Results & image use', zh: '成果与图片使用' } },
];

// Edit Q/A here. Set published to false to hide an item in every language,
// including structured data. Array order controls order within each category.
export const FAQ_ENTRIES: FaqEntry[] = [
	{
		id: 'services', category: 'brand', published: true,
		content: {
			ko: { question: '어필컴퍼니는 어떤 일을 하나요?', answer: ['패션 브랜드와 셀럽이 자연스럽게 만날 수 있도록 PR과 스타일링 협찬을 돕고 있어요. 브랜드의 방향을 살펴보고, 어울리는 아티스트를 제안하며, 협찬 진행부터 공개된 노출 확인과 결과 정리까지 함께합니다.', '브랜드 포지셔닝, 미디어 노출 확인, 협업 기록 관리 등 필요한 업무를 상담에서 함께 정해요. 지금 가장 고민되는 부분부터 편하게 이야기해 주세요.'] },
			en: { question: 'What does AFEEL COMPANY do?', answer: ['We help fashion brands connect with celebrities through PR and styling placements. We review your brand, suggest suitable artists, and support placement coordination, confirmed exposure tracking, and reporting.', 'Together, we can agree on the support you need, from brand positioning to media tracking and collaboration records. Feel free to start with the challenge you are facing.'] },
			zh: { question: 'AFEEL COMPANY 提供哪些服务？', answer: ['我们通过公关与造型合作，帮助时尚品牌与艺人建立自然的连接。从了解品牌、推荐合适的艺人，到协调合作、确认公开曝光和整理成果，我们都会在约定范围内提供支持。', '品牌定位、媒体曝光追踪和合作记录管理等具体工作，可以在咨询时一起商定。欢迎先聊聊您目前最关心的问题。'] },
		},
	},
	{
		id: 'brand-fit', category: 'brand', published: true,
		reviewNote: '실제 취급하는 패션 카테고리와 협업 조건을 확인한 뒤 필요하면 구체화해 주세요.',
		content: {
			ko: { question: '어떤 패션 브랜드가 연예인 협찬에 잘 맞을까요?', answer: ['브랜드의 개성과 제품의 매력을 스타일링으로 보여주고 싶은 패션 브랜드라면 함께 가능성을 살펴볼 수 있어요. 규모보다는 제품의 분위기와 협찬을 통해 이루고 싶은 목표가 중요합니다.', '브랜드 소개와 대표 제품을 보내주시면 어울리는 협업 방향을 검토할 수 있어요. 특정 아티스트나 노출 방식이 정해져 있지 않아도 괜찮습니다.'] },
			en: { question: 'Which fashion brands are a good fit for celebrity placement?', answer: ['Celebrity placement may suit fashion brands that want to express their identity through styling. Your products and goals matter more than the size of the brand.', 'Share your brand introduction and key products so we can explore a suitable direction. You do not need to have a particular artist or type of exposure in mind.'] },
			zh: { question: '什么样的时尚品牌适合开展艺人合作？', answer: ['如果您希望通过造型展现品牌个性和产品魅力，我们可以一起探讨合作的可能性。相比品牌规模，产品风格和合作目标更值得先了解。', '您可以先提供品牌介绍和代表产品。即使还没有确定艺人或曝光形式，也可以开始沟通。'] },
		},
	},
	{
		id: 'new-brands', category: 'brand', published: true,
		reviewNote: '신생 브랜드의 실제 수용 조건, 룩북과 샘플 최소 요건을 검토해 주세요.',
		content: {
			ko: { question: '이제 막 시작한 브랜드도 상담할 수 있나요?', answer: ['네, 준비 중인 제품과 브랜드 방향을 바탕으로 상담을 시작할 수 있어요. 룩북이 많지 않다면 제품 사진이나 소개 자료처럼 현재 준비된 내용을 먼저 보내주세요.', '실제 협찬 가능 여부는 제품의 완성도, 제공할 수 있는 샘플과 일정 등을 살펴본 뒤 안내해 드립니다. 상담하면서 필요한 준비 사항도 함께 정리해요.'] },
			en: { question: 'Can a newly launched brand get in touch?', answer: ['Yes. We can begin with the products and brand direction you have so far. If you do not have a full lookbook, product photos or an introduction are a useful starting point.', 'Placement options depend on the products, available samples, and timing. We can review these together and clarify what you may need to prepare.'] },
			zh: { question: '刚起步的品牌也可以咨询吗？', answer: ['可以。我们可以从您现有的产品和品牌方向开始了解。还没有完整的造型册也没关系，先提供产品照片或品牌资料即可。', '具体能否开展合作，需要结合产品完成度、可提供的样品和时间安排判断。沟通时，我们会一起梳理需要准备的内容。'] },
		},
	},
	{
		id: 'pricing', category: 'budget', published: true,
		reviewNote: '월 계약, 건별 계약, 최소 예산 등 실제 운영 조건은 확정 후 추가해 주세요. 원문의 시장 가격은 반영하지 않았습니다.',
		content: {
			ko: { question: '패션 PR과 연예인 협찬 비용은 어떻게 정해지나요?', answer: ['비용은 진행 기간과 제품 수, 필요한 업무 범위에 따라 달라져요. 브랜드가 원하는 방향과 예산을 먼저 듣고, 어떤 범위로 진행할 수 있을지 함께 살펴봅니다.', '희망 일정과 주력 제품, 필요한 지원을 알려주시면 상담이 한결 수월해요. 별도 비용이 생길 수 있는 업무는 진행 전에 포함 여부를 확인해 주세요.'] },
			en: { question: 'How is fashion PR and celebrity placement priced?', answer: ['Costs depend on the duration, number of products, and scope of work. We start with your goals and budget, then discuss what level of support would fit.', 'Sharing your preferred schedule, key products, and required support makes the conversation easier. Please confirm which services and any additional costs are included before proceeding.'] },
			zh: { question: '时尚公关与艺人合作的费用如何确定？', answer: ['费用会根据合作周期、产品数量和工作范围有所不同。我们会先了解您的目标与预算，再一起讨论适合的服务范围。', '提前提供希望的时间安排、主推产品和所需支持，有助于更顺畅地沟通。涉及额外费用的工作，请在开始前确认是否包含在方案内。'] },
		},
	},
	{
		id: 'placement-types', category: 'budget', published: true,
		reviewNote: '보장형 PPL을 실제 취급하는지 확인해 주세요. 현재 답변은 방식의 차이만 설명하며 제공을 약속하지 않습니다.',
		content: {
			ko: { question: '스타일링 협찬과 노출을 약정하는 PPL은 어떻게 다른가요?', answer: ['스타일링 협찬은 제품과 촬영 분위기, 아티스트의 스타일이 맞을 때 착용으로 이어지는 방식이에요. 제품을 전달했다고 해서 특정 아티스트의 착용이나 공개 시점, 노출 횟수가 확정되는 것은 아닙니다.', '노출 조건을 미리 정하는 PPL은 계약에 따라 진행 범위가 달라요. 원하시는 방식이 있다면 문의할 때 알려주세요. 실제 진행 가능 여부와 조건을 먼저 확인하는 것이 좋습니다.'] },
			en: { question: 'How does styling placement differ from contracted product placement?', answer: ['Styling placement depends on how a product fits the artist, styling direction, and shoot. Providing a product does not by itself confirm who will wear it, when it will appear, or how often.', 'For product placement with agreed exposure terms, the contract defines the scope. Let us know your preferred approach so availability and conditions can be checked first.'] },
			zh: { question: '造型合作与约定曝光条件的植入有什么区别？', answer: ['造型合作取决于产品是否适合艺人、造型方向和拍摄场景。提供产品，并不代表已确定由哪位艺人穿着、何时公开或曝光几次。', '约定曝光条件的植入，需要按具体合同确认工作范围。如果您有倾向的方式，欢迎在咨询时说明，先确认能否执行以及相应条件。'] },
		},
	},
	{
		id: 'workflow', category: 'process', published: true,
		reviewNote: '평균 소요 기간과 쇼룸 입고 절차는 확정된 정보가 없어 제외했습니다.',
		content: {
			ko: { question: '의뢰 후 협찬은 어떤 순서로 진행되나요? 얼마나 걸리나요?', answer: ['브랜드와 목표를 살펴본 뒤 아티스트 매칭, 협찬 실행, 공개 노출 확인, 결과 정리 순서로 진행해요. 제품 핸들링과 일정 등 세부 사항은 협의한 범위에 맞춰 조율합니다.', '착용과 공개까지 걸리는 시간은 아티스트 활동과 촬영 일정, 제품 준비 상황에 따라 달라져요. 시즌 출시나 캠페인처럼 맞추고 싶은 일정이 있다면 상담할 때 먼저 알려주세요.'] },
			en: { question: 'What happens after an inquiry, and how long does placement take?', answer: ['We review the brand and goals, then move through artist matching, placement coordination, confirmed exposure tracking, and reporting. Product handling and schedules are coordinated within the agreed scope.', 'Timing depends on artist activities, production schedules, and product readiness. If you have a launch or campaign date in mind, please share it early in the conversation.'] },
			zh: { question: '咨询后如何推进合作？通常需要多久？', answer: ['我们先了解品牌与目标，再依次进行艺人匹配、合作执行、公开曝光确认和成果整理。产品流转和具体时间会在约定范围内协调。', '从合作到公开露出的时间，取决于艺人活动、拍摄安排和产品准备情况。如果需要配合上新或推广节点，请在咨询时提前告诉我们。'] },
		},
	},
	{
		id: 'preparation', category: 'process', published: true,
		content: {
			ko: { question: '상담이나 협찬 전에 무엇을 준비하면 좋을까요?', answer: ['브랜드 소개, 제품 사진이나 룩북, 주력 제품 정보와 희망 일정을 준비해 주세요. 목표 고객이나 원하는 아티스트, 노출 방향이 있다면 함께 알려주셔도 좋아요.', '협찬에 사용할 샘플의 사이즈, 수량, 전달 가능 일정도 확인해 두면 도움이 됩니다. 필요한 자료와 샘플 조건은 제품과 진행 방식에 맞춰 함께 정리해 드릴게요.'] },
			en: { question: 'What should we prepare before an inquiry or placement?', answer: ['A brand introduction, product photos or lookbook, key product details, and your preferred schedule are helpful. You can also share your target audience, preferred artists, or exposure goals.', 'Please check sample sizes, quantities, and availability. We can clarify the materials and sample requirements together based on your products and the proposed scope.'] },
			zh: { question: '咨询或合作前需要准备什么？', answer: ['建议准备品牌介绍、产品照片或造型册、主推产品资料，以及希望的时间安排。如果有目标客群、意向艺人或曝光方向，也欢迎一起分享。', '提前确认样品尺码、数量和可提供的时间也会有所帮助。具体资料和样品要求，可以根据产品与合作方式一起梳理。'] },
		},
	},
	{
		id: 'agency-selection', category: 'agency', published: true,
		reviewNote: '브랜드 상담용 일반 질문입니다. 자사 FAQ에 불필요하다면 published를 false로 바꿔 주세요.',
		content: {
			ko: { question: '패션 PR 대행사를 선택할 때 무엇을 살펴보면 좋을까요?', answer: ['우리 브랜드와 비슷한 방향의 협업 사례가 있는지, 실제로 어떤 일을 맡아주는지부터 살펴보세요. 포트폴리오의 아티스트 이름뿐 아니라 제품과 스타일링이 어떻게 연결됐는지도 함께 보면 도움이 됩니다.', '연락 방식, 샘플 관리, 결과 공유 방법, 계약에 포함된 업무를 상담에서 확인해 보세요. 브랜드가 기대하는 부분과 대행사가 맡는 범위가 잘 맞는지가 중요해요.'] },
			en: { question: 'What should we look for when choosing a fashion PR agency?', answer: ['Look for relevant collaborations and a clear description of the work the agency will handle. Beyond artist names, consider how the products and styling fit together in its portfolio.', 'Ask about communication, sample handling, reporting, and the services included in the agreement. A good fit starts with shared expectations about the scope.'] },
			zh: { question: '选择时尚公关公司时，可以关注哪些方面？', answer: ['可以先看是否有与品牌方向相近的合作案例，以及对方具体负责哪些工作。除了艺人名字，也值得看看案例中产品与造型是如何结合的。', '沟通方式、样品管理、成果反馈和合同包含的工作，都可以在咨询时确认。品牌的期待与公司的服务范围是否匹配，是很重要的一点。'] },
		},
	},
	{
		id: 'approach', category: 'agency', published: true,
		content: {
			ko: { question: '어필컴퍼니는 스타일링 협찬에서 무엇을 중요하게 보나요?', answer: ['브랜드의 분위기와 아티스트의 스타일이 자연스럽게 어울리는지를 먼저 봅니다. 노출 자체뿐 아니라 제품이 어떤 맥락에서 보여지는지도 함께 고민해요.', '진행 후에는 협의한 채널에서 확인된 노출을 기록하고, 결과와 후속 검토에 필요한 자료를 정리합니다. 실제 협업 사례는 포트폴리오에서 확인하실 수 있어요.'] },
			en: { question: 'What does AFEEL COMPANY focus on in styling placements?', answer: ['We start with how naturally the brand and the artist fit together. The context in which a product appears matters alongside the exposure itself.', 'After the placement, we document confirmed exposure across the agreed channels and organize materials for review. You can explore examples of our collaborations in the portfolio.'] },
			zh: { question: 'AFEEL COMPANY 在造型合作中重视什么？', answer: ['我们会先看品牌气质与艺人风格是否自然契合。除了曝光本身，也会考虑产品在什么场景中被看到。', '合作后，我们记录约定渠道中已确认的曝光，并整理成果与后续复盘所需的资料。您可以在作品集中了解具体案例。'] },
		},
	},
	{
		id: 'image-usage', category: 'results', published: true,
		reviewNote: '권리 계약 대행 여부를 확인해 주세요. 라이선스 서비스나 재공유의 적법성을 일괄 보장하지 않는 안내로 작성했습니다.',
		content: {
			ko: { question: '연예인 착용 사진을 자사몰이나 SNS에 사용해도 되나요?', answer: ['협찬으로 공개된 사진이라도 브랜드가 자유롭게 사용할 수 있는 것은 아니에요. 사진의 이용 허락과 인물의 초상 사용 등 확인할 사항이 있어, 사용하려는 채널과 목적에 맞춰 권리 범위를 먼저 확인해야 합니다.', '자사몰 상세페이지, 배너, 유료 광고 등에 쓰고 싶다면 이미지 출처와 활용 매체, 기간을 정리해 권리자와 사용 조건을 확인해 주세요. 출처를 적거나 SNS 공유 기능을 사용하는 것만으로 모든 활용이 허용되는 것은 아닙니다.'] },
			en: { question: 'Can we use celebrity placement photos on our website or social media?', answer: ['A photo being published after a placement does not automatically allow a brand to reuse it. Image permissions and the rights relating to the person shown need to be checked for the intended channel and purpose.', 'For product pages, banners, or paid ads, confirm the source, channels, duration, and usage terms with the relevant rights holders. Attribution or a social sharing feature does not by itself authorize every use.'] },
			zh: { question: '艺人穿着照片可以用于品牌网站或社交媒体吗？', answer: ['合作照片已经公开，并不代表品牌可以自由使用。需要结合使用渠道与目的，先确认照片授权、人物肖像使用等相关权利范围。', '如果计划用于商品详情页、横幅或付费广告，请整理图片来源、使用渠道和期限，并与相关权利人确认条件。标明出处或使用社交分享功能，也不代表所有用途都已获得许可。'] },
		},
	},
	{
		id: 'reporting', category: 'results', published: true,
		reviewNote: '매출, 유입, 검색량 분석을 제공하는지 확인해 주세요. 현재 답변은 공개 노출 기록과 별도 데이터 검토를 구분합니다.',
		content: {
			ko: { question: '협찬 결과는 어떻게 확인하나요? 매출 효과도 알 수 있나요?', answer: ['협의한 채널에서 확인된 미디어 노출과 공개 반응을 기록하고, 협업 결과를 정리해 공유합니다. 어떤 제품이 어떤 맥락에서 보여졌는지 살펴보며 다음 PR 활동을 검토할 수 있어요.', '매출이나 구매 전환은 노출 기록만으로 판단하기 어려워요. 브랜드가 보유한 방문, 검색, 구매 데이터가 있다면 함께 검토할 범위를 먼저 협의해 주세요. 결과를 어떤 기준으로 확인할지도 시작 전에 맞춰두면 좋습니다.'] },
			en: { question: 'How are results reported, and can we assess sales impact?', answer: ['We document confirmed media exposure and public responses across the agreed channels, then share the collaboration results. These records help you understand how products appeared and consider future PR activities.', 'Exposure records alone cannot establish sales or conversion impact. If your brand has traffic, search, or purchase data, please discuss the scope of any further review in advance and agree on how results will be assessed.'] },
			zh: { question: '如何查看合作成果？能了解销售效果吗？', answer: ['我们记录约定渠道中已确认的媒体曝光与公开反馈，并整理合作成果。品牌可以了解产品的露出场景，为后续公关活动提供参考。', '仅凭曝光记录，很难判断销售或转化效果。如果品牌有访问、搜索或购买数据，请提前沟通进一步分析的范围，也可以在开始前一起确定成果评估方式。'] },
		},
	},
];

export function getPublishedFaqGroups(locale: Locale) {
	return FAQ_CATEGORIES.map(category => ({
		id: category.id,
		label: category.label[locale],
		items: FAQ_ENTRIES.filter(item => item.published && item.category === category.id).map(item => ({
			id: item.id,
			...item.content[locale],
		})),
	})).filter(category => category.items.length > 0);
}

export const FAQ_PAGE_COPY = {
	ko: {
		title: '패션 PR과 연예인 협찬 FAQ',
		description: '패션 브랜드 PR과 연예인 스타일링 협찬에 관해 자주 묻는 질문을 모았습니다. 비용, 준비 사항, 진행 과정, 결과 확인과 이미지 활용을 안내합니다.',
		heading: 'Frequently \nAsked Questions.',
		intro: '함께하기 전, 담당자분들이 자주 물어보시는 내용을 모았어요.',
		categoryLabel: 'Explore a topic',
	},
	en: {
		title: 'Fashion PR & Celebrity Placement FAQ',
		description: 'Answers to common questions about fashion PR, celebrity styling placements, budgets, preparation, reporting, and image use.',
		heading: 'Frequently \nAsked Questions.',
		intro: 'Here are a few questions brand teams often ask before we work together.',
		categoryLabel: 'Explore a topic',
	},
	zh: {
		title: '时尚公关与艺人合作常见问题',
		description: '了解时尚公关与艺人造型合作的常见问题，包括费用、准备事项、合作流程、成果反馈和图片使用。',
		heading: '常见问题',
		intro: '开始合作前，我们整理了品牌负责人经常问到的问题。',
		categoryLabel: '选择您关心的话题',
	},
} satisfies Localized<Record<string, string>>;
