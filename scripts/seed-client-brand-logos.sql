WITH sample_brands(name, logo_url, brand_url, sort_order) AS (
  VALUES
    ('Apple', '/images/client-logos/apple.svg', 'https://www.apple.com', 900),
    ('Amazon', '/images/client-logos/amazon.svg', 'https://www.amazon.com', 901),
    ('Google', '/images/client-logos/google.svg', 'https://www.google.com', 902),
    ('Meta', '/images/client-logos/meta.svg', 'https://about.meta.com', 903),
    ('Microsoft', '/images/client-logos/microsoft.svg', 'https://www.microsoft.com', 904),
    ('Netflix', '/images/client-logos/netflix.svg', 'https://www.netflix.com', 905),
    ('Nike', '/images/client-logos/nike.svg', 'https://www.nike.com', 906),
    ('Samsung', '/images/client-logos/samsung.svg', 'https://www.samsung.com', 907),
    ('Toyota', '/images/client-logos/toyota.svg', 'https://www.toyota.com', 908),
    ('Disney', '/images/client-logos/disney.svg', 'https://www.disney.com', 909),
    ('Coca-Cola', '/images/client-logos/coca-cola.svg', 'https://www.coca-cola.com', 910),
    ('Visa', '/images/client-logos/visa.svg', 'https://www.visa.com', 911),
    ('BMW', '/images/client-logos/bmw.svg', 'https://www.bmw.com', 912),
    ('Cisco', '/images/client-logos/cisco.svg', 'https://www.cisco.com', 913),
    ('FedEx', '/images/client-logos/fedex.svg', 'https://www.fedex.com', 914),
    ('Honda', '/images/client-logos/honda.svg', 'https://www.honda.com', 915),
    ('Intel', '/images/client-logos/intel.svg', 'https://www.intel.com', 916),
    ('Mastercard', '/images/client-logos/mastercard.svg', 'https://www.mastercard.com', 917),
    ('Sony', '/images/client-logos/sony.svg', 'https://www.sony.com', 918),
    ('Tesla', '/images/client-logos/tesla.svg', 'https://www.tesla.com', 919)
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

UPDATE client_brands
SET
  is_active = false,
  updated_at = NOW()
WHERE name IN ('Adidas', 'Spotify', 'Airbnb')
  AND logo_url IN (
    '/images/client-logos/adidas.svg',
    '/images/client-logos/spotify.svg',
    '/images/client-logos/airbnb.svg'
  );
