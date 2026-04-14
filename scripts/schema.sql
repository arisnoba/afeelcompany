-- 포트폴리오 아이템 (갤러리)
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  client_brand_id UUID REFERENCES client_brands(id),
  brand_name TEXT NOT NULL,
  celebrity_name TEXT,
  category TEXT NOT NULL,            -- 상의/하의/신발/악세서리/기타
  instagram_url TEXT,
  image_url TEXT NOT NULL,          -- normal 이미지
  thumbnail_url TEXT,               -- hover 이미지
  show_on_web BOOLEAN DEFAULT true,
  show_on_pdf BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE portfolio_items
ADD COLUMN IF NOT EXISTS instagram_url TEXT;

ALTER TABLE portfolio_items
ADD COLUMN IF NOT EXISTS client_brand_id UUID REFERENCES client_brands(id);

UPDATE portfolio_items AS portfolio
SET
  client_brand_id = brand.id,
  updated_at = NOW()
FROM client_brands AS brand
WHERE portfolio.client_brand_id IS NULL
  AND LOWER(BTRIM(portfolio.brand_name)) = LOWER(BTRIM(brand.name));

-- 인스타그램 게시 대기열
CREATE TABLE IF NOT EXISTS instagram_queue (
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
CREATE TABLE IF NOT EXISTS instagram_feed_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id TEXT UNIQUE NOT NULL,
  media_url TEXT NOT NULL,
  caption TEXT,
  permalink TEXT,
  post_timestamp TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ DEFAULT NOW()
);

-- 회사 프로필 (단일 row)
CREATE TABLE IF NOT EXISTS company_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  about_text TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  pdf_sections JSONB DEFAULT '[]',   -- PDF 섹션 구성/순서
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 관리자 계정
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 클라이언트 브랜드 로고
CREATE TABLE IF NOT EXISTS client_brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  brand_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE client_brands
ADD COLUMN IF NOT EXISTS brand_url TEXT;

ALTER TABLE client_brands
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS admin_users_email_idx ON admin_users (email);
CREATE INDEX IF NOT EXISTS portfolio_items_client_brand_id_idx ON portfolio_items (client_brand_id);
