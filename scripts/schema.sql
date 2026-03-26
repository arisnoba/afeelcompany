-- 포트폴리오 아이템 (갤러리)
CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  celebrity_name TEXT,
  category TEXT NOT NULL,            -- 상의/하의/신발/악세서리/기타
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  show_on_web BOOLEAN DEFAULT true,
  show_on_pdf BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인스타그램 게시 대기열
CREATE TABLE instagram_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_item_id UUID REFERENCES portfolio_items(id),
  caption TEXT,
  status TEXT DEFAULT 'draft',       -- draft/pending/published/failed
  published_at TIMESTAMPTZ,
  external_post_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인스타그램 피드 캐시
CREATE TABLE instagram_feed_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id TEXT UNIQUE NOT NULL,
  media_url TEXT NOT NULL,
  caption TEXT,
  permalink TEXT,
  post_timestamp TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ DEFAULT NOW()
);

-- 회사 프로필 (단일 row)
CREATE TABLE company_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  about_text TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  pdf_sections JSONB DEFAULT '[]',   -- PDF 섹션 구성/순서
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 클라이언트 브랜드 로고
CREATE TABLE client_brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
