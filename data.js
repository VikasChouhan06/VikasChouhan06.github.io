/* Content for the portfolio. Edit here, not in the markup. */

const PROJECTS = [
  {
    name: 'Wallet & Coins System',
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
  }
];

const SKILLS = [
  ['API & Backend', [
    'Postman',
    'REST endpoint & CRUD validation',
    'Authentication (OAuth 2.0, Bearer, API Key, Basic)',
    'Request chaining with environment variables',
    'Schema, status code & response-time assertions',
    'Collection runner + Newman',
    'MySQL, Firebase, SQL query validation'
  ]],
  ['Automation Frameworks', [
    'Selenium WebDriver',
    'Appium (Android & iOS)',
    'Page Object Model + Page Factory',
    'TestNG, PyTest',
    'ExtentReports',
    'Data-driven test design',
    'Explicit waits & stable locator strategy'
  ]],
  ['Performance & Security', [
    'Apache JMeter',
    'Load, stress, spike, soak',
    'Correlation & parameterization (CSV Data Set)',
    'HTML dashboard reporting',
    'MobSF static analysis',
    'OWASP Mobile Top 10'
  ]],
  ['CI/CD & Infrastructure', [
    'Git & GitHub pull request workflow',
    'GitHub Actions workflow authoring',
    'Scheduled (cron) automation runs',
    'BrowserStack real device cloud',
    'Parallel execution',
    'Artifacts, reports & failure notifications'
  ]],
  ['Process & AI', [
    'Agile, Scrum sprints',
    'Jira, ClickUp, OpenProject',
    'Traceability matrices',
    'Defect lifecycle management',
    'RAG-based test case generation',
    'AI-assisted failure log analysis'
  ]]
];

const BULLETS = [
  'Built Android end-to-end suites in Appium with Page Object Model, covering booking, payment, slot selection, family management, reschedule and cancel flows. Regression coverage up 80%.',
  'Tested 30+ REST endpoints in Postman with boundary, negative and environment-based execution across multiple environments.',
  'Engineered JMeter load, stress and spike plans that surfaced critical bottlenecks before production.',
  'Audited Android builds in MobSF against the OWASP Mobile Top 10, flagging insecure storage and exposed endpoints.'
];

/* Companion lines */

const HERO_J = [
  ['dev: it works on my machine.', 'me: cool, we’ll ship your machine.'],
  ['dev: that’s not a bug, it’s a feature.', 'me: then it needs a test case.'],
  ['just one more edge case.']
];
const BUG_J = [
  'status: cannot reproduce. steps attached: 14.',
  'closed as won’t fix. reopened. again.',
  'found on friday, 5:58 pm. sorry.'
];
const SKILL_J = [
  'i read the requirements. all of them.',
  'what if the user enters an emoji in the phone field?'
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
