/* Content for the portfolio. Edit here, not in the markup. */

const PROJECTS = [
  {
    name: 'Wallet & Coins System',
    result: 'Coin balances stayed correct through full, partial and zero-balance redemption, including rollback when a payment failed.',
    context: 'In-app rewards wallet where users earn coins, or employers provide specific coins to their employees, and redeem them across multiple product features.',
    tags: ['Backend + Android app', 'Razorpay', '5+ features'],
    stations: ['Coins credited', 'Available across 5+ features', 'Applied at checkout'],
    branches: ['Full coins', 'Coins + Razorpay', 'Razorpay only'],
    bug: 2,
    tested: [
      'Backend wallet setup: coin crediting, ledger accuracy, balance consistency across services',
      'Coin allocation and redemption across 5+ features, each with its own eligibility rules and redemption caps',
      'Feature-wise allocation limits validated against the total wallet balance',
      'Full-redemption logic: behaviour when coins cover 100% of the transaction value',
      'Partial redemption: coins cover part, Razorpay covers the remainder',
      'Fallback once the balance hits zero: the feature must still work normally through standard payment',
      'Payment-failure rollback: coins restored rather than silently lost when the gateway declines',
      'Concurrent redemption across multiple sessions and devices on the same wallet',
      'Coin expiry, reversal on cancellation, and re-credit accuracy'
    ]
  },
  {
    name: 'Cashless Claim',
    result: 'Each claim verified end to end, from submission in the app to review on the dashboard and back.',
    context: 'End-to-end cashless claim journey where users initiate a claim and settle the payable portion using wallet coins.',
    tags: ['Android app + dashboard', 'Wallet coins', 'Cross-platform'],
    stations: ['Claim raised in app', 'Coins applied', 'Reviewed on dashboard', 'Status updated in app'],
    branches: [],
    bug: 1,
    tested: [
      'UI validation: form fields, mandatory-field handling, document upload (format, size, multiple files), error and empty states',
      'Functional flow: claim initiation, hospital/provider selection, policy eligibility checks, claim submission',
      'Claim status lifecycle and the notification raised at each stage',
      'Wallet coin application against the claimable amount, including partial-approval reconciliation',
      'Duplicate-submission handling and draft retention on network interruption',
      'Cross-platform verification: claim raised in the app, reviewed on the dashboard, status update flowing back to the app',
      'Role-based visibility and permissions on the dashboard side'
    ]
  },
  {
    name: 'Reimbursement Claims',
    result: 'Every review outcome checked for the right settled amount and the right coin re-credit.',
    context: 'The pay-first, claim-later journey. Users submit expenses for reimbursement and can offset applicable charges with wallet coins.',
    tags: ['Android app + dashboard', 'Wallet coins', 'Bill uploads'],
    stations: ['Expense submitted', 'Coins applied', 'Reviewed on dashboard'],
    branches: ['Approved', 'Partially approved', 'Rejected'],
    bug: 2,
    tested: [
      'Full submission flow: expense entry, bill and prescription upload, amount validation against policy limits',
      'Wallet coin usage within the reimbursement flow and its effect on the final settled amount',
      'Approved, partially approved and rejected handling, with coin reconciliation for each outcome',
      'Coin re-credit when a claim is rejected after coins were already applied',
      'Query loop: reviewer raises a query, user responds, claim resumes without duplicating the record',
      'Reimbursement status tracking and settlement confirmation',
      'Dashboard-side review actions reflecting correctly in the user’s app'
    ]
  },
  {
    name: 'Cancellation & Refund Logic',
    result: 'Refunds verified to return to the right source: coins to the wallet, cash back through Razorpay.',
    context: 'Cancellation across bookings and purchases, with refunds routed back to whichever method paid.',
    tags: ['Android app + dashboard', 'Razorpay', 'Wallet coins'],
    stations: ['Cancellation requested', 'Refund to original source'],
    branches: ['Coins to wallet', 'Cash via Razorpay', 'Both'],
    bug: 1,
    tested: [
      'Cancellation eligibility windows and the associated cancellation-fee slabs',
      'Refund split logic: coin portion returned to the wallet, cash portion reversed to the source via Razorpay',
      'Coin-only transactions refunding as coins rather than cash',
      'Partial cancellation where only part of an order or booking is cancelled',
      'Refund status tracking and timeline communication to the user',
      'Auto-cancellation triggers (payment timeout, provider-side cancellation) and the refunds they generate',
      'Gateway refund failure handling: no orders left stuck in a cancelled-but-unrefunded state',
      'Dashboard-initiated cancellation and its propagation to the app'
    ]
  },
  {
    name: 'Booking Regression Suite',
    result: 'The flows that matter every release are checked on real devices before anyone opens the app.',
    context: 'A Page Object Model suite in Java covering the booking journey, run on BrowserStack through GitHub Actions instead of by hand each release.',
    tags: ['Java + Appium', 'BrowserStack', 'GitHub Actions'],
    stations: ['Scheduled weekly, or on demand', 'Runs on BrowserStack real devices', 'Pass or fail reported', 'Report, screenshots, video kept'],
    branches: [],
    bug: 2,
    tested: [
      'Booking journey end to end: slot selection, payment, family members, reschedule and cancel',
      'Page Object Model structure, so a changed screen is fixed in one place rather than across every test',
      'Real devices and browsers on BrowserStack rather than emulators, to catch what only shows on hardware',
      'GitHub Actions pipeline with a weekly scheduled night run plus on-demand triggers',
      'Report, screenshots and video retained for every run, so a failure can be reviewed after the fact',
      'Flaky locators tracked down and stabilised, with AI used to speed up the debugging'
    ]
  }
];

