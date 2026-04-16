-- =============================================================================
-- VNSIR Seed Data — Development / Staging only
-- Inserts sample reports into the catalogue.
-- DO NOT run against production without explicit sign-off.
-- =============================================================================

INSERT INTO public.reports (
    id, title, slug, category, price_cents, sku, page_count,
    executive_summary, strategic_questions,
    publication_date, status
)
VALUES
(
    gen_random_uuid(),
    'Vietnam E-Commerce Shadow Market Report 2026',
    'vietnam-ecommerce-shadow-market-2026',
    'e_commerce',
    89900,  -- $899
    'VNSIR-EC-2026-001',
    72,
    ARRAY[
        'Vietnam''s informal e-commerce sector accounts for an estimated 34% of gross merchandise value — invisible to official GDP statistics.',
        'Tier-2 and Tier-3 city logistics gaps represent a $1.5B structural opportunity through 2028.'
    ],
    ARRAY[
        'Which distribution channels are capturing the most off-platform GMV in Vietnam?',
        'How do shadow-market pricing dynamics affect formal marketplace take-rates?'
    ],
    '2026-03-01',
    'published'
),
(
    gen_random_uuid(),
    'Vietnam Mobile Gaming Market Intelligence 2026',
    'vietnam-mobile-gaming-intelligence-2026',
    'gaming',
    79900,  -- $799
    'VNSIR-GM-2026-001',
    58,
    ARRAY[
        'Vietnam''s mobile gaming ARPU has grown 22% YoY, outpacing Southeast Asian peers for the third consecutive year.',
        'Hyper-casual titles dominate installs but mid-core genres capture 67% of in-app purchase revenue.'
    ],
    ARRAY[
        'What monetisation structures are most effective for retaining Vietnamese mobile gaming spenders?',
        'How are regulatory shifts in loot-box legislation affecting publisher revenue models?'
    ],
    '2026-02-14',
    'published'
),
(
    gen_random_uuid(),
    'Vietnam OTT & Streaming Landscape 2026',
    'vietnam-ott-streaming-landscape-2026',
    'entertainment',
    69900,  -- $699
    'VNSIR-ET-2026-001',
    49,
    ARRAY[
        'Domestic OTT platforms have captured 41% subscriber share, displacing global entrants in Vietnamese-language content.',
        'Ad-supported video on demand (AVOD) is growing 3x faster than subscription models among Gen Z consumers.'
    ],
    ARRAY[
        'What content genres drive highest retention for Vietnamese OTT subscribers?',
        'How are telco bundling strategies reshaping OTT acquisition costs?'
    ],
    '2026-01-20',
    'published'
),
(
    gen_random_uuid(),
    'Vietnam Macro-Economy Signals: Q1 2026',
    'vietnam-macro-economy-signals-q1-2026',
    'macro_economy',
    49900,  -- $499
    'VNSIR-ME-2026-Q1',
    35,
    ARRAY[
        'FDI inflows into digital-economy sectors rose 18% QoQ in Q1 2026 despite global rate headwinds.',
        'Consumer sentiment index reached a 4-year high, signalling pent-up B2C discretionary spend.'
    ],
    ARRAY[
        'Which macro indicators should foreign investors prioritise when timing Vietnam market entry?',
        'How do currency fluctuation risks affect USD-denominated returns for digital investments?'
    ],
    '2026-04-01',
    'published'
)
ON CONFLICT (slug) DO NOTHING;
