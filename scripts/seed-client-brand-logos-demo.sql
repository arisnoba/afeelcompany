WITH sample_brands(name, logo_url, brand_url, sort_order) AS (
  VALUES
    ('Apple', '/images/client-logos/apple.svg', 'https://www.apple.com', 0),
    ('Amazon', '/images/client-logos/amazon.svg', 'https://www.amazon.com', 1),
    ('Google', '/images/client-logos/google.svg', 'https://www.google.com', 2),
    ('Meta', '/images/client-logos/meta.svg', 'https://about.meta.com', 3),
    ('Microsoft', '/images/client-logos/microsoft.svg', 'https://www.microsoft.com', 4),
    ('Netflix', '/images/client-logos/netflix.svg', 'https://www.netflix.com', 5),
    ('Nike', '/images/client-logos/nike.svg', 'https://www.nike.com', 6),
    ('Samsung', '/images/client-logos/samsung.svg', 'https://www.samsung.com', 7),
    ('Toyota', '/images/client-logos/toyota.svg', 'https://www.toyota.com', 8),
    ('Disney', '/images/client-logos/disney.svg', 'https://www.disney.com', 9),
    ('Coca-Cola', '/images/client-logos/coca-cola.svg', 'https://www.coca-cola.com', 10),
    ('Visa', '/images/client-logos/visa.svg', 'https://www.visa.com', 11)
),
updated AS (
  UPDATE client_brands AS target
  SET
    logo_url = source.logo_url,
    brand_url = source.brand_url,
    sort_order = source.sort_order,
    is_active = true,
    updated_at = NOW()
  FROM sample_brands AS source
  WHERE target.name = source.name
  RETURNING target.name
)
INSERT INTO client_brands (name, logo_url, brand_url, sort_order, is_active)
SELECT source.name, source.logo_url, source.brand_url, source.sort_order, true
FROM sample_brands AS source
WHERE NOT EXISTS (
  SELECT 1
  FROM updated
  WHERE updated.name = source.name
);
