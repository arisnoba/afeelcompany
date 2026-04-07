export interface AdminNavItem {
  href: string
  label: string
  description: string
}

export interface AdminNavGroup {
  label: string
  items: AdminNavItem[]
}

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    label: '개요',
    items: [
      {
        href: '/admin',
        label: '대시보드',
        description: '운영 흐름과 핵심 진입점을 한 번에 확인합니다.',
      },
    ],
  },
  {
    label: '콘텐츠',
    items: [
      {
        href: '/admin/portfolio',
        label: '포트폴리오',
        description: '우측 패널에서 신규 등록과 상세 편집을 함께 처리합니다.',
      },
      {
        href: '/admin/clients',
        label: '클라이언트 관리',
        description: '브랜드 리스트를 테이블과 우측 패널에서 관리합니다.',
      },
      {
        href: '/admin/instagram',
        label: '인스타 큐',
        description: '게시 대기열을 만들고 수동 publish 이력을 추적합니다.',
      },
    ],
  },
  {
    label: '설정',
    items: [
      {
        href: '/admin/profile',
        label: '회사 정보',
        description: '회사 프로필과 연락처 데이터를 실데이터 기준으로 관리합니다.',
      },
      {
        href: '/admin/export',
        label: '익스포트',
        description: '브로셔 PDF 미리보기와 출력 흐름을 실행합니다.',
      },
      {
        href: '/admin/accounts',
        label: '관리자 계정',
        description: '접근 가능한 관리자 이메일과 계정 상태를 관리합니다.',
      },
    ],
  },
]

export const ADMIN_NAV_ITEMS: AdminNavItem[] = ADMIN_NAV_GROUPS.flatMap(
  (group) => group.items,
)

export function isAdminHrefActive(pathname: string, href: string) {
  if (href === '/admin') {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export function getAdminNavItem(pathname: string) {
  return (
    ADMIN_NAV_ITEMS.find((item) => isAdminHrefActive(pathname, item.href)) ??
    ADMIN_NAV_ITEMS[0]
  )
}
