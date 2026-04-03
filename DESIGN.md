# Design System Strategy: The Editorial Archive

## 1. Overview & Creative North Star

**Creative North Star: "The Digital Atelier"**
This design system moves away from the "app-like" density of traditional SaaS and embraces the spacious, authoritative layout of a high-end fashion periodical. We are not building a tool; we are curating an experience. The "Digital Atelier" ethos relies on intentional asymmetry, high-contrast typography scales, and a rejection of standard containerization. By utilizing generous whitespace and a rigid 0px corner radius, we evoke the feeling of a physical gallery or a bespoke press kit.

The layout should feel like a rhythmic composition of "objects" on a canvas rather than "widgets" in a grid. We lean into the tension between the razor-sharp edges of our UI and the fluid, organic nature of fashion photography.

## 2. Colors

The palette is a masterclass in tonal restraint. We prioritize a monotone foundation to allow imagery to remain the protagonist, using a deep, intellectual green as our single point of focus.

### The Palette

- **Monotone Core:** Utilizing `surface` (#fcf9f8) as our primary canvas and `primary` (#000000) for high-impact structural elements.
- **The Signature Accent:** `tertiary` (#274133) is our Deep Emerald. Use this sparingly for moments of prestige—call-to-actions, active states, or brand-defining flourishes.
- **The Neutral Bridge:** `secondary` (#715a3e) provides a muted gold/bronze undertone for subtle highlights without breaking the monotone gravity.

### The "No-Line" Rule

Explicitly prohibit the use of 1px solid borders for sectioning or layout containment. Boundaries must be defined through:

1. **Background Color Shifts:** A section using `surface-container-low` sitting against a `surface` background.
2. **Negative Space:** Using the Spacing Scale to create "invisible walls."
3. **Tonal Transitions:** Moving from `surface-bright` to `surface-dim` to signal a change in content priority.

### Surface Hierarchy & Nesting

Treat the UI as a series of stacked fine papers.

- **Level 1 (Base):** `surface` (#fcf9f8).
- **Level 2 (In-set):** `surface-container-low` for subtle grouping.
- **Level 3 (Interactive):** `surface-container-highest` for high-priority cards or modals.

### The "Glass & Gradient" Rule

To prevent the design from feeling flat or "template-based," use Glassmorphism for floating navigation or overlays. Apply a semi-transparent `surface` with a 20px backdrop-blur. For main CTAs, use a subtle linear gradient from `tertiary` (#274133) to `tertiary-container` (#5f7b6b) to add depth and "soul" to the action.

## 3. Typography

The typographic soul of this system lies in the "High-Low" pairing of a literary serif and a technical sans-serif.

- **Display & Headlines (Newsreader):** Use `display-lg` and `headline-lg` to create editorial impact. These should be treated as graphic elements. Letter-spacing should be slightly tightened for headings to feel more cohesive.
- **Body & Labels (Manrope):** Use `body-md` for all long-form reading. Manrope provides a clean, airy contrast to the serif, ensuring the agency feels modern and efficient.
- **The Hierarchy Strategy:** Typography is our primary navigational tool. A massive `display-sm` heading next to a tiny, wide-tracked `label-sm` creates a luxury "Vogue-esque" contrast that signals high-end positioning.

## 4. Elevation & Depth

In this system, elevation is "felt," not "seen." We reject heavy shadows in favor of tonal layering.

- **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` background. This "soft lift" provides hierarchy without the visual clutter of 3D effects.
- **Ambient Shadows:** When a float is required (e.g., a dropdown), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(28, 27, 27, 0.05)`. The shadow must feel like a natural light fall-off, not a digital effect.
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` (#c6c6c6) at 20% opacity. This "Ghost Border" provides a suggestion of a container without breaking the editorial flow.
- **Sharp Precision:** All containers have a **0px roundedness**. This is non-negotiable. Sharp corners represent the precision and "edge" of the fashion industry.

## 5. Components

### Buttons

- **Primary:** Background `primary` (#000000), text `on-primary`. Sharp corners, generous horizontal padding (32px+).
- **Secondary:** Background `transparent`, "Ghost Border" (`outline-variant` @ 20%), text `primary`.
- **Tertiary (The Emerald Accent):** Background `tertiary` (#274133), text `on-tertiary`. Used exclusively for "Join" or "Contact" flows.

### Input Fields

Avoid the "box" look. Use a single bottom border (`outline-variant` @ 40%) with `label-sm` placed 8px above the line. Upon focus, the border transitions to `primary` (#000000).

### Cards & Lists

**Strictly forbid divider lines.**

- For lists, use `surface-container` background shifts on hover.
- For cards, use `surface-container-lowest` (#ffffff) to create a subtle pop against `surface` (#fcf9f8) backgrounds. Space between items should be 48px or greater.

### The "Press Fragment" (Custom Component)

A signature layout component where an image spans 60% of the container, while a `display-sm` serif heading overlaps the image edge, anchored by a `body-sm` description in a `surface-container-high` box.

## 6. Do's and Don'ts

### Do:

- **Embrace Asymmetry:** Align a heading to the left and the body text to the far right to create a sophisticated, non-linear flow.
- **Use "White Space" as a Color:** Treat empty space as an active design element that adds "air" to the PR agency's presentation.
- **Maintain High Contrast:** Ensure `on-surface` text on `surface` backgrounds meets WCAG AAA standards.

### Don't:

- **Never use Rounded Corners:** 0px is the law of the system. Anything else degrades the high-end editorial feel.
- **Avoid Decorative Icons:** Only use icons for utility (Search, Close, Menu). They must be 1px stroke weight and minimal.
- **No Divider Lines:** Do not use 1px lines to separate content blocks. Use the `surface-container` tiers or spacing instead.
- **Don't Overuse the Accent:** The Deep Emerald (`tertiary`) loses its impact if used for more than 5% of the screen real estate. Use it only for the "Hook."

# 웹사이트 브랜딩 무드보드 및 시각적 뉘앙스(Nuance) 설계

지침텍스트의 강력한 서사뿐만 아니라, 웹사이트를 구성하는 모든 시각적인 톤앤매너(Tone & Manner) 역시 멈추지 않는 상승과 끝없는 확장의 뉘앙스를 무의식중에 발산해야 한다. 세밀한 디자인 요소 하나하나가 브랜드의 권위를 결정짓는다.

- Color Palette (색상의 심리학): 깊은 신뢰감과 변하지 않는 세련됨을 상징하는 극도로 정제된 무채색 모노톤(Monochrome - Deep Black, Off-White, Space Grey)을 전체 화면의 압도적인 베이스 컬러로 채택한다. 그리고 이 무채색의 바다 위에서 에이전시의 팽창하는 성장 모멘텀을 은유하기 위해, 시각적 자극이 강한 일렉트릭 블루(Electric Blue)나 네온 실버(Neon Silver)를 단 하나의 강조색(Accent Color)으로 선정한다. 이 강조색은 버튼의 테두리, 스크롤의 진행 상태를 알리는 인디케이터, 배경의 미세한 선형 그래픽 등 아주 제한적이고 미세한 영역에만 예리하게 배치한다. 이는 전통적인 하이엔드 패션 하우스의 묵직한 우아함과, 혁신적인 IT 테크 기업이 가지는 미래지향적인 성장 속도를 동시에 내포하는 고도의 컬러 브랜딩 전략이다.
- Typography (서체의 미학): 유럽의 유서 깊은 하이엔드 패션 매거진 사설(Editorial)을 연상시키는 섬세하고 우아한 명조체(Serif - 예: 고급스러운 바탕체 계열이나 Didot 폰트)를 영문과 국문의 거대한 대제목(Headline)에 과감하게 적용한다. 반면, 정보 전달이 목적인 본문(Body Copy) 영역에는 스크린에서의 가독성과 시각적 현대성을 극대화한 기하학적 산세리프체(Sans-serif - 예: 고딕 계열, Helvetica, Pretendard 등)를 매치한다. 이러한 극단적인 폰트의 대비는 고전적인 예술적 미감과 현대적인 정보 처리 능력의 완벽한 균형감을 방문자의 뇌리에 주입한다.
- Use of Whitespace (여백이 만드는 권위): 웹사이트의 제한된 화면을 자신들의 성과나 콘텐츠로 빈틈없이 빽빽하게 채워 넣으려는 시도는, 역설적으로 '물건을 많이 팔고 싶어 안달 난 동대문 도매상'과 같은 값싼 인상을 줄 수 있는 치명적인 실수다. 최상위 프리미엄 부티크 에이전시로서의 고고한 정체성을 확립하기 위해서는 광활할 정도의 과감한 여백(Negative Space)을 페이지 곳곳에 디자인해야 한다. 이 거대한 여백은 방문자가 정보를 흡수하는 시각적 호흡을 의도적으로 늦추어 주며, 그 여백 한가운데 놓인 단 한 장의 포트폴리오 사진이나 단 한 줄의 확신에 찬 문장이 미술관 중앙에 전시된 예술 작품처럼 강렬하게 돋보이게 만드는 마법을 부린다.
- Micro-Interactions (생명력을 불어넣는 마이크로 인터랙션): 사용자의 마우스 움직임이나 클릭 등 미세한 액션에 즉각적으로 반응하는 부드러운 움직임을 사이트 전반에 코딩해야 한다. 예를 들어, 사이트 상단의 회사 로고에 마우스를 올렸을 때 그라데이션 빛줄기가 은은하게 상승하는 모션, 화면을 스크롤하여 새로운 섹션에 진입할 때 텍스트 덩어리들이 페이드 업(Fade-up)되며 어둠 속에서 천천히 위로 떠오르는 트랜지션 모션 등을 적용한다. 이러한 기술적 디테일들은 비록 화면 상에 매출 상승을 알리는 구체적인 목업 데이터나 도표가 단 하나도 없더라도, 웹사이트 공간 전체에 '끝없이 위로 향하는 생동감 넘치는 상승 에너지'를 무의식적으로 부여하는 가장 세련되고 탁월한 최신 웹 인터랙션 디자인 기법이다.
