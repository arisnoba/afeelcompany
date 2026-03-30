export interface AdminNavItem {
  href: string
  label: string
  description: string
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    href: '/admin',
    label: '대시보드',
    description: '운영 흐름과 핵심 진입점을 한 번에 확인합니다.',
  },
  {
    href: '/admin/upload',
    label: '업로드',
    description: '이미지와 메타데이터를 올려 전체 파이프라인의 시작점을 만듭니다.',
  },
  {
    href: '/admin/portfolio',
    label: '포트폴리오',
    description: '노출 여부와 정렬 순서를 운영 기준에 맞게 정리합니다.',
  },
  {
    href: '/admin/profile',
    label: '회사 정보',
    description: '브랜드 로고와 회사 프로필을 실데이터 기준으로 관리합니다.',
  },
  {
    href: '/admin/instagram',
    label: '인스타 큐',
    description: '게시 대기열을 만들고 수동 publish 이력을 추적합니다.',
  },
]

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
