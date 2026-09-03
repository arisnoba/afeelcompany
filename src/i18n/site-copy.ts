import type { Locale } from '@/i18n/config';

type NavKey = 'home' | 'about' | 'partner' | 'portfolio' | 'contact';

type WorkflowStep = {
	label: string;
	title: string;
	description: string;
};

type ServiceItem = {
	title: string;
	headline: string;
	description: string;
};

type EdgeItem = {
	title: string;
	headline: string;
	description: string;
};

type FaqItem = {
	question: string;
	answer: string;
};

type SiteDictionary = {
	siteName: string;
	nav: Record<NavKey, string>;
	languageSwitcherLabel: string;
	menuOpenLabel: string;
	menuCloseLabel: string;
	footer: {
		descriptionFallback: string;
		addressLabel: string;
		inquiriesLabel: string;
		siteLabel: string;
		connectLabel: string;
		pendingLabel: string;
		digitalArchiveLabel: string;
	};
	home: {
		metadata: {
			title: string;
			description: string;
			keywords: string[];
		};
		heroBadge: string;
		heroTitleLines: Array<{ text: string; className?: string }>;
		overviewEyebrow: string;
		overviewTitle: string;
		overviewDescription: string;
		overviewLinkLabel: string;
		selectedWorkTitle: string;
		clientsTitle: string;
		portfolioLinkLabel: string;
		emptyPortfolioLabel: string;
	};
	about: {
		metadata: {
			title: string;
			description: string;
			keywords: string[];
		};
		heroTitleLines: Array<{ text: string; className?: string }>;
		heroDescription: string;
		storyLines: string[];
		processEyebrow: string;
		processTitle: string;
		processDescription: string;
		expertiseEyebrow: string;
		expertiseTitle: string;
		expertiseDescription: string;
		edgeEyebrow: string;
		edgeTitle: string;
		edgeDescription: string;
		clientsEyebrow: string;
		clientsTitle: string;
		clientsDescription: string;
		collaborationEyebrow: string;
		collaborationBody: string[];
		collaborationCta: string;
		faqEyebrow: string;
		faqTitle: string;
		faqDescription: string;
		workflowSteps: WorkflowStep[];
		serviceItems: ServiceItem[];
		edgeItems: EdgeItem[];
		faqItems: FaqItem[];
	};
	partner: {
		metadata: {
			title: string;
			description: string;
			keywords: string[];
		};
		titleLines: Array<{ text: string; className?: string }>;
		description: string;
		emptyLogoLabel: string;
	};
	portfolio: {
		metadata: {
			title: string;
			description: string;
			keywords: string[];
		};
		titleLines: Array<{ text: string; className?: string }>;
		filterAllLabel: string;
		pageLabel: string;
		emptySelectionLabel: string;
		emptyGridLabel: string;
		celebrityLabel: string;
		defaultTitle: string;
		categoryLabels: Record<string, string>;
	};
	contact: {
		metadata: {
			title: string;
			description: string;
			keywords: string[];
		};
		title: string;
		addressLabel: string;
		emailLabel: string;
		directLabel: string;
		panelEyebrow: string;
		panelTitle: string;
		panelDescription: string;
		pendingLabel: string;
		form: {
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
	pdfExport: {
		metadata: {
			title: string;
		};
	};
	notFound: {
		title: string;
		description: string;
		homeLabel: string;
	};
};

const DICTIONARIES: Record<Locale, SiteDictionary> = {
	ko: {
		siteName: 'AFEEL COMPANY',
		nav: {
			home: 'HOME',
			about: 'ABOUT',
			partner: 'PARTNER',
			portfolio: 'PORTFOLIO',
			contact: 'CONTACT',
		},
		languageSwitcherLabel: '언어 선택',
		menuOpenLabel: '메뉴 열기',
		menuCloseLabel: '메뉴 닫기',
		footer: {
			descriptionFallback: '브랜드와 셀럽을 연결하여 실질적인 노출을 만듭니다.',
			addressLabel: 'address',
			inquiriesLabel: 'Inquiries',
			siteLabel: 'Site',
			connectLabel: 'Connect',
			pendingLabel: '정보를 준비 중입니다.',
			digitalArchiveLabel: 'Digital Archive',
		},
		home: {
			metadata: {
				title: '패션 PR·셀럽 협찬 에이전시',
				description: '어필컴퍼니는 패션 브랜드와 셀럽을 연결하는 PR 에이전시입니다. 스타일링 협찬, 브랜드 포지셔닝, 미디어 노출 관리와 성과 리포트를 함께 설계합니다.',
				keywords: ['패션 PR 에이전시', '셀럽 협찬', '스타일링 협찬', '브랜드 포지셔닝', '스타 마케팅', '어필컴퍼니'],
			},
			heroBadge: 'Fashion PR Agency',
			heroTitleLines: [{ text: 'Fashion PR' }, { text: '& Styling.', className: 'italic text-[#715a3e]' }],
			overviewEyebrow: 'Agency Scope',
			overviewTitle: '어필컴퍼니는 어떤 일을 하나요?',
			overviewDescription:
				'어필컴퍼니는 서울을 기반으로 패션 브랜드와 셀럽의 스타일링 협찬을 연결하는 패션 PR 에이전시입니다. 협의한 범위에 따라 브랜드 분석, 아티스트 매칭, 제품 핸들링, 공개 노출 확인과 결과 리포트를 진행합니다.',
			overviewLinkLabel: '서비스와 프로세스 보기',
			selectedWorkTitle: 'Selected Work.',
			clientsTitle: 'Our Clients.',
			portfolioLinkLabel: 'More',
			emptyPortfolioLabel: '표시할 포트폴리오가 아직 없습니다.',
		},
		about: {
			metadata: {
				title: '패션 PR·셀럽 협찬 에이전시 소개',
				description: '어필컴퍼니는 패션 브랜드와 셀럽을 연결하는 PR 에이전시입니다. 브랜드 분석, 아티스트 매칭, 스타일링 협찬, 미디어 노출 확인, 성과 리포트까지 협업 전 과정을 설계합니다.',
				keywords: ['어필컴퍼니 소개', '패션 PR 에이전시', '셀럽 협찬', '스타일링 협찬', '브랜드 포지셔닝', '스타 마케팅', '패션 브랜드 PR'],
			},
			heroTitleLines: [{ text: 'Results,' }, { text: 'not promises.' }],
			heroDescription: '스타일링 협찬을 통해 브랜드의 가시성을 높입니다.',
			storyLines: [
				'단순히 옷을 입히는 데 그치지 않고.',
				'스타와 브랜드의 결을 먼저 봅니다.',
				'억지스럽지 않고 자연스럽게,',
				'수치보다 실제 반응에 집중합니다.',
				'함께 오래 일하는 브랜드들이',
				'우리를 찾는 이유입니다.',
			],
			processEyebrow: 'Our Process',
			processTitle: 'How It Works',
			processDescription: '브랜드 분석부터 성과 리포트까지, 어필컴퍼니의 5단계 협업 프로세스입니다.',
			expertiseEyebrow: 'Core Expertise',
			expertiseTitle: 'What We Do',
			expertiseDescription: '포지셔닝에서 아카이빙까지, 브랜드와 셀럽이 만나는 모든 접점을 함께 다룹니다.',
			edgeEyebrow: 'Our Edge',
			edgeTitle: 'Why AFEEL',
			edgeDescription: '미학, 기록, 그리고 상업적 결과를 함께 생각합니다.',
			clientsEyebrow: 'Social Proof',
			clientsTitle: 'Our Clients',
			clientsDescription: '공개 가능한 협업 브랜드를 통해 어필컴퍼니의 작업 범위를 소개합니다.',
			collaborationEyebrow: 'For Collaboration',
			collaborationBody: ['브랜드와 셀럽이 만나는 순간을 함께 기획하고 싶다면,', '어필컴퍼니로 연락 주세요.'],
			collaborationCta: 'Inquire for Collaboration',
			faqEyebrow: 'Frequently Asked Questions',
			faqTitle: '협업 전 자주 묻는 질문',
			faqDescription: '서비스 범위와 진행 방식, 결과 확인 방법을 협업 전에 확인할 수 있습니다.',
			workflowSteps: [
				{ label: 'STEP 01', title: 'STRATEGY', description: '브랜드 분석 및\n목표 설정' },
				{ label: 'STEP 02', title: 'MATCHING', description: '아티스트 큐레이션 및\n리스트 확정' },
				{ label: 'STEP 03', title: 'EXECUTION', description: '현장 협찬 실행 및\n제품 핸들링' },
				{ label: 'STEP 04', title: 'EXPOSURE', description: '다양한 미디어 채널\n노출 확인' },
				{ label: 'STEP 05', title: 'ANALYSIS', description: '성과 데이터 분석 및\n사후 리포트' },
			],
			serviceItems: [
				{ title: 'Brand Positioning', headline: '브랜드 포지셔닝', description: '브랜드의 지향점에 맞춰 노출 전략을 수립합니다.' },
				{ title: 'Editorial Placement', headline: '에디토리얼 플레이스먼트', description: '매체 특성에 맞는 적합한 스타일링과 협찬을 진행합니다.' },
				{ title: 'Digital Strategy', headline: '디지털 전략', description: '협의한 디지털 채널의 공개 반응과 노출을 확인해 기록합니다.' },
				{ title: 'Archive Management', headline: '아카이브 관리', description: '모든 활동 내역을 기록하여 체계적으로 관리합니다.' },
			],
			edgeItems: [
				{ title: 'Strategic Curation', headline: '기획된 우연', description: '브랜드 이미지에 부합하는 셀럽을 매칭합니다.' },
				{ title: 'Endless Archive', headline: '꼼꼼한 기록', description: '협의한 채널에서 확인된 노출을 기록해 공유합니다.' },
				{ title: 'Proven Impact', headline: '확인된 결과', description: '확인된 결과와 후속 활용에 필요한 자료를 정리합니다.' },
			],
			faqItems: [
				{
					question: '어필컴퍼니는 어떤 서비스를 제공하나요?',
					answer: '브랜드 포지셔닝, 아티스트 매칭, 스타일링 협찬, 미디어 노출 확인, 디지털 전략과 결과 아카이빙을 함께 다룹니다.',
				},
				{
					question: '셀럽 협찬은 어떤 순서로 진행되나요?',
					answer: '브랜드와 목표를 먼저 분석한 뒤 아티스트를 큐레이션하고, 협찬 실행, 노출 확인, 성과 분석과 사후 리포트 순서로 진행합니다.',
				},
				{
					question: '협업 결과는 어떻게 확인할 수 있나요?',
					answer: '진행 중인 노출 현황을 기록하고, 확인된 미디어와 디지털 반응을 정리해 협업 결과와 후속 판단에 필요한 자료를 공유합니다.',
				},
				{
					question: '상담 전에 어떤 정보를 준비하면 되나요?',
					answer: '브랜드 소개, 제품 카테고리, 목표 고객, 희망하는 아티스트나 노출 방향을 알려주시면 협업 가능 범위와 진행 방식을 검토할 수 있습니다.',
				},
			],
		},
		partner: {
			metadata: {
				title: '협업 브랜드 파트너',
				description: '어필컴퍼니와 함께한 패션 브랜드 파트너를 소개합니다. 셀럽 협찬과 스타일링 노출을 통해 브랜드 가시성을 만든 협업 기록입니다.',
				keywords: ['브랜드 파트너', '협업 브랜드', '패션 브랜드 협업', '셀럽 협찬 브랜드', '스타일링 협업'],
			},
			titleLines: [{ text: 'Brands' }, { text: 'we worked with.' }],
			description: '가장 좋은 신뢰 신호는 함께 일하고 있는 얼굴입니다.',
			emptyLogoLabel: '등록된 브랜드 로고가 아직 없습니다.',
		},
		portfolio: {
			metadata: {
				title: '셀럽 스타일링 협찬 포트폴리오',
				description: '셀럽 스타일링, 패션 브랜드 협찬, 미디어 노출 사례를 모은 어필컴퍼니 포트폴리오입니다. 카테고리별 협업 결과와 브랜드 노출 기록을 확인할 수 있습니다.',
				keywords: ['포트폴리오', '브랜드 협업 사례', '셀럽 스타일링', '패션 협찬 사례', '미디어 노출 사례'],
			},
			titleLines: [{ text: 'Select work.' }, { text: 'Made together.' }],
			filterAllLabel: '전체',
			pageLabel: '포트폴리오 페이지',
			emptySelectionLabel: '선택한 카테고리에 해당하는 작업이 없습니다.',
			emptyGridLabel: '표시할 포트폴리오가 아직 없습니다.',
			celebrityLabel: 'Celebrity',
			defaultTitle: '포트폴리오',
			categoryLabels: {
				남성: '남성',
				여성: '여성',
				악세서리: '악세서리',
			},
		},
		contact: {
			metadata: {
				title: '패션 PR·브랜드 협업 문의',
				description: '패션 PR, 셀럽 협찬, 스타일링 협업, 브랜드 포지셔닝 프로젝트를 문의하세요. 어필컴퍼니가 협업 가능 범위와 진행 방식을 검토해 회신합니다.',
				keywords: ['패션 PR 문의', '브랜드 협업 문의', '셀럽 협찬 문의', '스타일링 협업 문의', '어필컴퍼니 문의'],
			},
			title: 'Get In Touch.',
			addressLabel: 'Address',
			emailLabel: 'Email',
			directLabel: 'Direct',
			panelEyebrow: 'Contact',
			panelTitle: 'Inquiry.',
			panelDescription: '프로젝트 문의 내용을 남겨주시면 담당자가 검토 후 회신 드립니다.',
			pendingLabel: '정보를 준비 중입니다.',
			form: {
				nameLabel: 'Name',
				namePlaceholder: 'Your Name',
				companyLabel: 'Company',
				companyPlaceholder: 'Organization',
				emailLabel: 'Email Address',
				emailPlaceholder: 'email@address.com',
				websiteLabel: 'Website',
				messageLabel: 'Message',
				messagePlaceholder: 'Project details and inquiry',
				submitIdleLabel: 'Submit Inquiry',
				submitPendingLabel: 'Sending...',
				replyNotice: '회신은 입력하신 이메일 주소로 보내드립니다.',
				unavailableNotice: '문의 수신 이메일 또는 메일 발신 설정이 아직 완료되지 않았습니다.',
				successLabel: '문의가 전송되었습니다. 확인 후 빠르게 답변드리겠습니다.',
				errorMessages: {
					INVALID_PAYLOAD: '이름, 이메일, 문의 내용을 다시 확인해 주세요.',
					DUPLICATE_SUBMISSION: '같은 문의가 이미 접수되어 한 번만 전달했습니다.',
					INVALID_EMAIL: '올바른 이메일 주소를 입력해 주세요.',
					EMAIL_NOT_CONFIGURED: '메일 전송 설정이 아직 완료되지 않았습니다.',
					CONTACT_DESTINATION_NOT_CONFIGURED: '수신 이메일이 아직 설정되지 않았습니다.',
					SEND_FAILED: '문의 메일 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
				},
			},
		},
		pdfExport: {
			metadata: {
				title: '회사소개서 다운로드',
			},
		},
		notFound: {
			title: '페이지를 찾을 수 없습니다',
			description: '이동된 페이지일 수 있습니다. 현재 AFEEL COMPANY의 주요 페이지로 이동해 주세요.',
			homeLabel: 'HOME',
		},
	},
	en: {
		siteName: 'AFEEL COMPANY',
		nav: {
			home: 'HOME',
			about: 'ABOUT',
			partner: 'PARTNER',
			portfolio: 'PORTFOLIO',
			contact: 'CONTACT',
		},
		languageSwitcherLabel: 'Language',
		menuOpenLabel: 'Open menu',
		menuCloseLabel: 'Close menu',
		footer: {
			descriptionFallback: 'We connect brands and celebrities to create tangible exposure.',
			addressLabel: 'address',
			inquiriesLabel: 'Inquiries',
			siteLabel: 'Site',
			connectLabel: 'Connect',
			pendingLabel: 'Details coming soon.',
			digitalArchiveLabel: 'Digital Archive',
		},
		home: {
			metadata: {
				title: 'Fashion PR Agency',
				description: 'AFEEL COMPANY is a fashion PR agency connecting brands with celebrities through styling placements, brand positioning, media exposure management, and performance reporting.',
				keywords: ['fashion PR agency', 'celebrity placement', 'styling placement', 'brand positioning', 'star marketing', 'AFEEL COMPANY'],
			},
			heroBadge: 'Fashion PR Agency',
			heroTitleLines: [{ text: 'Fashion PR' }, { text: '& Styling.', className: 'italic text-[#715a3e]' }],
			overviewEyebrow: 'Agency Scope',
			overviewTitle: 'What does AFEEL COMPANY do?',
			overviewDescription:
				'AFEEL COMPANY is a Seoul-based fashion PR agency connecting fashion brands with celebrity styling opportunities. Depending on the agreed scope, we support brand review, talent matching, product handling, public exposure tracking, and post-campaign reporting.',
			overviewLinkLabel: 'View services and process',
			selectedWorkTitle: 'Selected Work.',
			clientsTitle: 'Our Clients.',
			portfolioLinkLabel: 'More',
			emptyPortfolioLabel: 'No portfolio items are available yet.',
		},
		about: {
			metadata: {
				title: 'Fashion PR & Celebrity Placement Agency',
				description: 'AFEEL COMPANY is a fashion PR agency connecting brands with celebrities through brand analysis, artist matching, styling placements, media exposure tracking, and performance reporting.',
				keywords: ['AFEEL COMPANY about', 'fashion PR agency', 'celebrity placement', 'styling placement', 'brand positioning', 'star marketing', 'fashion brand PR'],
			},
			heroTitleLines: [{ text: 'Results,' }, { text: 'not promises.' }],
			heroDescription: 'We increase brand visibility through strategic styling placements.',
			storyLines: [
				'We do more than dress talent.',
				'We study the texture between star and brand first.',
				'Naturally, never forced,',
				'and focused on real response over vanity metrics.',
				'The brands that work with us long term',
				'know exactly why they come back.',
			],
			processEyebrow: 'Our Process',
			processTitle: 'How It Works',
			processDescription: 'From brand analysis to final reporting, this is AFEEL COMPANY’s five-step collaboration process.',
			expertiseEyebrow: 'Core Expertise',
			expertiseTitle: 'What We Do',
			expertiseDescription: 'From positioning to archiving, we handle every touchpoint where brands meet celebrities.',
			edgeEyebrow: 'Our Edge',
			edgeTitle: 'Why AFEEL',
			edgeDescription: 'We think about aesthetics, documentation, and commercial results together.',
			clientsEyebrow: 'Social Proof',
			clientsTitle: 'Our Clients',
			clientsDescription: 'Our publicly listed collaborators show the range of brand work documented by AFEEL COMPANY.',
			collaborationEyebrow: 'For Collaboration',
			collaborationBody: ['If you want to shape the moment where a brand meets a celebrity,', 'contact AFEEL COMPANY.'],
			collaborationCta: 'Inquire for Collaboration',
			faqEyebrow: 'Frequently Asked Questions',
			faqTitle: 'What brands ask before working with us',
			faqDescription: 'Review our service scope, collaboration process, and reporting approach before starting a conversation.',
			workflowSteps: [
				{ label: 'STEP 01', title: 'STRATEGY', description: 'Brand analysis and\ngoal setting' },
				{ label: 'STEP 02', title: 'MATCHING', description: 'Artist curation and\nlist confirmation' },
				{ label: 'STEP 03', title: 'EXECUTION', description: 'On-site placement and\nproduct handling' },
				{ label: 'STEP 04', title: 'EXPOSURE', description: 'Exposure tracking across\nmedia channels' },
				{ label: 'STEP 05', title: 'ANALYSIS', description: 'Performance analysis and\npost-campaign reports' },
			],
			serviceItems: [
				{ title: 'Brand Positioning', headline: 'Brand Positioning', description: 'We build exposure strategies that fit the brand’s direction.' },
				{ title: 'Editorial Placement', headline: 'Editorial Placement', description: 'We execute styling and placements tailored to each media format.' },
				{ title: 'Digital Strategy', headline: 'Digital Strategy', description: 'We track and document public exposure and responses across agreed digital channels.' },
				{ title: 'Archive Management', headline: 'Archive Management', description: 'We document every activity and manage the archive systematically.' },
			],
			edgeItems: [
				{ title: 'Strategic Curation', headline: 'Planned Serendipity', description: 'We match celebrities who align with the image a brand wants to build.' },
				{ title: 'Endless Archive', headline: 'Meticulous Records', description: 'We document and share confirmed exposure across the agreed channels.' },
				{ title: 'Proven Impact', headline: 'Confirmed Results', description: 'We organize confirmed results and materials for follow-up use.' },
			],
			faqItems: [
				{
					question: 'What services does AFEEL COMPANY provide?',
					answer: 'We cover brand positioning, artist matching, styling placements, media exposure tracking, digital strategy, and result archiving.',
				},
				{
					question: 'How does a celebrity placement project work?',
					answer: 'We analyze the brand and goals, curate artists, execute the placement, confirm exposure, and close with performance analysis and a post-campaign report.',
				},
				{
					question: 'How are collaboration results documented?',
					answer: 'We record confirmed exposure and organize relevant media and digital responses into materials that support result review and next-step decisions.',
				},
				{
					question: 'What should a brand prepare before an inquiry?',
					answer: 'Share your brand introduction, product category, target audience, and preferred artist or exposure direction so we can review the appropriate scope and process.',
				},
			],
		},
		partner: {
			metadata: {
				title: 'Brand Partners',
				description: 'Meet the fashion brand partners that have worked with AFEEL COMPANY through celebrity placements, styling collaborations, and media exposure projects.',
				keywords: ['brand partners', 'collaboration brands', 'fashion brand collaboration', 'celebrity placement brands', 'styling collaboration'],
			},
			titleLines: [{ text: 'Brands' }, { text: 'we worked with.' }],
			description: 'The clearest signal of trust is who keeps working with us.',
			emptyLogoLabel: 'No brand logos have been registered yet.',
		},
		portfolio: {
			metadata: {
				title: 'Celebrity Styling Placement Portfolio',
				description: 'Explore AFEEL COMPANY portfolio cases across celebrity styling, fashion brand placements, and media exposure projects, organized by collaboration category.',
				keywords: ['portfolio', 'brand collaboration cases', 'celebrity styling', 'fashion placement cases', 'media exposure cases'],
			},
			titleLines: [{ text: 'Select work.' }, { text: 'Made together.' }],
			filterAllLabel: 'All',
			pageLabel: 'Portfolio pages',
			emptySelectionLabel: 'No work matches the selected category.',
			emptyGridLabel: 'No portfolio items are available yet.',
			celebrityLabel: 'Celebrity',
			defaultTitle: 'Portfolio',
			categoryLabels: {
				남성: 'Men',
				여성: 'Women',
				악세서리: 'Accessories',
			},
		},
		contact: {
			metadata: {
				title: 'Fashion PR & Brand Collaboration Inquiry',
				description: 'Contact AFEEL COMPANY for fashion PR, celebrity placement, styling collaboration, and brand positioning projects. Our team will review the scope and respond.',
				keywords: ['fashion PR inquiry', 'brand collaboration inquiry', 'celebrity placement inquiry', 'styling collaboration inquiry', 'AFEEL COMPANY contact'],
			},
			title: 'Get In Touch.',
			addressLabel: 'Address',
			emailLabel: 'Email',
			directLabel: 'Direct',
			panelEyebrow: 'Contact',
			panelTitle: 'Inquiry.',
			panelDescription: 'Leave your project inquiry and our team will review it before getting back to you.',
			pendingLabel: 'Details coming soon.',
			form: {
				nameLabel: 'Name',
				namePlaceholder: 'Your Name',
				companyLabel: 'Company',
				companyPlaceholder: 'Organization',
				emailLabel: 'Email Address',
				emailPlaceholder: 'email@address.com',
				websiteLabel: 'Website',
				messageLabel: 'Message',
				messagePlaceholder: 'Project details and inquiry',
				submitIdleLabel: 'Submit Inquiry',
				submitPendingLabel: 'Sending...',
				replyNotice: 'We will reply to the email address you provide.',
				unavailableNotice: 'The inquiry inbox or sender configuration is not ready yet.',
				successLabel: 'Your inquiry has been sent. We will get back to you soon.',
				errorMessages: {
					INVALID_PAYLOAD: 'Please check your name, email, and message again.',
					DUPLICATE_SUBMISSION: 'This inquiry was already received and forwarded once.',
					INVALID_EMAIL: 'Please enter a valid email address.',
					EMAIL_NOT_CONFIGURED: 'Email sending has not been configured yet.',
					CONTACT_DESTINATION_NOT_CONFIGURED: 'The destination inbox has not been configured yet.',
					SEND_FAILED: 'An error occurred while sending your inquiry. Please try again later.',
				},
			},
		},
		pdfExport: {
			metadata: {
				title: 'Company Profile Download',
			},
		},
		notFound: {
			title: 'Page not found',
			description: 'This may be an old shop URL or a page that has moved. Continue to one of the current AFEEL COMPANY pages.',
			homeLabel: 'HOME',
		},
	},
	zh: {
		siteName: 'AFEEL COMPANY',
		nav: {
			home: '首页',
			about: '关于',
			partner: '合作品牌',
			portfolio: '作品集',
			contact: '联系',
		},
		languageSwitcherLabel: '语言',
		menuOpenLabel: '打开菜单',
		menuCloseLabel: '关闭菜单',
		footer: {
			descriptionFallback: '我们连接品牌与艺人，创造真正可见的曝光效果。',
			addressLabel: '地址',
			inquiriesLabel: '咨询',
			siteLabel: '站点',
			connectLabel: '连接',
			pendingLabel: '信息准备中。',
			digitalArchiveLabel: 'Digital Archive',
		},
		home: {
			metadata: {
				title: 'Fashion PR Agency',
				description: 'AFEEL COMPANY 是连接时尚品牌与艺人的公关公司，提供造型协赞、品牌定位、媒体曝光管理与成效报告。',
				keywords: ['时尚公关公司', '艺人合作', '造型协赞', '品牌定位', '明星营销', 'AFEEL COMPANY'],
			},
			heroBadge: 'Fashion PR Agency',
			heroTitleLines: [{ text: 'Fashion PR' }, { text: '& Styling.', className: 'italic text-[#715a3e]' }],
			overviewEyebrow: '服务范围',
			overviewTitle: 'AFEEL COMPANY 提供哪些服务？',
			overviewDescription:
				'AFEEL COMPANY 是一家位于首尔的时尚公关公司，帮助时尚品牌开展韩国艺人造型合作。根据双方确认的合作范围，我们提供品牌分析、艺人匹配、产品流转、公开露出追踪和执行报告。',
			overviewLinkLabel: '查看服务与流程',
			selectedWorkTitle: '精选案例',
			clientsTitle: '合作客户',
			portfolioLinkLabel: '更多',
			emptyPortfolioLabel: '暂无可展示的作品集内容。',
		},
		about: {
			metadata: {
				title: '时尚公关与艺人协赞公司介绍',
				description: 'AFEEL COMPANY 是连接时尚品牌与艺人的公关公司，提供品牌分析、艺人匹配、造型协赞、媒体曝光确认与成效报告等完整协作流程。',
				keywords: ['AFEEL COMPANY 介绍', '时尚公关公司', '艺人合作', '造型协赞', '品牌定位', '明星营销', '时尚品牌公关'],
			},
			heroTitleLines: [{ text: 'Results,' }, { text: 'not promises.' }],
			heroDescription: '我们通过策略化造型曝光提升品牌可见度。',
			storyLines: ['我们不只是为艺人穿搭。', '我们先看清艺人与品牌之间的气质连接。', '自然，不做作，', '更重视真实反应，而不是表面数字。', '那些长期合作的品牌', '很清楚他们为什么选择我们。'],
			processEyebrow: '合作流程',
			processTitle: 'How It Works',
			processDescription: '从品牌分析到成效报告，这就是 AFEEL COMPANY 的五步协作流程。',
			expertiseEyebrow: '核心能力',
			expertiseTitle: 'What We Do',
			expertiseDescription: '从定位到归档，我们负责品牌与艺人相遇的每一个触点。',
			edgeEyebrow: '我们的优势',
			edgeTitle: 'Why AFEEL',
			edgeDescription: '我们同时思考审美、记录与商业结果。',
			clientsEyebrow: '合作证明',
			clientsTitle: 'Our Clients',
			clientsDescription: '通过可公开的合作品牌，介绍 AFEEL COMPANY 的工作范围。',
			collaborationEyebrow: '合作洽谈',
			collaborationBody: ['如果你想一起策划品牌与艺人相遇的关键时刻，', '欢迎联系 AFEEL COMPANY。'],
			collaborationCta: '预约合作咨询',
			faqEyebrow: '常见问题',
			faqTitle: '合作前常见问题',
			faqDescription: '在咨询前了解服务范围、合作流程与结果记录方式。',
			workflowSteps: [
				{ label: 'STEP 01', title: 'STRATEGY', description: '品牌分析与\n目标设定' },
				{ label: 'STEP 02', title: 'MATCHING', description: '艺人筛选与\n名单确认' },
				{ label: 'STEP 03', title: 'EXECUTION', description: '现场协赞执行与\n产品管理' },
				{ label: 'STEP 04', title: 'EXPOSURE', description: '多渠道媒体曝光\n追踪确认' },
				{ label: 'STEP 05', title: 'ANALYSIS', description: '成效分析与\n后续报告' },
			],
			serviceItems: [
				{ title: 'Brand Positioning', headline: '品牌定位', description: '根据品牌方向制定合适的曝光策略。' },
				{ title: 'Editorial Placement', headline: '媒体植入', description: '按媒介特性执行最合适的造型与协赞安排。' },
				{ title: 'Digital Strategy', headline: '数字策略', description: '追踪并记录双方约定的数字渠道中的公开露出与反馈。' },
				{ title: 'Archive Management', headline: '档案管理', description: '系统记录每一次执行内容，并持续维护归档。' },
			],
			edgeItems: [
				{ title: 'Strategic Curation', headline: '被设计的契合', description: '我们为品牌匹配真正符合品牌气质的艺人。' },
				{ title: 'Endless Archive', headline: '细致记录', description: '记录并共享双方约定渠道中已确认的公开露出。' },
				{ title: 'Proven Impact', headline: '确认结果', description: '整理已确认的结果与后续使用所需资料。' },
			],
			faqItems: [
				{
					question: 'AFEEL COMPANY 提供哪些服务？',
					answer: '我们提供品牌定位、艺人匹配、造型协赞、媒体曝光确认、数字策略和结果归档等服务。',
				},
				{
					question: '艺人协赞项目如何进行？',
					answer: '我们先分析品牌与目标，再筛选艺人、执行协赞、确认曝光，最后完成成效分析与后续报告。',
				},
				{
					question: '合作结果如何记录？',
					answer: '我们记录已确认的曝光，并整理相关媒体与数字反馈，为结果复盘和后续决策提供资料。',
				},
				{
					question: '咨询前需要准备哪些信息？',
					answer: '请提供品牌介绍、产品类别、目标人群，以及希望合作的艺人或曝光方向，以便我们评估合适的服务范围与流程。',
				},
			],
		},
		partner: {
			metadata: {
				title: '合作品牌伙伴',
				description: '查看与 AFEEL COMPANY 合作过的时尚品牌伙伴，以及通过艺人协赞、造型合作和媒体曝光建立的合作记录。',
				keywords: ['合作品牌', '品牌伙伴', '时尚品牌合作', '艺人协赞品牌', '造型合作'],
			},
			titleLines: [{ text: '合作过的' }, { text: '品牌伙伴' }],
			description: '最直接的信任信号，就是持续与我们合作的品牌。',
			emptyLogoLabel: '暂无已登记的品牌标志。',
		},
		portfolio: {
			metadata: {
				title: '艺人造型协赞作品集',
				description: '查看 AFEEL COMPANY 的艺人造型、时尚品牌协赞与媒体曝光案例，并按合作类别浏览品牌曝光记录。',
				keywords: ['作品集', '品牌合作案例', '艺人造型', '时尚协赞案例', '媒体曝光案例'],
			},
			titleLines: [{ text: '精选案例' }, { text: '共同完成。' }],
			filterAllLabel: '全部',
			pageLabel: '作品集分页',
			emptySelectionLabel: '所选分类下暂无作品。',
			emptyGridLabel: '暂无可展示的作品集内容。',
			celebrityLabel: '艺人',
			defaultTitle: '作品集',
			categoryLabels: {
				남성: '男装',
				여성: '女装',
				악세서리: '配饰',
			},
		},
		contact: {
			metadata: {
				title: '时尚公关与品牌合作咨询',
				description: '欢迎咨询时尚公关、艺人协赞、造型合作与品牌定位项目。AFEEL COMPANY 会审核合作范围与执行方式后回复。',
				keywords: ['时尚公关咨询', '品牌合作咨询', '艺人协赞咨询', '造型合作咨询', 'AFEEL COMPANY 联系'],
			},
			title: 'Get In Touch.',
			addressLabel: '地址',
			emailLabel: '邮箱',
			directLabel: '电话',
			panelEyebrow: '联系',
			panelTitle: '咨询',
			panelDescription: '留下你的项目需求，我们会审核后尽快回复。',
			pendingLabel: '信息准备中。',
			form: {
				nameLabel: '姓名',
				namePlaceholder: '你的姓名',
				companyLabel: '公司',
				companyPlaceholder: '机构名称',
				emailLabel: '邮箱地址',
				emailPlaceholder: 'email@address.com',
				websiteLabel: '网站',
				messageLabel: '留言',
				messagePlaceholder: '项目内容与咨询说明',
				submitIdleLabel: '提交咨询',
				submitPendingLabel: '发送中...',
				replyNotice: '我们会回复到你填写的邮箱地址。',
				unavailableNotice: '咨询收件邮箱或发件设置尚未完成。',
				successLabel: '咨询已发送成功，我们会尽快回复。',
				errorMessages: {
					INVALID_PAYLOAD: '请再次确认姓名、邮箱和咨询内容。',
					DUPLICATE_SUBMISSION: '相同咨询已收到，并仅转发一次。',
					INVALID_EMAIL: '请输入有效的邮箱地址。',
					EMAIL_NOT_CONFIGURED: '邮件发送设置尚未完成。',
					CONTACT_DESTINATION_NOT_CONFIGURED: '收件邮箱尚未设置。',
					SEND_FAILED: '发送咨询时发生错误，请稍后再试。',
				},
			},
		},
		pdfExport: {
			metadata: {
				title: '公司简介下载',
			},
		},
		notFound: {
			title: '找不到页面',
			description: '这可能是旧商城地址，或页面已经移动。请前往当前 AFEEL COMPANY 的主要页面。',
			homeLabel: '首页',
		},
	},
};

export function getSiteDictionary(locale: Locale) {
	return DICTIONARIES[locale];
}