const SKILLS = [
  ['Testing',
   'Functional, regression, smoke, sanity and edge cases written for every release, and 700+ defects found across frontend and backend.',
   ['Functional', 'Regression', 'Smoke', 'Sanity', 'Exploratory', 'End-to-end', 'UAT', 'Edge-case testing']],

  ['Automation & CI/CD',
   'The booking suite runs on BrowserStack real devices and browsers through GitHub Actions, scheduled weekly at night plus on demand, with report, screenshots and video kept for every run.',
   ['Java', 'Selenium', 'Playwright', 'Appium', 'Page Object Model', 'BrowserStack', 'GitHub Actions']],

  ['API, Performance & Security',
   'REST APIs checked in Postman against what the backend actually stored; JMeter load, stress and spike runs surfaced bottlenecks before release, and every Android build scanned in MobSF.',
   ['Postman', 'REST API testing', 'Apache JMeter (load, stress, spike)', 'MobSF', 'OWASP Mobile Top 10']],

  ['Backend & Data',
   'Wallet balances, refunds, coin expiry and user plans verified at the source, catching mismatches between what the app showed and what the backend had stored.',
   ['Django admin', 'Internal dashboards', 'SQL', 'MySQL', 'Firebase']],

  ['AI & LLM Testing',
   'AI drafts test cases and edge cases from user stories, generates test data and helps track down flaky locators. Every output reviewed before it is used.',
   ['DeepEval', 'RAG evaluation', 'AI-assisted test case design', 'Test data generation', 'Script debugging']],

  ['Bug Tracking & Documentation',
   'Every defect logged with steps, severity and video evidence, so it can be reproduced by someone who was not there.',
   ['Jira', 'ClickUp', 'OpenProject', 'Excel (test cases)', 'Word (reports)', 'Bug lifecycle']],

  ['Platforms & Process',
   'The same journey tested on Android, iOS and web, in an Agile team shipping on a sprint cadence.',
   ['Android', 'iOS', 'Web', 'Cross-browser', 'Git', 'GitHub', 'Agile / Scrum']]
];

const CERTS = [
  'Appium Mobile Automation',
  'Postman & REST API Testing',
  'Apache JMeter',
  'GitHub Actions CI/CD with Git & GitHub',
  'ISTQB Foundation Level (CTFL) — in progress'
];

const BULLETS = [
  'Built a Page Object Model suite in Java for the flows re-checked every release. It runs on BrowserStack real devices and browsers through GitHub Actions, weekly at night plus on demand, keeping report, screenshots and video for every run.',
  'Verified wallet balances, refunds, coin expiry and user plans in the Django admin and internal dashboards, catching mismatches between what the app showed and what the backend had stored.',
  'Tested REST APIs in Postman with boundary and negative cases across multiple environments.',
  'Engineered JMeter load, stress and spike plans that surfaced bottlenecks before release, and audited Android builds in MobSF against the OWASP Mobile Top 10.',
  'Used AI to draft test cases and edge cases from user stories, generate test data and debug flaky locators, reviewing every output before use.',
  'Tested 8+ signup types, each mapped to a different plan package, confirming every user received the right package and access.'
];

/* Companion lines — the questions a tester actually asks */

const HERO_J = [
  ['a password of only spaces.', 'it saved. of course it saved.'],
  ['two phones, one free booking.', 'both tapped at once. who wins?'],
  ['emoji in the phone field.', 'validated. it shouldn’t have.'],
  ['same button, three screens,', 'three different shades of red.'],
  ['dev: it works on my machine.', 'me: cool, we’ll ship your machine.']
];
const BUG_J = [
  'repro: two devices, one balance, tap together.',
  'the amount field accepts 500 characters.',
  'refund landed in the wrong wallet. once.',
  'blank space passed the required-field check.',
  'status: cannot reproduce. steps attached: 14.',
  'found on friday, 5:58 pm. sorry.'
];
const SKILL_J = [
  'is the date format the same in every feature?',
  'i read every requirement. then the gaps between them.'
];
const CONTACT_J = [
  'is there a deploy? on a friday?',
  'oh. you want to hire me. okay, awake now.'
];

const SETS = { hero: HERO_J, case: BUG_J, skills: SKILL_J, exp: HERO_J, contact: HERO_J };

const LEGS = {
  stand: 'M60 150 L60 192 L52 194 M80 150 L80 192 L88 194',
  a: 'M60 150 L52 190 L44 191 M80 150 L87 190 L95 192',
  b: 'M60 150 L67 190 L59 192 M80 150 L73 190 L81 191'
};

const SEC_POSE = { hero: 'hero', work: 'case', skills: 'skills', experience: 'exp', contact: 'contact' };

const ROW = 34;
