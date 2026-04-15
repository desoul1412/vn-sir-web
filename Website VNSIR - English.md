[**VNSIR.COM**](http://VNSIR.COM)

# **1\. Phase 1: Vision & Branding (Project Vision & Branding)**

1.1. **Concept & Positioning:** Describes the identity of **VNSIR** as **"The Vietnam Analyst"**.

1.1. **Founder Profile:** 21 years of experience in **Mobile Game Publishing** and **Global Market Research**. Core philosophy: **Stoicism**, **Minimalism**, and **Data-driven Decision Making**.

1.2. **VN-SIR Project (Vietnam Strategic Insights Research):** A startup specializing in producing and selling Market Research Reports on Vietnam for foreign investors, covering digital business sectors including E-Commerce, Entertainment, Gaming, and more.

1.3. **Unique Selling Point (Core Value):** We do not sell Raw Data. VNSIR sells **The Truth** about the Vietnamese market, and the **Shadow Market** across various sectors.

1.2. **Design Language:** Pursues a **Minimalism** aesthetic. Primary color palette is typically black/white and dark navy.

# **2\. Phase 2: Information Architecture & Sitemap**

2.1. **Sitemap:**

Link: [https://gemini.google.com/share/8551f8beb84d](https://gemini.google.com/share/8551f8beb84d)

## 2.1. **Homepage — Intelligence Hub (Report Store)** — **Single-scroll** format. Primary purpose is User Routing, funneling users directly into 2 funnels: Purchase Report (**Tier 1**)

![][image1]

![][image2]

![][image3]

### **VNSIR Homepage Architecture Specification (Homepage Handoff Specification)**

1. **Header & Navigation**
   1.1. **VNSIR Logo**: Placed top-left, minimal monochrome design.
   1.2. **Global Menu**: Keep only 4 buttons: **Intelligence Hub**, **Custom Advisory**, **The Analyst Brief**, **About Us**.
   1.3. **Utility Tools**: Top-right utility cluster includes **Language Switcher** (Default: **EN**), **Search Bar** (Magnifying glass icon), and **Login / Client Portal** button (Outline button design).

2. **Hero Section (Manifesto Area — Occupying up to 30% of Viewport)**
   2.1. **Eyebrow Text**: Display the line "THE VIETNAM STRATEGIC INSIGHT RESEARCH". Must use small font, fully capitalized (**All-caps**), with **Wide Letter-spacing**.
   2.2. **Headline (H1)**: Display the line "**Decoding Vietnam's Shadow Market.**". This is the largest font, bold, using the primary accent color to attract attention.
   2.3. **Sub-headline (H2)**: Display the line "Executive wisdom and surgical insights. **No raw data.**". Medium font size, bold keywords to establish **Frame Control**.

3. **Intelligence Hub (Report Display Area — Product Grid)**
   3.1. **Faceted Search**: Horizontal **Tabs** clearly navigate by sector: **All**, **E-Commerce**, **Gaming**, **Entertainment**, **Macro Economy**.
   3.2. **Product Card Design**: Remove generic line-art icons, replace with high-end abstract **Data Art** graphics.
   3.3. **Card Layout**: Must display top-to-bottom in this order: Sector Tag & Timestamp, Report Name, 2 lines of **Executive Summary** (describing the core insight).
   3.4. **Conversion Trigger**: The **Price Tag** and navigation button "View Insight ->" must be bolded in accent color to drive click-through rate.

4. **Trust Badges & Footer**
   4.1. **Trust Badges**: Investment fund partner/client logo strip, must be converted to **Grayscale** format.
   4.2. **Footer Links**: Contains mandatory legal links for a **B2B SaaS** platform: **Terms of Service**, **Privacy Policy**.
   4.3. **Location**: Add the text "Ho Chi Minh City, Vietnam" at the bottom corner to reinforce **Digital Authority** regarding the local origin of research data.

## 2.2. **Custom Advisory** — Independent **Landing Page** interface. **Call-to-Action (CTA)** button uses premium language: "Request a Confidential Proposal".

![][image4]
![][image5]

### **Custom Advisory Page Technical Specification (Custom Research Intake Page)**

1. **Overall Architectural Guidelines**
   1.1. This page is fundamentally an independent **Landing Page** exclusively for collecting custom research (**Custom Research**) requests — must absolutely not be designed like a generic "Contact Us" page.
   1.2. The core objective is to perform **Lead Qualification** automatically, filtering out non-serious requests or those from non-**C-level** targets.

2. **Layout & Visual Structure**
   2.1. Use a **Split-screen** layout following **Minimalism** standards to minimize **Cognitive Load**.
   2.2. **Left Area (Value & Process)**: A static space containing the main **Headline** (e.g., "Commission a Custom Intelligence Report") and 3 ultra-short bullet points describing the workflow (Scope Definition -> Data Gathering -> Executive Delivery).
   2.3. **Right Area (Intake Form)**: Place the form in a **Sticky** state (fixed when scrolling), ensuring the form always remains in view to drive completion rate.

3. **Intake Form Data Fields**
   3.1. **Full Name**: Mandatory **Text field**.
   3.2. **Job Title**: Mandatory **Text field**, used to validate the **Decision Maker** level of the contact.
   3.3. **Corporate Email**: Mandatory **Email field**. Require developers to integrate **Regex Validation** at the Front-end to automatically block freemail domains (@gmail.com, @yahoo.com).
   3.4. **Company** (Organization / Business Name): Mandatory **Text field**.
   3.5. **Target Sector**: Must use a **Dropdown Menu** with standardized values: E-Commerce, Gaming, Entertainment, Macro Economy, Other.
   3.6. **Key Intelligence Question**: Use a **Text Area**. Set a **Placeholder** suggestion: *"Describe the specific market insights you need or the strategic decision this report will support..."*
   3.7. **Expected Delivery Timeline**: Use a **Dropdown Menu** with milestones: < 2 Weeks, 1 Month, Next Quarter.

4. **Conversion Mechanics & Trust Signals**
   4.1. **Primary Button**: Display text must be **"Request a Confidential Proposal"**, using the most prominent color on the page to attract clicks.
   4.2. **Micro-copy**: Directly below the **CTA** button, insert a **Lock icon** accompanied by the text: *"End-to-end encrypted. Protected by VNSIR NDA protocols."* to deliver the final **Trust Signal**.

### **Handoff Summary Table**

| Category | Core Technical Requirements | Data-driven Purpose |
| :---- | :---- | :---- |
| **Layout** | **Split-screen** Minimalism standard, **Sticky** Form. | Optimize display, keep form always within the **Conversion** zone. |
| **Identity Fields** | Name, **Job Title**, **Company**, **Corporate Email** (Block spam email). | Filter **Qualified Leads**, validate **C-level** targets. |
| **Classification Fields** | Sector (**Dropdown**), Key Question (**Text Area**), Timeline. | Automatically route data to the **CRM** system. |
| **Sales Close (CTA)** | Button: "Request a Confidential Proposal" with security **Micro-copy**. | Targets the information-security psychology of investors. |

## 2.3. **The Analyst Brief** — Article list structure focused on **Micro-insights**. No standard Blog design; prioritize displaying **Data** and **Bullet points**.

![][image6]

![][image7]

![][image8]

### **The Analyst Brief Page Architecture Specification (Insights Hub)**

1. **Architectural & UI Guidelines**
   1.1. Completely abandon the **Standard Blog Layout** (typical WordPress-style blog with large stock images and spread-out text).
   1.2. Apply **Intelligence Terminal** design: Interface displayed as **List View** or a **Data Cards** grid, with a strong **Minimalism** aesthetic.
   1.3. Do not use generic stock photos. The only visual elements accepted are **Data Visualizations** (Data charts) or enlarged **Typography Numbers**.

2. **Micro-insight Card Design**
   2.1. Each article appearing on the Hub's main page is not an excerpt but a distilled **Data Card**.
   2.2. **Key Metric**: Placed top-left or at the top, displayed in super-large font (e.g., **+22%**, **$1.5B**).
   2.3. **Headline**: Written like an executive email subject line (e.g., *The Hidden Cost of Logistics in Vietnam's Tier-2 Cities*).
   2.4. **Executive Bullet Points**: Display 2-3 concise bullet points directly on the card highlighting the core **Insight** — users should not need to click in to read them.
   2.5. **Actionable Link**: A "Read Full Brief" button or cross-link directly to the related **Tier 1** report in the **Report Store**.

3. **Single Brief Layout**
   3.1. Go straight to the point with a **Bottom-Line Up Front (BLUF)** structure: Put the most important conclusion or **Wisdom** in the very first paragraph.
   3.2. Body content must be formatted with **Bullet points** and **Tables**.
   3.3. Length limit: Ensure readers can **Scan** the entire content within 60-90 seconds.

4. **Lead Generation Engine**
   4.1. This page serves as "bait" for the **Lead Nurturing** strategy via email.
   4.2. **Sticky Subscription Bar**: Set a sticky call-to-action bar that follows the screen: *"Get weekly surgical insights delivered to your inbox"*.
   4.3. **Data Capture**: Only require one **Corporate Email** field to minimize friction, automatically pushing data to the **CRM** system in preparation for the Email Marketing sequence.

### **The Analyst Brief Architecture Summary Table**

| Category | Technical & UI Specs | Data-driven Purpose |
| :---- | :---- | :---- |
| **Hub Layout** | **Intelligence Terminal** interface, list/data grid layout. | Respects **C-level** time, conveys high-level professionalism. |
| **Micro-insight Card** | No Stock photos. Elevates **Key Metric** and **Bullet points**. | Forces readers to focus on **Wisdom** and **Data** immediately. |
| **Single Brief Content** | **BLUF** structure (Conclusion up front), reading time < 90 seconds. | Optimizes **Scannability** for executives. |
| **Conversion Mechanism** | **Sticky Subscription Bar** collecting **Corporate Email**. | Builds a quality **Lead** base for nurturing and upselling **Tier 1 Reports**. |

## 2.4. About VN-SIR: Focused on building Brand Story based on real-world experience and the principle of selling only The Truth.

![][image9]

![][image10]

![][image11]

### **About Us Page Architecture Specification (Corporate Manifesto)**

1. **Architectural & Visual Guidelines**

   1.1. Page nature: This is not an "About Us" page with hollow smiling team photos. This page is a **Corporate Manifesto** that defines **Digital Authority**.

   1.2. Adhere to **Minimalism** & **Strategic Stealth**: Completely remove personal photos (Headshots). True to the spirit of "prioritizing objective data over personal profiles," the only visual elements on this page are **Typography** and **White space**.

   1.3. Display language: Maintain 100% high-level English text (Executive English) to preserve strong **Trust Signals** with **Foreign Investors**.

2. **Page Layout Structure**

   2.1. **Hero Section**: Serves as a visual anchor. Place **"ABOUT VN-SIR: CORPORATE AUTHORITY & STRATEGIC STEALTH"** as a centered **H1**. Must use Serif or bold Sans-serif font, fully capitalized (**All-caps**) to create **Visual Weight**.

   2.2. **Content Block 1 (Corporate Identity & Legal Liability)**: Present as a left-aligned text paragraph. Require the UI team to **Bold** trust-building key phrases: **Independent legal entity**, **Data precision**, **Strict confidentiality**, **Legal Liability**.

   2.3. **Content Block 2 (Expert Team & Strategic Stealth Model)**: Design this block within a **Light gray block** background to visually separate it, emphasizing the secrecy and depth of the intelligence network. Bold **Technical terms**: **Active Operators**, **Strategic Stealth**, **Absolute Objectivity**, **3PP Gaps**, **Shadow Market**.

   2.4. **Content Block 3 (Execution Commitment)**: Placed statically at the bottom of the page, serving as a brand promise. Bold action keywords: **Local Expertise**, **Global Professionalism**, **Actionable strategies**.

3. **Navigation & Conversion Funnel**

   3.1. **Zero Outbound Links**: Do not insert any internal links within the text blocks, forcing **C-level** readers to read the entire manifesto without distraction (**Cognitive Focus**).

   3.2. **Call-to-Action (Bottom page navigation button)**: Once clients have been fully persuaded by the manifesto, place a static **Conversion Trigger** at the very bottom with 2 buttons: **"Explore Intelligence Hub"** (Tier 1 funnel) and **"Request Custom Research"** (Tier 2 funnel).

---

#### **I. VIETNAMESE VERSION**

**ABOUT VN-SIR: CORPORATE AUTHORITY & STRATEGIC STEALTH**

**1\. Legal Entity & Authority**

1.1. **VN-SIR (Vietnam Strategic Insights Research)** operates as an independent legal entity. We build our reputation upon data accuracy and a commitment to maximum confidentiality.

1.2. All intellectual products under the **VN-SIR** brand comply with rigorous internal validation processes. **VN-SIR** assumes full legal liability and fulfills all contractual commitments (SLA/NDA).

**2\. Operations & Model**

2.1. The team comprises **Active Operators** with over 10 years of management experience in Vietnam's digital economy.

2.2. **Strategic Stealth:** We apply a team identity confidentiality model to maintain **Absolute Objectivity**.

2.3. This model allows experts to penetrate deeply into the market, analyzing **3PP Gap** and **Shadow Market** metrics without being influenced by personal biases or relationship network pressures.

**3\. Execution Commitment**

3.1. **VN-SIR** is the combination of **Local Expertise** and **Global Professionalism**.

3.2. We focus on immediately actionable strategies, placing real-world data at the center rather than relying on individual presence.

---

#### **II. ENGLISH VERSION**

**ABOUT VN-SIR: CORPORATE AUTHORITY & STRATEGIC STEALTH**

**1\. Corporate Identity & Legal Liability**

1.1. **VN-SIR (Vietnam Strategic Insights Research)** operates as an independent legal entity. Our reputation is built upon data precision and strict confidentiality.

1.2. All intellectual products are governed by rigorous internal validation. **VN-SIR** assumes full **Legal Liability** and contractual fulfillment for all provided services.

**2\. Expert Team & Strategic Stealth Model**

2.1. Our core team consists of **Active Operators** with over 10 years of leadership in Vietnam's digital economy.

2.2. **Strategic Stealth:** We implement a confidential operational model to ensure **Absolute Objectivity**.

2.3. This structure enables our experts to penetrate deep into market layers, deciphering **3PP Gaps** and **Shadow Market** dynamics free from personal bias or network interference.

**3\. Execution Commitment**

3.1. **VN-SIR** integrates **Local Expertise** with **Global Professionalism**.

3.2. We deliver actionable strategies and performance-driven insights, prioritizing objective data over individual profiles.

## **2.5. Functional & Conversion Pages Architecture**

### 2.5.1 **Report Detail (Single Product Page — Tier 1)**: The revenue-determining page. Must have these sections: **Executive Summary**, **Table of Contents**, and a prominent area to download the **Slide Demo**.

![][image12]

![][image13]

![][image14]

![][image15]

![][image16]
![][image17]
![][image18]
![][image19]

#### Report Detail Page Technical Specification (Product Page Specification)

1. **Hero Section Layout (First Conversion Zone)**
   1.1. Design the screen with a **Split-screen** layout following **Minimalism** standards to clearly allocate **Visual Weight**.
   1.2. The left display block contains the **H1 Headline** (Full report name) and a **Metadata** strip (PDF icon • Page count • Publication Month/Year).
   1.3. Directly below the metadata strip are 3 lines of **Executive Summary** distilling the most macro-level **Insights** from the report.
   1.4. The right display block acts as the **Conversion Engine**, containing a large **Price Tag** and the single **Call-to-Action (CTA)** button: **"Purchase to Download Full Report"**.

2. **Intelligence Scope Area (Problem-Solving Scope)**
   2.1. Placed directly below the Hero Section, using a clear heading: **"Key Strategic Questions Answered"**.
   2.2. Present 3 to 5 strategic questions in a large **Bullet points** format.
   2.3. The architectural purpose is to directly target the **Pain points** of **C-level** executives through a **Data-driven** mindset, stimulating the desire to own the answers.

3. **Interactive Slide Demo Area (Interactive Preview Experience)**
   3.1. Absolutely do not embed generic **PDF iFrames** — this would compromise the **Premium B2B SaaS** positioning.
   3.2. Display a maximum of 6 premium slides using an **Interactive Image Carousel** (high-resolution sliding frame).
   3.3. Integrate a **Fullscreen** icon at the frame corner; when clicked, the slide expands to fill the screen with a **Dark Overlay** background to create maximum **Cognitive Focus**.
   3.4. Developers must automatically insert **Watermarks** and implement a **Disable Right-click** script to prevent image copying.

4. **Table of Contents Area (Report Index)**
   4.1. Design the table of contents using an **Accordion UI** (collapsible layered menu) — clean and static.
   4.2. Customers click on a chapter name to expand sub-items, completely eliminating **Endless scrolling**.

5. **Transaction Flow & Sticky CTA**
   5.1. The system defaults to requiring the **User** to be **Logged-in** when accessing or interacting with this page.
   5.2. When clicking **"Purchase to Download Full Report"**, the system does not redirect to a new page but opens a **Payment Pop-up** (secure payment frame) inline.
   5.3. After a successful transaction, the page triggers an **Auto-refresh**, converting the purchase button into **"Download Purchased Report"** to download the original PDF file.
   5.4. Activate the **Sticky Bottom Bar** feature (a sales-close bar fixed at the bottom edge of the screen) containing the Report Name, Price, and Purchase button — ensuring the **Checkout** button is always visible as users scroll.
   5.5. The purchased report file is automatically synced to **Purchase History** in the **Client Portal** so customers can re-download at any time.

#### Report Detail Page Technical Specification Summary Table

| UI Section | Core Technical Specs | Data-driven Purpose |
| :---- | :---- | :---- |
| **1\. Hero Section** | **Split-screen**, **Metadata**, **Executive Summary**, **Price Tag**. | Deliver static information, drive **Conversion** immediately on first screen. |
| **2\. Intelligence Scope** | 3-5 strategic questions (**Bullet points**). | Address investor **Pain points** to create purchase motivation. |
| **3\. Slide Demo** | **Image Carousel** (6 images), **Fullscreen**, **Disable Right-click**. | **Premium** experience, eliminates PDF iframe friction, protects copyright. |
| **4\. Table of Contents** | **Accordion UI** (collapsible layered) interface. | Adheres to **Minimalism**, keeps display space clean. |
| **5\. Transaction Flow** | Requires **Login**, **Payment Pop-up**, unlocks **Download**. | One-touch sales close (**Frictionless**), delivers **Wisdom** asset immediately. |
| **6\. Tracking & CTA** | **Sticky Bottom Bar**, sync file to **Client Portal**. | Ensures high conversion rate and sustainable customer service. |

### 2.5.2. Client Portal (Intelligence Archive): Customer asset management page.

![][image20]
![][image21]
![][image22]
![][image23]
![][image24]

### 1.1. This is where customers manage all **Reports** they have purchased. This page must not have superfluous social-media-style features. 1.2. Core functions: **Download Center** (Displays purchased report list as a table), **Profile Settings** (Manage company information), and **Billing History** (Invoices/receipts for corporate accounting), **Custom Research Tracker (Tier 2 Project Tracking)**. 1.3. Strategic significance: Builds long-term trust and turns the website into investors' own private **Library**.

#### Client Portal Architecture Specification (Intelligence Archive)

1. **Portal Layout Architecture**
   1.1. The interface uses a minimal **Sidebar Navigation** (left navigation bar) to optimize the **Data** display space.
   1.2. Primary color scheme: White, Charcoal Gray, and VNSIR's Navy Blue. Absolutely no colorful icons or advertising banners.
   1.3. Apply the spirit of **Surgical Precision**: Every piece of displayed information must have a clear purpose, completely eliminating **Cognitive Noise**.

2. **Intelligence Archive (Tier 1 Report Library)**
   2.1. Displayed as a streamlined **Data Table** rather than large Cards to conserve space.
   2.2. Mandatory data columns: **Report Name**, **Category**, **Purchase Date**, and a **Download PDF** button (personalized **Watermark** stamped).
   2.3. Integrate **Search within Archive** feature: Allows customers to quickly search keywords within the reports they own.

3. ### **Client Portal "War Room" Architecture & Payment Flow**

1. **Visual Consistency** 1.1. **Color Scheme**: Bring the entire "War Room" interface to a white (White/Off-white) background, Charcoal text, and Navy Blue accent points to 100% synchronize with the VNSIR ecosystem. 1.2. Completely remove the dark background blocks (Dark mode) from old drafts, restoring a bright, static display space that elevates **Data**.

2. **Precision Timeline Tracking** 2.1. **Project Header**: Directly below the project name, add two static data fields: **Start Date** and **Expected Deadline**. 2.2. **Micro-Timestamps**: In the **Vertical Milestone Timeline** section, under each milestone (Phase) display the actual completion date and time (e.g., *Completed: Apr 12, 14:30*). 2.3. This reflects a **Data-driven** mindset — an absolute commitment to timeline transparency for **C-level** clients.

3. **Tier 2 Paywall Logic** 3.1. This is an extremely important business workflow. When a project enters the final phase (**Final Delivery**), the Admin uploads the report via the **Backend CMS**. 3.2. **Locked Vault State**: On the **Frontend**, the PDF file appears in the **Secure Vault** area but the download icon is replaced by a lock. 3.3. **Transactional CTA**: The button then displays the decisive message: **"Pay Invoice ($X,000) to Unlock Full Report"**. 3.4. **Seamless Unlock**: When the User clicks, the system opens a **Payment Pop-up** (Stripe-integrated) to process the credit card directly on the page. Upon successful payment, a **Webhook** automatically unlocks the **Download** button instantly, without requiring a page reload.

5. **Billing History & Profile Settings**
   4.1. **Billing History**: Displays a list of electronic invoices (**E-invoices**) as a list, supporting PDF downloads for the partner company's accounting department.
   4.2. **Profile Settings**: Allows updating of corporate legal entity information and high-security password management.
   4.3. **Access Logs**: Displays login history so customers can self-monitor their account security level.

#### Client Portal Architecture Summary Table

| Section | Core Features | Strategic Value |
| :---- | :---- | :---- |
| **Intelligence Archive** | **Tier 1** report list, PDF re-download button. | Turns VNSIR into a long-term **Digital Library** for investors. |
| **Custom Research Tracker** | Project status roadmap, private report archive. | Increases **Transparency** and professionalism for Tier 2 services. |
| **Billing History** | Download corporate invoices/receipts. | Optimizes administrative processes for **B2B** customers. |
| **Profile & Security** | Legal entity management, Access logs. | Reinforces **Trust Signals** regarding security and legality. |

### **2.5.3. Access & Authentication Flow (Login/Register): System access gateway**

### **![][image25]** 2.1. This is not merely a Login page — it is a **Gatekeeping** step. The design must exude absolute **Security**. 2.2. Functions: **Login**, **Forgot Password**, and especially **Account Verification** (Account verification via corporate email). 2.3. **Data-driven** mindset: Collect initial data about the customer's industry during the registration step to personalize the reports displayed later.

#### Open Access Flow Architecture Specification

1. **Architectural & UI Guidelines**
   1.1. **Minimalist Auth Box**: Centered interface, completely removing superfluous illustrations. Page background uses white or light gray, creating an absolutely static space.
   1.2. **Social Login/SSO Buttons**: Integration buttons (Google, WhatsApp) do not use the original vibrant colors of these platforms. **Premium B2B** standard: Buttons displayed as Outline buttons with Monochrome logos or subtle Charcoal gray.

2. **Authentication Mechanics**
   2.1. **Single Sign-On (SSO)**: Integrate 3 core gateways:
   * **Continue with Google**: The universal standard for global users.
   * **Continue with WhatsApp**: Particularly effective in Asian markets, helps verify phone numbers and opens an extremely powerful Direct Message channel for the Sales team.
   * **Continue with LinkedIn**: The ultimate weapon for **B2B SaaS**. LinkedIn integration allows the system to automatically scrape **Job Title** and **Company**, minimizing the number of data fields users must fill in manually.
   2.2. **Email Verification (Traditional)**: Customer enters Email -> System sends a **Magic Link** (one-time login link) or a 6-digit **OTP** code. No password required (**Passwordless**) to completely eliminate the cumbersome "Forgot Password" feature and reduce **Cognitive Load** for customers.

3. **Data-driven Onboarding**
   3.1. **Progressive Profiling**: Since the system is open to everyone, immediately after first successful login, the user is taken through an ultra-fast **Onboarding** screen (single screen only).
   3.2. Require 2 mandatory data fields to proceed: **Job Title** and **Industry Focus** (Dropdown format). This data pushes directly to the **CRM** to personalize **Tier 1** reports displayed on the **Intelligence Hub**.
   3.3. **Tier 0 Default**: All newly created accounts are by default placed in the general user group, able to view and purchase public reports, preparing the upsell funnel for later.

---

#### Access Flow Architecture Specification Summary Table

| Component | Technical & UI Specs | Data-driven Purpose |
| :---- | :---- | :---- |
| **Overall UI** | **Minimalist Auth Box** centered, Monochrome SSO buttons. | Maintains **Premium** positioning, avoids "commoditization". |
| **SSO Gateway (Social)** | Integrate **Google**, **WhatsApp**, and **LinkedIn** APIs. | **Frictionless** login, automatic data collection. |
| **Email Verification** | **Passwordless Auth** (using **Magic Link** or **OTP**). | High security, eliminates password management/reset friction. |
| **Data Onboarding** | Pop-up screen asking **Job Title** and **Industry Focus**. | Serves **Personalization** and automatic **Lead** classification. |
| **Access Tier** | Assign default **Tier 0** status (General user). | Maximizes customer funnel for **Lead Nurturing**. |

### **2.5.4. Legal & Trust Center** 3.1. **Terms of Service (ToS) & Privacy Policy**: For international customers, these are mandatory pages to comply with **GDPR** or global data security regulations. 3.2. **Intellectual Property (IP) Policy**: Copyright declaration for content. VNSIR sells wisdom, so protecting **IP** is existential. 3.3. **Payment Security & Refund Policy**: Clear rules on payment and refunds (if any), helping remove the final psychological barriers before a customer swipes their card for $3,000.

### **Legal & Trust Center Architecture and Content Specification**

![][image26]
![][image27]
![][image28]
![][image29]

1. **UI/UX Architecture**

   1.1. Layout: Use a **Sticky Sidebar Navigation** structure (fixed left navigation bar) containing a list of policies. When a customer clicks on an item, the right-side content scrolls to that section, completely eliminating **Page Reload**.

   1.2. Absolute **Minimalism** compliance: No images whatsoever. Serif font combined with standards-compliant Sans-serif for legal documents. Dark gray text on white background to optimize **Readability** for **C-level** executives.

   1.3. **Transparency**: Must display a **Timestamp** at the top of the page (e.g., *Last updated: April 2026*) to reflect a **Data-driven** spirit and continuous updates.

2. **Terms of Service (ToS) & Privacy Policy**

   2.1. **Technical requirement**: Integrate a **Cookie Consent Banner** compliant with **GDPR** standards, displayed at the bottom edge of the screen the first time a user visits the website.

   2.2. **Mock Content for Canvas**:

   2.3. **Data Collection & GDPR Compliance**: VNSIR strictly complies with **GDPR** and global data protection frameworks. We collect **Corporate Data** solely for identity verification (**Whitelist Authentication**) and **Personalized Intelligence** delivery.

   2.4. **Confidentiality Protocol**: Your engagement with our **Custom Advisory** is protected by an automatic **Non-Disclosure Agreement (NDA)**. We maintain a strict **Strategic Stealth** model and do not monetize your data through third-party sharing.

3. **Intellectual Property Policy**

   3.1. **Technical requirement**: Integrate **Dynamic Watermarking** technology. Every downloaded PDF file automatically imprints the buyer's **Corporate Email** and **IP Address** as a hidden watermark for traceability in case of leakage.

   3.2. **Mock Content for Canvas**:

   3.3. **Asset Ownership**: All **Market Intelligence Reports**, strategic frameworks, and **Data Visualizations** remain the exclusive intellectual property of VNSIR. We sell **Wisdom**, not raw data redistribution rights.

   3.4. **Usage Rights**: Purchasing a **Tier 1 Report** grants a non-transferable, single-entity license. Unauthorized redistribution, reselling, or public sharing of our **Confidential Insights** is strictly prohibited and will result in immediate termination of access and legal action.

4. **Payment Security & Refund Policy**

   4.1. **Technical requirement**: Display **Trust Badges** (Stripe, PCI-DSS) in **Monochrome** (static grayscale) format at the bottom of the payment page.

   4.2. **Mock Content for Canvas**:

   4.3. **Enterprise-Grade Security**: All transactions are processed via PCI-DSS compliant global gateways. VNSIR employs **Zero-Knowledge** architecture for financial data; we do not store your raw credit card information.

   4.4. **Strict Refund Policy**: Due to the immediate digital delivery and proprietary nature of our **Intelligence Assets**, all sales of **Tier 1 Reports** are final. Refunds are only evaluated in documented cases of technical delivery failure, ensuring fairness while protecting our **Intellectual Property**.

### **Legal & Trust Center Architecture Summary Table**

| Policy Category | Technical Features | Mock Content Excerpt | Data-driven Purpose |
| :---- | :---- | :---- | :---- |
| **Privacy Policy** | **GDPR Cookie Banner**, **Timestamp**. | Strictly complies with **GDPR**... protected by **NDA**. | Creates the highest **Trust Signals** for international investors. |
| **Intellectual Property** | **Dynamic Watermarking** (auto email watermark). | All **Market Intelligence** is exclusive property... single-entity license. | Prevents copyright infringement, protects core digital assets. |
| **Payment & Refund** | **Monochrome Trust Badges** (PCI-DSS). | All sales are final... no raw credit card info stored. | Asserts enterprise-grade security, prevents fraud on high-value products. |
| **Overall UI** | **Sticky Sidebar**, pure-text **Minimalism** design. | N/A | Reduces **Cognitive Load**, focuses on legal seriousness and authority. |

**2.5.5. Search & Advanced Filtering Results: Advanced search results page**

**![][image30]**

**![][image31]**

4.1. As VNSIR's report library grows to hundreds of titles, the homepage cannot display them all. We need a search results page with an advanced **Faceted Search** filter.
4.2. Allows filtering by: **Region**, **Timeline**, **Verticals**, and the **Framework** used in the report.

# **3\. Phase 3: Wireframing & UX**

3.1. **UX Design:** Focus on streamlining. The purchase process should be no more than 3 clicks.

3.2. **Responsive Design:** Ensure perfect display on Mobile and Tablet, as Managers typically read reports while on the move.

# **4\. Phase 4: UI Design**

4.1. **Visual Assets:** Requirements for fonts (modern Sans-serif), minimal icons.

4.2. **Look & Feel:** Emulate the professionalism of **Cimigo** but more modern and focused on digital products.

# **5\. Phase 5: Technical Requirements**

## 5.1. **Backend & CMS:** Use an easy-to-use content management platform (such as WordPress + WooCommerce or Shopify) to allow self-updating of Reports.

### 5.1.1. **Report Database Architecture**: Create **Custom Post Types (CPT)** and **Advanced Custom Fields (ACF)**. This is the tool for self-updating Reports, entering **Headlines**, **Price Tags**, and uploading files intuitively in 3 minutes without needing to write code.

### Link: [https://gemini.google.com/share/684520eb9ee0](https://gemini.google.com/share/684520eb9ee0)

![][image32]

![][image33]

### **Backend & CMS Technical Requirements Specification (Handoff Specification)**

1. **Product Database Architecture**
   1.1. Absolutely do not use WordPress's default "Post" format. Developers must create a separate **Custom Post Type (CPT)** named **"Intelligence Reports"**.
   1.2. This completely separates the sales report database from standard posts in **The Analyst Brief**, optimizing **Query Speed** and **SEO** structure.

2. **Custom Fields Data Entry When Publishing a Report**
   2.1. The Dev team must set up a backend publishing interface (**Backend UI**) using minimal **Advanced Custom Fields (ACF)**.

3. 2.2. **Static Metadata** fields: Enter **Title** (Report name), **Price Tag** (Sale price in USD), **SKU** (Report identifier code), and **Page Count** (Number of pages).
   2.3. **Core Content** fields: A 3-line **Executive Summary** input box, and a **Key Strategic Questions** list input box (automatically formatted as **Bullet points** on the Frontend).
   2.4. **Digital Assets Upload** area: One button to upload the original **PDF** file (Hidden, secure), and a module to upload 6 high-quality images for the system to automatically generate the **Image Carousel** (Demo sliding frame) on the user interface.

4. **User Management & Role-Based Access Control (RBAC)**
   3.1. Integrate a **CRM** management system directly in the **Backend**. The **User** list must clearly display columns: **Corporate Email**, **Job Title**, **Industry Focus**, and **Total Spent**.
   3.2. Add a **Manual Whitelisting Toggle** feature. In each User's Profile, the admin can tick-select to grant access to hidden categories (e.g., [x] Gaming, [x] E-commerce).
   3.3. Apply **Role-Based Access Control (RBAC)** internally for VNSIR: Grant **Super Admin** permission (Full system access, revenue management) to the owner, and **Editor / Analyst** permission (Can only publish reports, cannot view revenue) to junior staff.

5. **Automation & Security Core**
   4.1. **Digital Delivery System**: Require integration of a plugin or custom code so that when the order status from the payment gateway reports "Success" (**Processing / Completed**), the system automatically releases a **Download** link into that User's **Client Portal**.
   4.2. **Dynamic Watermarking**: Dev must integrate an automatic PDF watermarking library. Before a file is downloaded, the system takes 2 seconds to invisibly imprint the buyer's **Corporate Email** and **Timestamp** on the corner of each page of the report.
   4.3. **File Protection**: Configure .htaccess file or server permission rules to completely block **Direct URL Access** to the directory containing the original PDF files.

### **Dev Handoff Table Summary**

| Function Module | Core Technical Specs | Admin Purpose |
| :---- | :---- | :---- |
| **Data Structure** | Create a separate **Custom Post Type** for **Reports**. | Cleanly separates the data repository, optimizes query performance. |
| **Publishing Interface** | Use **Advanced Custom Fields (ACF)** in static mode. | **Minimalism**-standard management, eliminates need to write code during operation. |
| **CRM & Access Control** | User dashboard with **Whitelist Toggle** button. | Grant **Stealth Mode** visually with a single click. |
| **Digital Asset Security** | **Dynamic Watermarking**, block file access via **Direct URL**. | Automated **Intellectual Property** protection without human effort. |

### 5.1.2. **User Management & CRM System**: Integrate customer profile list directly in the **Admin Dashboard**, collecting **Lead** fields such as **Job Title**, **Industry Focus**.

### Link: [https://gemini.google.com/share/8611bfdc9a99](https://gemini.google.com/share/8611bfdc9a99)

![][image34]
![][image35]

### **User Management & Behavioral Tracking Architecture (CRM & Tracking Architecture)**

### **Core Profile Data Architecture**

### 1.1. **Static Data**: Collected through registration form and **Onboarding** process: **Full Name**, **Job Title**, **Corporate Email**, and **Industry Focus**. 1.2. **Dynamic Classification**: The system automatically tiers Users (e.g., Prospect, Basic Buyer, VIP Investor) based on **Total Spend** and **Whitelist** authorization level.

1. ### **Event-Driven Tracking Mechanics** 2.1. **Micro-Interactions**: Don't stop at general Pageviews. Developers must attach tracking codes (Tracking Events) for specific actions: Click count on the **Image Carousel** arrows (viewing the Slide Demo), page **Scroll Depth** on analytical articles, and number of clicks on the **Table of Contents**. 2.2. **Search Query Logging**: The system logs all keywords entered on the **Advanced Search** page. Especially, searches returning **Zero-Result** (No results) are a gold mine of **Insights** for determining topics for future **Tier 1** reports. 2.3. **Cross-session Tracking**: Identify users via **Cookie** and **IP Tracking** even when they haven't **Logged in**. Once they successfully log in, the system automatically merges all previous browsing history into the official **Corporate Email** profile.

2. ### **Analytics & Lead Scoring** 3.1. **Engagement Scoring**: Set up automatic weights for each behavior. For example: Viewing **The Analyst Brief** (+5 points), reading through the **Slide Demo** (+20 points), filling out the **Custom Advisory** form (+50 points). When a User reaches the set threshold, the profile transitions to "Hot Lead" status for proactive outreach. 3.2. **Financial Metrics**: The dashboard automatically calculates financial health metrics for each account such as **ARPU** (Average Revenue Per User) and **LTV** (Lifetime Value). This data immediately identifies the "Whale" group generating the highest profit margins. 3.3. **Churn Risk Analysis**: Closely monitor **Retention Rate**. If a customer who previously purchased a report has not logged in (Inactive) within 90 days, the system adds them to a "Silent Alert" list to deploy a specialized **Lead Nurturing** email campaign.

---

### CRM & Tracking Architecture Summary Table

| Function Module | Technical Specs | Data-driven Purpose |
| :---- | :---- | :---- |
| **Customer Profile** | Record **Static Data** & tier with **Dynamic Tiers**. | Store professional identity information, ready for segmentation. |
| **Event Tracking** | Attach tracking code for clicks, scroll depth, **Slide Demo** views. | Read actual interest level for each **Report**. |
| **Search Logging** | Store all keywords, especially **Zero-Result** searches. | Extract **Insights** on latent market demand (**Shadow Market**). |
| **Lead Scoring** | Automatic scoring based on **Engagement**. | Identify high-potential leads to prioritize care or grant **Whitelist**. |
| **Financial Metrics** | Automatically measure **ARPU**, **LTV**, and **Retention Rate**. | Control revenue efficiency and optimize customer lifetime. |

---

### 5.1.3. Access Control Mechanism (RBAC): Set up a Whitelist Toggle button in customer profiles to allow Admin to grant access to hidden categories (Stealth Mode).

### Link: [https://gemini.google.com/share/24af8b1dfbc2](https://gemini.google.com/share/24af8b1dfbc2)

![][image36]

### **RBAC & Stealth Mode Access Control Technical Specification (Dev Handoff)**

1. ### **Database & Query Logic** 1.1. **User Meta Data**: The state of **Whitelist** toggle buttons must be stored directly in the wp\_usermeta table (or equivalent) as Boolean values (True/False). Example: vnsir\_access\_gaming = true. 1.2. **Query Interception**: Developers must use **Hooks** (such as pre\_get\_posts in WordPress) to intercept the report data loading loop on the **Frontend**. 1.3. **Zero-Knowledge UI**: If User Meta returns false for the "Gaming" category, the Backend system must absolutely not output **HTML/DOM** code for that category to the user's browser. Never use CSS hiding techniques (display: none), as competitors can easily use **Inspect Element** to scrape data.

2. ### **Backend Admin UX** 2.1. **AJAX Toggle Switches**: The toggle (Toggle) interface in the User Profile must use **AJAX** technology. When the grant-access toggle is switched, the system saves data immediately to the database in an instant without requiring a full page reload (**No Page Reload**), creating an absolutely **Frictionless** experience. 2.2. **Timestamp Logging**: Every time the **Whitelist** state changes, the system must automatically write a hidden log (time of access grant, who granted it) to serve **Security Audit** purposes.

---

### **RBAC & Whitelist Mechanism Specification Summary Table**

| Technical Component | Core Requirements | Data-driven Purpose |
| :---- | :---- | :---- |
| **Data Storage** | Store **Boolean** values (True/False) in **User Meta**. | Bind hidden access rights to each customer's unique identity. |
| **Query Interception** | Use **Hooks** to intercept data queries from Server. | Prevent data leakage from the core system layer. |
| **Zero-Knowledge UI** | Block **HTML/DOM** code output if User lacks permission. | Prevent competitors from using **Bots** to scrape data or source inspection tools. |
| **Backend UX** | Use **AJAX** toggle switches (Save directly without page reload). | Optimize Admin workflow efficiency, **Premium** experience standard. |
| **Security Audit** | **Timestamp Logging** when access permission state changes. | Control internal security risks, trace decision history. |

---

### **Part 3: Executive Summary**

### The **RBAC Whitelist Toggle** feature is the heart of the **Stealth Mode** strategy, defining the difference between VNSIR and ordinary report retail pages. Technically, it requires developers to deeply intervene in the database layer (**Query Interception**) to block **HTML** code output to the browser if the user is not granted access — establishing a perfect **Zero-Knowledge UI** state to prevent data scraping. From an administrative perspective, using **AJAX** technology for toggle switches provides a smooth, static control experience, allowing precise and absolutely secure access permission granting for hidden intelligence categories to **C-level** executives with a single click.

### 5.1.4. Custom Research Project Management (Tier 2): A tool allowing Admin to update project Milestone status for display on the customer's Client Portal.

### Link: [https://gemini.google.com/share/ac503752cff0](https://gemini.google.com/share/ac503752cff0)

![][image37]

### **"War Room" Backend Administration Technical Specification (Admin Command Center)**

1. **Multi-Project Management & Data Routing**
   1.1. **Client Relational Assignment**: Developers use an **ACF Relational Field** to create a searchable dropdown box. When creating a new project, simply type the customer's **Corporate Email** and the system will automatically map (match) this project into the correct **Project Switcher** menu on their **Client Portal**.
   1.2. **Project Status Dashboard**: On the **Tier 2 Projects** list screen, display static columns: **Project Name**, **Assigned Client**, **Current Phase**, and **Payment Status** (Paid / Locked).

2. **Mandate & Timeline Controller**
   2.1. **Immutable Mandate Box**: Program a **Read-only Textarea** block. The system automatically pulls all content from the original **Custom Advisory** form into this box. Can be re-read at any time to stay aligned with **KPIs** without risk of accidentally editing and distorting the **Single Source of Truth**.
   2.2. **Precision Timeline Fields**: Use a minimal **Date Picker** to set **Project Start Date** and **Expected Deadline**. This data pushes directly to the "War Room" **Header**.

3. **Milestone & Paywall Logic**
   3.1. **ACF Phase Repeater**: Provides blocks to enter Phase name, select status (**Status Dropdown**: Pending/In-Progress/Completed), and the system automatically attaches **Micro-Timestamps** (actual date and time) when status transitions to "Completed".
   3.2. **Secure Vault & Paywall Toggle**: In the final Phase (Final Delivery), the system provides a **PDF** file upload button. Directly below is an **AJAX Toggle** switch named **"Lock with Paywall"** with an invoice amount input field (e.g., $5,000).
   3.3. **Execution Flow**: When this toggle is switched on and **Publish** is pressed, the system immediately locks the file on the Frontend and activates the **Pay Invoice to Unlock** button, ensuring absolute financial security before delivering **Wisdom**.

---

### **Backend Administration Interface Summary Table (War Room Admin)**

| Admin UI Section | Technical Specs | Data-driven & Security Purpose |
| :---- | :---- | :---- |
| **Client Assignment** | **Relational Field** linking customer Email. | Accurate multi-project management, no digital asset mix-ups. |
| **Mandate Box** | **Read-only Textarea** pulling data from original Form. | Maintains **Single Source of Truth**, eliminates **Scope Creep**. |
| **Timeline Configurator** | **Date Pickers** for Start Date & Deadline. | Visual, static control of time commitments. |
| **Milestone & Paywall** | PDF upload button + **Lock with Paywall** toggle + price input field. | The ultimate weapon protecting revenue flow (**Revenue Protection**). |

## 5.2. **Payment Gateway:** Integrate international payment (**Stripe, PayPal**) to receive USD from foreign customers.

### 5.2.1. **On-page Payment API Integration**: Configure **Stripe** or **PayPal** gateway to display as a **Payment Pop-up** directly on the **Report Detail** page to receive USD payments.

### Link: [https://gemini.google.com/share/b8bb5386dbcd](https://gemini.google.com/share/b8bb5386dbcd)

![][image38]

### **On-page Payment API Integration Technical Specification (On-page Checkout Flow)**

1. **On-page Checkout Architecture**
   1.1. Developers must use the **Stripe Elements** library to embed the credit card input form directly into the VNSIR interface.
   1.2. Activate **Dynamic Payment Routing**: The system automatically detects the customer's device or browser to display **Apple Pay** or **Google Pay** buttons respectively, reducing transaction time to just 1 click (FaceID/TouchID).
   1.3. For customers accessing from Chinese IP ranges, the system automatically displays additional **WeChat Pay** and **Alipay** QR code options through Stripe's extended API.

2. **Payment Pop-up UI/UX**
   2.1. Adhere to **Minimalism**: The payment form does not redirect to a new page but appears as a centered **Modal Pop-up**. The entire website background behind it will be blurred and darkened (**Dark Overlay**) to create absolute **Cognitive Focus** on the card-swiping action.
   2.2. **Order Summary**: Located on the left half of the Pop-up frame, displaying extremely static and clear parameters: **Report Title**, **SKU**, and **Total Price (USD)**. No space whatsoever for discount code input to protect the **Premium** positioning.
   2.3. **Secure Input & Trust Badges**: The right half is where card information is entered. Below the payment button, mandatory display of security certificates (**Trust Signals**) such as **PCI-DSS Compliant**, **256-bit SSL**, and Stripe logo in **Monochrome** Charcoal gray.

3. **Data Security & Backend Logic**
   3.1. Apply **Zero-Knowledge Data** architecture: Developers configure the system so that credit card data (Card Number, CVC) is transmitted directly from the customer's browser to Stripe's server via **Tokenization** encryption protocol. VNSIR absolutely does not store raw card information in the internal Database, thus avoiding complex legal liabilities.
   3.2. **Real-time Webhook Listener**: Configure the Backend to "listen" to responses from Stripe. The moment the payment\_intent.succeeded event (Payment successful) is reported, the system immediately closes the Pop-up, triggers a light **Auto-refresh** effect, and unlocks the **Digital Delivery** flow (PDF file download).

---

### **Payment API Integration Specification Summary Table**

| Technical Specs | Implementation | Data-driven Purpose |
| :---- | :---- | :---- |
| **Payment Architecture** | Use **Stripe Elements** to create **On-page** form. | Keeps customer on page, eliminates friction (**Frictionless**), increases sales close rate. |
| **Smart Routing** | Automatically display **Apple Pay/Google Pay/WeChat Pay**. | Serves multi-national **C-level** clients according to local payment habits. |
| **Payment Interface** | **Modal Pop-up** with split-screen and **Dark Overlay**. | Applies **Minimalism**, creates intense focus on the transaction action. |
| **Data Security** | **Tokenization** (No card storage), **Trust Badges** integrated. | Complies with international law, builds authoritative **Trust Signals**. |
| **Automation** | **Webhook** triggers file download immediately upon payment receipt. | Completes the self-contained, static operating machine. |

### 5.2.2. **Transaction Status Listening (Webhook)**: Background system that instantly identifies when money has entered the account, then signals the distribution system.

### Link: [https://gemini.google.com/share/85ccccb5ef27](https://gemini.google.com/share/85ccccb5ef27)

![][image39]

### **Transaction Status Listening Technical Specification (Webhook & Event Processing)**

1. **Core Webhook Architecture**
   1.1. **The Silent Listener**: Dev must initialize an independent **API Endpoint** on the VNSIR server (e.g., vnsir.com/api/webhooks/stripe). This endpoint operates 24/7, completely separate from the customer **Frontend** interface.
   1.2. **Server-to-Server Communication**: When a credit card is successfully charged, the **Stripe** server will proactively "call" (Send a POST Request) directly to the VNSIR server through this Endpoint to report the result, regardless of whether the customer has the website open or not.

2. **Event Processing & Security Verification**
   2.1. **Signature Verification**: To prevent the risk of **Hackers** impersonating Stripe to send file-unlock commands, Dev must configure the system to verify **Stripe Signature Secret** on each incoming message. Any command that doesn't match the security key will be blocked by the server at the gate (**Status 401 Unauthorized**).
   2.2. **Idempotency Logic**: This is the core algorithm. In a risky network environment, Stripe may send a success notification twice. The Backend must automatically check the **Event ID**: If the event has already been processed, it will skip the second command. This ensures the system never records phantom revenue or grants duplicate permissions.
   2.3. **Event Mapping**: The system must only be programmed to react to specific decisive event streams: payment\_intent.succeeded (Triggers the PDF file unlock flow), and charge.dispute.created (Card dispute / chargeback — triggers immediate revocation of report access).

3. **Background Administration & Diagnostic Dashboard UX**
   3.1. Webhook is inherently invisible, but with a **Data-driven** mindset, its "flow" must be visible.
   3.2. **Transaction Log View**: Dev must build a display screen in **WordPress Admin** that records all "calls" from Stripe.
   3.3. This dashboard provides absolute **Stoicism**: only seeing **Status 200 OK** responses, knowing that money has entered the account and goods have been delivered automatically, without requiring human intervention.

---

### **Webhook System Specification Summary Table**

| Technical Specs | Implementation | Data-driven Purpose |
| :---- | :---- | :---- |
| **System Communication** | Initialize **API Endpoint** to receive POST Requests. | Ensures 100% automatic delivery even if user's browser is suddenly closed. |
| **Endpoint Security** | **Signature Verification** (Digital signature verification). | Prevents intrusion and forgery of intellectual asset unlock commands. |
| **Duplicate-Prevention Processing** | **Idempotency** algorithm filtering **Event ID**. | Avoids double-processing errors, protects revenue data integrity. |
| **Risk Control** | Listens to the charge.dispute.created stream. | Automatically revokes **Wisdom** if a customer uses chargeback tactics. |
| **Visual Management** | Build **Diagnostic Dashboard** in Admin. | Transparentizes background processing flows, maintains **Stoicism** in operations. |

---

### 5.2.3. **Automated E-invoice Generation**: Automatically creates electronic invoices in PDF format stored in **Billing History** for **B2B** customer accounting purposes.

### Link: [https://gemini.google.com/share/d4ca09d9915d](https://gemini.google.com/share/d4ca09d9915d)

**![][image40]**

### **Automated E-invoice System Architecture Technical Specification**

1. **B2B Billing Data Architecture**
   1.1. **Corporate Identity Fields**: For invoices to have legal validity, within the payment form (**Stripe Payment Pop-up**), developers must configure collection of additional optional data fields: **Company Name**, **Billing Address**, and especially **Tax ID / VAT Number**.
   1.2. **Reverse Charge Mechanism**: In **B2B** transactions providing cross-border digital services (e.g., supplying to Europe), VNSIR typically does not need to collect VAT. A customer's valid **VAT Number** will be the legal basis for the system to automatically apply a 0% tax rate (**Zero-rated**) on the invoice, leaving the buyer's company to self-declare tax in their own country.

2. **Invoice Legal Standards & Rendering**
   2.1. **Immutable PDF Rendering**: Invoices must be automatically rendered by the system (via libraries such as PDF.js or Stripe Billing API) into a static **PDF** format. Absolutely do not allow HTML format that can be edited, ensuring **Data Integrity**.
   2.2. **Mandatory Data Points**: A standard international invoice must contain: VNSIR's legal entity information (Registered company name, Address, Business registration number), the prominent word "INVOICE", **Invoice Number** (Auto-incrementing, non-duplicate), **Date of Issue**, and customer information.
   2.3. **Line Items Breakdown**: The transaction detail section must demonstrate **Surgical Precision**: Report name (e.g., *Tier 1 Report: Shadow E-Logistics*), **SKU**, Unit price (USD), Tax rate (0%), and Total amount.

3. **Delivery & Vault Storage Flow**
   3.1. **Zero-Touch Delivery**: The system does not send invoices as direct email attachments (easily blocked by corporate Spam filters). The Webhook only sends a transaction success notification email, along with a secure link directing the customer back to the platform.
   3.2. **Client Portal — Billing History**: Within the **War Room** space or the customer's Profile management page, Dev must build a dedicated tab named **"Billing History"**. This stores all **PDF E-invoice** files to date — customers can log in and download for their accounting department at any time, completely eliminating email support requests (Support Tickets).

### **Automated E-invoice System Summary Table**

| System Function | Technical & Business Specs | SWOT Contribution |
| :---- | :---- | :---- |
| **B2B Billing Data** | Collect **Tax ID**, **Company Name** at checkout step. | Prevents legal tax risks (**Threats** mitigation). |
| **Invoice Rendering** | Auto-generate immutable **PDF** file. | Ensures accounting data transparency and integrity (**Strengths**). |
| **Legal Compliance** | Apply **Reverse Charge Mechanism**, clearly display both parties' info. | Complies with international tax law, ready to onboard corporate clients (**Opportunities**). |
| **Billing History** | Centralized invoice storage in **Client Portal**. | Reduces operational support costs, increases self-service experience (**Strengths**). |

## 5.3. **Digital Delivery System:** Mechanism for automatically sending download links or granting report access immediately after successful payment.

5.3.1. **Auto-unlock Mechanism**: Based on signals from the Webhook (Section 5.2), the system immediately unlocks the **Download** button or automatically sends a download link to the User's **Client Portal** (Intelligence Archive).
5.3.2. **Dynamic Watermarking**: A feature that automatically embeds the buyer's **Corporate Email** and **Timestamp** as a watermark on the PDF file in the moment before the file is downloaded to their device.

## 5.4. **Security & Privacy:** **SSL** certificate, customer data security (Comply with GDPR/CCPA for foreign customers).

5.4.1. **Identity & Access Management (IAM)**: Set up **SSO** (Google, LinkedIn) login portal by country IP, **Passwordless** login mechanism, and use **Regex Validation** to block spam emails.
5.4.2. **Digital Asset Protection**: Configure server permissions (.htaccess or Nginx) to absolutely block **Direct URL Access** to the directory containing the original PDF files.
5.4.3. **International Legal Compliance (GDPR/CCPA)**: Install **SSL** certificate to encrypt data flow, integrate **Cookie Consent Banner**, and ensure the system encrypts all credit card data per **PCI-DSS** standards.

# **6\. Phase 6: Content Strategy**

### **Content Strategy Specification**

1. **Brand Identity & Core Color Palette**
   1.1. **Core Philosophy**: Absolute adherence to **Minimalism** and **Stoicism**. Every **Visual Touchpoint** must reflect the data-driven mindset of an intelligence center.
   1.2. **Logo & Typography System**: Logo uses a golden-ratio **Wordmark** format, removing superfluous icons. **Headings** use **Serif** font to establish academic **Trust Signals**. **Body Text** uses **Sans-serif** font to optimize **Readability**.
   1.3. **Brand Palette**: Apply a 4-tone static color rule to define the space.
   1.4. **Pure White**: Serves as **Negative Space**, covering 60% of the platform background to create absolute focus on **Data**.
   1.5. **Charcoal**: Used for **Body Text**, helps reduce **Cognitive Load** and prevents eye strain when reading long reports.
   1.6. **Pure Black**: Used exclusively for **Logo Wordmark**, **Grid lines**, and **Headings**, creating sharp contrast and unmatched visual weight.
   1.7. **Navy Blue**: The color of decisiveness, appearing only in **CTA Buttons** (Payment buttons) and status charts to direct **Conversion**.
   1.8. **Visual Assets**: Completely eliminate **Stock Photos** with an industrial staging nature. Only use **Minimalist Photography** leveraging **Natural Light** and deep shadows to authentically depict the concept of **Shadow Market**.

2. **Copywriting & Executive Narrative**
   2.1. **Executive Tone**: The entire platform uses **Executive English**. Language must be direct, objective, quantified with data (**Data-driven**), completely eliminating cheap, **Salesy** language.
   2.2. **Core Narrative**: Drill deep into the **Pain points** of foreign investors: the lack of transparent data. VNSIR positions itself as the organization that exposes the **Shadow Market**, selling **Wisdom** rather than raw data.
   2.3. **Conversion-Driven Framework**: The product description structure follows sharp logic: **Blind Spot** (Identify the market blind spot) -> **Data Point** (Data VNSIR resolves) -> **Strategic Edge** (Strategic advantage gained).

3. **Data Visualization Strategy**
   3.1. **Interactive Charts**: Every chart on the web must be an **Interactive Chart**, allowing customers to **Hover** to peel back data layers, reflecting deep **Analytical** thinking.
   3.2. **Secondary Palette**: For **Complex Data**, never use bright colors. Build a separate color palette of **Muted Tones** / **Earth Tones** at the same **Luminance** level for a **Categorical Palette**.
   3.3. **Highlight & Mute Technique**: In complex comparison charts, use **Light Gray** to fade out noise data, and **Pure Black** or **Navy Blue** to exclusively highlight VNSIR's **Key Insights** (Core arguments).
   3.4. **Cross-Format Consistency**: Chart designs displayed on the web must be 100% synchronized with the charts inside **PDF Reports**. This consistency reinforces **Trust Signals**, affirming product quality from outside to inside.

---

### **Phase 6 Summary Table: Content Strategy**

| Category | Technical & Aesthetic Specs | Data-driven & SWOT Significance |
| :---- | :---- | :---- |
| **Brand Palette** | **Pure White**, **Charcoal**, **Pure Black**, **Navy Blue**. | **Strengths**: Creates **Stoicism** space, directs payment behavior with extreme precision. |
| **Typography** | **Serif** structure (Headings) and **Sans-serif** (Body). | **Opportunities**: Establishes academic authority, accelerates **Readability**. |
| **Visual Assets** | **Minimalist Photography** art, natural light. | **Threats Mitigated**: Avoids the fakeness and cheapness of mass-produced industrial imagery. |
| **Copywriting** | **Executive English**, **Blind Spot -> Data Point** structure. | **Strengths**: Manipulates **C-level** psychology, converts directly to revenue. |
| **Data Visualization** | **Muted Tones** palette, **Highlight & Mute** technique. | **Strengths**: Forces viewers to focus on core **Insights**, eliminates information noise. |
| **Consistency** | Synchronize **Interactive Charts** on Web and **PDF Reports**. | **Opportunities**: Asserts **Premium** position, reinforces trust of international partners. |

# **7\. Phase 7: Testing & Deployment**

7.1. **Quality Assurance (QA):** Test for payment errors, page load speed, security capabilities.

7.2. **SEO Optimization:** Build a SEO-compliant web structure so customers can find VNSIR when searching for "Vietnam Market Research".
