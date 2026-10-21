/**
 * The single, shared demonstration dataset for Prototype 3.
 *
 * Every public page, portal page and admin page reads from here, so figures and
 * names never drift apart: the member count on the public site, the members'
 * portal and the admin dashboard are computed from the same array. Mutations
 * made in the browser (a submitted form, a simulated dues payment, an admin
 * status change) are layered on top of this baseline by
 * `src/lib/demo/store.tsx`.
 *
 * Everything is fictional and illustrative. Names, businesses, scholarships,
 * grants and financial figures are invented for demonstration and are labelled
 * as such wherever they are shown.
 */
import { PROTOTYPE_IMAGES } from '@/content/prototype-images'

import type { DemoDataset } from './types'

export const DEMO_DATA: DemoDataset = {
  members: [
    {
      id: 'mem-001',
      name: 'Ada Nwosu',
      category: 'Full member',
      status: 'Active',
      location: 'Buguma',
      profession: 'Civil engineer',
      joinedOn: '2014-03-12',
      duesStatus: 'Paid',
      email: 'ada.nwosu@example.org',
      phone: '+234 800 000 0001',
      directoryVisible: true,
    },
    {
      id: 'mem-002',
      name: 'Tamunotonye Briggs',
      category: 'Full member',
      status: 'Active',
      location: 'Port Harcourt',
      profession: 'Medical doctor',
      joinedOn: '2015-07-01',
      duesStatus: 'Paid',
      email: 't.briggs@example.org',
      phone: '+234 800 000 0002',
      directoryVisible: true,
    },
    {
      id: 'mem-003',
      name: 'Ibifuro Amachree',
      category: 'Diaspora member',
      status: 'Active',
      location: 'London, United Kingdom',
      profession: 'Data scientist',
      joinedOn: '2019-11-20',
      duesStatus: 'Paid',
      email: 'ibifuro.amachree@example.org',
      phone: '+44 7700 000003',
      directoryVisible: true,
    },
    {
      id: 'mem-004',
      name: 'Soala Ogan',
      category: 'Associate member',
      status: 'Active',
      location: 'Abuja',
      profession: 'Barrister',
      joinedOn: '2018-02-09',
      duesStatus: 'Due',
      email: 'soala.ogan@example.org',
      phone: '+234 800 000 0004',
      directoryVisible: false,
    },
    {
      id: 'mem-005',
      name: 'Boma Tariah',
      category: 'Full member',
      status: 'Active',
      location: 'Buguma',
      profession: 'School principal',
      joinedOn: '2012-05-30',
      duesStatus: 'Paid',
      email: 'boma.tariah@example.org',
      phone: '+234 800 000 0005',
      directoryVisible: true,
    },
    {
      id: 'mem-006',
      name: 'Ebiere Dagogo',
      category: 'Student member',
      status: 'Pending',
      location: 'Rivers State',
      profession: 'Law student',
      joinedOn: '2026-01-15',
      duesStatus: 'Due',
      email: 'ebiere.dagogo@example.org',
      phone: '+234 800 000 0006',
      directoryVisible: false,
    },
    {
      id: 'mem-007',
      name: 'Ngozi Kalabari-Obi',
      category: 'Diaspora member',
      status: 'Active',
      location: 'Houston, United States',
      profession: 'Petroleum geologist',
      joinedOn: '2020-09-04',
      duesStatus: 'Overdue',
      email: 'ngozi.obi@example.org',
      phone: '+1 713 000 0007',
      directoryVisible: true,
    },
    {
      id: 'mem-008',
      name: 'Precious Abbey',
      category: 'Full member',
      status: 'Active',
      location: 'Buguma',
      profession: 'Fisheries cooperative manager',
      joinedOn: '2016-04-18',
      duesStatus: 'Paid',
      email: 'precious.abbey@example.org',
      phone: '+234 800 000 0008',
      directoryVisible: true,
    },
    {
      id: 'mem-009',
      name: 'Tamuno Georgewill',
      category: 'Patron',
      status: 'Active',
      location: 'Lagos',
      profession: 'Banker',
      joinedOn: '2011-01-11',
      duesStatus: 'Paid',
      email: 't.georgewill@example.org',
      phone: '+234 800 000 0009',
      directoryVisible: true,
    },
    {
      id: 'mem-010',
      name: 'Sotonye Jack',
      category: 'Associate member',
      status: 'Lapsed',
      location: 'Calabar',
      profession: 'Architect',
      joinedOn: '2017-08-22',
      duesStatus: 'Overdue',
      email: 'sotonye.jack@example.org',
      phone: '+234 800 000 0010',
      directoryVisible: false,
    },
    {
      id: 'mem-011',
      name: 'Bibi Oruwari',
      category: 'Diaspora member',
      status: 'Active',
      location: 'Toronto, Canada',
      profession: 'Nurse practitioner',
      joinedOn: '2021-06-02',
      duesStatus: 'Paid',
      email: 'bibi.oruwari@example.org',
      phone: '+1 416 000 0011',
      directoryVisible: true,
    },
    {
      id: 'mem-012',
      name: 'Igo West',
      category: 'Full member',
      status: 'Active',
      location: 'Bonny',
      profession: 'Marine surveyor',
      joinedOn: '2013-10-27',
      duesStatus: 'Paid',
      email: 'igo.west@example.org',
      phone: '+234 800 000 0012',
      directoryVisible: true,
    },
  ],

  duesInvoices: [
    { id: 'inv-001', memberId: 'mem-001', period: '2026 annual dues', amountNgn: 25000, dueDate: '2026-03-31', status: 'Paid', invoiceNo: 'BTA-DUES-2026-001' },
    { id: 'inv-002', memberId: 'mem-004', period: '2026 annual dues', amountNgn: 25000, dueDate: '2026-03-31', status: 'Due', invoiceNo: 'BTA-DUES-2026-004' },
    { id: 'inv-003', memberId: 'mem-006', period: '2026 student dues', amountNgn: 8000, dueDate: '2026-03-31', status: 'Due', invoiceNo: 'BTA-DUES-2026-006' },
    { id: 'inv-004', memberId: 'mem-007', period: '2025 annual dues', amountNgn: 25000, dueDate: '2025-03-31', status: 'Overdue', invoiceNo: 'BTA-DUES-2025-007' },
    { id: 'inv-005', memberId: 'mem-010', period: '2025 annual dues', amountNgn: 25000, dueDate: '2025-03-31', status: 'Overdue', invoiceNo: 'BTA-DUES-2025-010' },
  ],

  transactions: [
    { id: 'txn-001', memberId: 'mem-001', kind: 'Dues', description: '2026 annual dues', amountNgn: 25000, date: '2026-02-14', method: 'Simulated card', reference: 'DEMO-TXN-1001', receiptNo: 'BTA-RCP-1001' },
    { id: 'txn-002', memberId: 'mem-002', kind: 'Dues', description: '2026 annual dues', amountNgn: 25000, date: '2026-02-20', method: 'Simulated transfer', reference: 'DEMO-TXN-1002', receiptNo: 'BTA-RCP-1002' },
    { id: 'txn-003', memberId: 'mem-003', kind: 'Dues', description: '2026 diaspora dues', amountNgn: 40000, date: '2026-01-09', method: 'Simulated card', reference: 'DEMO-TXN-1003', receiptNo: 'BTA-RCP-1003' },
    { id: 'txn-004', memberId: null, kind: 'Contribution', description: 'Infrastructure fund', amountNgn: 150000, date: '2026-01-22', method: 'Simulated card', reference: 'DEMO-TXN-1004', receiptNo: 'BTA-RCP-1004' },
    { id: 'txn-005', memberId: null, kind: 'Contribution', description: 'Education and scholarships', amountNgn: 75000, date: '2026-02-03', method: 'Simulated transfer', reference: 'DEMO-TXN-1005', receiptNo: 'BTA-RCP-1005' },
    { id: 'txn-006', memberId: 'mem-005', kind: 'Dues', description: '2026 annual dues', amountNgn: 25000, date: '2026-02-27', method: 'Simulated card', reference: 'DEMO-TXN-1006', receiptNo: 'BTA-RCP-1006' },
  ],

  meetings: [
    { id: 'mtg-001', kind: 'Notice', title: 'Quarterly general meeting — March 2026', date: '2026-03-14', summary: 'Notice of the quarterly general meeting, including the venue and the business to be transacted.', documentRef: 'BTA-NOTICE-2026-03', status: 'Published' },
    { id: 'mtg-002', kind: 'Agenda', title: 'Agenda — March 2026 general meeting', date: '2026-03-10', summary: 'Six agenda items: dues review, project tracker, scholarship panel, diaspora chapter, youth fund and any other business.', documentRef: 'BTA-AGENDA-2026-03', status: 'Published' },
    { id: 'mtg-003', kind: 'Minutes', title: 'Approved minutes — December 2025 general meeting', date: '2025-12-13', summary: 'Approved minutes recording the decisions taken at the December 2025 general meeting.', documentRef: 'BTA-MIN-2025-12', status: 'Published' },
    { id: 'mtg-004', kind: 'Minutes', title: 'Approved minutes — September 2025 general meeting', date: '2025-09-20', summary: 'Approved minutes recording the decisions taken at the September 2025 general meeting.', documentRef: 'BTA-MIN-2025-09', status: 'Published' },
    { id: 'mtg-005', kind: 'Circular', title: 'Circular — update to the committee structure', date: '2025-11-05', summary: 'A circular explaining the new portfolio holders and the reporting lines for the project bank.', documentRef: 'BTA-CIRC-2025-04', status: 'Published' },
    { id: 'mtg-006', kind: 'Circular', title: 'Circular — scholarship panel call for nominations', date: '2026-02-18', summary: 'A call for nominations to the education and scholarships panel.', documentRef: 'BTA-CIRC-2026-02', status: 'Published' },
    { id: 'mtg-007', kind: 'Agenda', title: 'Draft agenda — June 2026 general meeting', date: '2026-06-13', summary: 'Draft agenda still being reviewed by the committee; not yet published to members.', documentRef: 'BTA-AGENDA-2026-06', status: 'Draft' },
  ],

  projects: [
    {
      id: 'prj-001',
      slug: 'buguma-community-hall-rehabilitation',
      name: 'Community hall rehabilitation',
      summary:
        'Re-roofing, re-wiring and accessibility works at the community hall used for general meetings and youth programmes.',
      description:
        'The hall is the association’s main gathering space. The rehabilitation replaces the leaking roof, modernises the electrical installation and adds a ramped entrance and accessible toilet. Works are carried out in phases so the hall can stay in use.',
      location: 'Buguma, Asari-Toru',
      category: 'Infrastructure',
      stage: 'Ongoing',
      estimatedCostNgn: 18500000,
      fundingTargetNgn: 18500000,
      raisedNgn: 11200000,
      startYear: 2025,
      beneficiaries: 'About 1,200 residents who use the hall each year',
      communityBenefits: [
        'A safe, dry venue for general meetings and community events',
        'Step-free access for older members and wheelchair users',
        'Reliable power for the youth reading room',
      ],
      milestones: [
        { label: 'Structural survey completed', done: true },
        { label: 'Roof and trusses replaced', done: true },
        { label: 'Electrical installation', done: false },
        { label: 'Accessibility works', done: false },
        { label: 'Handover to the community', done: false },
      ],
      updates: [
        { id: 'upd-001', date: '2026-02-10', title: 'Roof completed', body: 'The new roof and trusses were completed ahead of the rains and signed off by the works committee.' },
        { id: 'upd-002', date: '2026-01-18', title: 'Phase 2 funded', body: 'Member contributions and a diaspora pledge closed the funding gap for the electrical phase.' },
      ],
      documents: [
        { name: 'Phase 1 budget', kind: 'Budget', reference: 'BTA-PRJ-001-B1' },
        { name: 'Structural survey report', kind: 'Report', reference: 'BTA-PRJ-001-R1' },
      ],
      locationNote: 'Next to the market square, a short walk from the waterfront.',
      mapX: 38,
      mapY: 57,
      beforeAfter: {
        title: 'Roof works before and after',
        beforeImage: PROTOTYPE_IMAGES.boats,
        afterImage: PROTOTYPE_IMAGES.community,
        beforeLabel: 'February 2025 — pitted iron sheets',
        afterLabel: 'February 2026 — new roof in place',
      },
    },
    {
      id: 'prj-002',
      slug: 'water-sanitation-upgrade',
      name: 'Water and sanitation upgrade',
      summary:
        'A solar-powered borehole and a community sanitation block serving three streets near the waterfront.',
      description:
        'The project delivers a solar-powered borehole with a 10,000-litre storage tank and a small sanitation block. A local water committee is trained to maintain the pump, and a modest tariff covers replacement parts.',
      location: 'Buguma waterfront',
      category: 'Water and sanitation',
      stage: 'Ongoing',
      estimatedCostNgn: 24000000,
      fundingTargetNgn: 24000000,
      raisedNgn: 9600000,
      startYear: 2026,
      beneficiaries: 'Roughly 300 households within walking distance',
      communityBenefits: [
        'Reliable clean water during the dry season',
        'Reduced reliance on vendors and sachet water',
        'Local maintenance work for two technicians',
      ],
      milestones: [
        { label: 'Hydrogeological survey', done: true },
        { label: 'Borehole drilling', done: false },
        { label: 'Solar array and tank', done: false },
        { label: 'Sanitation block', done: false },
      ],
      updates: [
        { id: 'upd-003', date: '2026-02-02', title: 'Survey complete', body: 'The survey identified a suitable aquifer away from the saltwater wedge.' },
      ],
      documents: [{ name: 'Outline budget', kind: 'Budget', reference: 'BTA-PRJ-002-B1' }],
      locationNote: 'On the open ground between the jetty road and the primary school.',
      mapX: 30,
      mapY: 70,
      beforeAfter: null,
    },
    {
      id: 'prj-003',
      slug: 'secondary-school-scholarships',
      name: 'Secondary school scholarships',
      summary:
        'Means-tested scholarships covering fees, books and transport for twelve students each academic year.',
      description:
        'The scholarship scheme supports students from households that would otherwise struggle to keep them in school. Awards are means-tested by a panel and reviewed each term. This project page tracks the fund, not individual students.',
      location: 'Buguma and surrounding communities',
      category: 'Education',
      stage: 'Ongoing',
      estimatedCostNgn: 6000000,
      fundingTargetNgn: 6000000,
      raisedNgn: 4200000,
      startYear: 2024,
      beneficiaries: '12 students each academic year',
      communityBenefits: [
        'Reduced dropout among lower-income households',
        'A pipeline of young people into tertiary education',
        'Mentoring by member professionals',
      ],
      milestones: [
        { label: 'Panel constituted', done: true },
        { label: 'First cohort awarded', done: true },
        { label: 'Second cohort awarded', done: true },
        { label: 'Endowment target reached', done: false },
      ],
      updates: [
        { id: 'upd-004', date: '2026-01-30', title: 'Second cohort awarded', body: 'Twelve students were awarded for the 2025/26 academic year after means testing.' },
      ],
      documents: [
        { name: 'Panel terms of reference', kind: 'Approval', reference: 'BTA-PRJ-003-A1' },
        { name: 'Annual report', kind: 'Report', reference: 'BTA-PRJ-003-R1' },
      ],
      locationNote: 'Administered from the education sub-committee.',
      mapX: 52,
      mapY: 44,
      beforeAfter: null,
    },
    {
      id: 'prj-004',
      slug: 'primary-health-post-equipment',
      name: 'Primary health post equipment',
      summary:
        'Diagnostic equipment, a vaccine fridge and maternity supplies for the primary health post.',
      description:
        'The health post is the first point of care for many families. This project equips it with a working vaccine cold chain, basic diagnostics and safe maternity supplies, and supports refresher training for two nurses.',
      location: 'Buguma',
      category: 'Healthcare',
      stage: 'Approved',
      estimatedCostNgn: 9500000,
      fundingTargetNgn: 9500000,
      raisedNgn: 2100000,
      startYear: 2026,
      beneficiaries: 'Families within the health post catchment',
      communityBenefits: [
        'A reliable vaccine cold chain',
        'Basic diagnostics available locally',
        'Safer maternity care',
      ],
      milestones: [
        { label: 'Needs assessment', done: true },
        { label: 'Equipment procurement', done: false },
        { label: 'Nurse refresher training', done: false },
      ],
      updates: [
        { id: 'upd-005', date: '2026-02-20', title: 'Approved by the committee', body: 'The committee approved the procurement list following the health post assessment.' },
      ],
      documents: [{ name: 'Needs assessment', kind: 'Report', reference: 'BTA-PRJ-004-R1' }],
      locationNote: 'Beside the community hall.',
      mapX: 40,
      mapY: 52,
      beforeAfter: null,
    },
    {
      id: 'prj-005',
      slug: 'oral-history-archive',
      name: 'Oral history archive',
      summary:
        'Recording, transcribing and archiving the stories of elders, with a public listening room.',
      description:
        'The archive records interviews with elders, transcribes them, and stores both audio and transcripts. A small listening room lets members and school groups access the collection under supervision.',
      location: 'Buguma',
      category: 'Cultural preservation',
      stage: 'Ongoing',
      estimatedCostNgn: 7200000,
      fundingTargetNgn: 7200000,
      raisedNgn: 3600000,
      startYear: 2023,
      beneficiaries: 'Members, researchers and school groups',
      communityBenefits: [
        'A permanent record of local knowledge',
        'Teaching material for schools',
        'A shared heritage for the diaspora',
      ],
      milestones: [
        { label: 'Recording equipment acquired', done: true },
        { label: 'First 40 interviews recorded', done: true },
        { label: 'Transcription backlog cleared', done: false },
        { label: 'Listening room opened', done: false },
      ],
      updates: [
        { id: 'upd-006', date: '2026-01-12', title: 'Forty interviews recorded', body: 'Volunteers recorded the fortieth interview, bringing the collection to over sixty hours of audio.' },
      ],
      documents: [
        { name: 'Consent and access policy', kind: 'Approval', reference: 'BTA-PRJ-005-A1' },
        { name: 'Catalogue summary', kind: 'Report', reference: 'BTA-PRJ-005-R1' },
      ],
      locationNote: 'In the annex of the community hall.',
      mapX: 44,
      mapY: 60,
      beforeAfter: {
        title: 'Listening room conversion',
        beforeImage: PROTOTYPE_IMAGES.elder,
        afterImage: PROTOTYPE_IMAGES.people,
        beforeLabel: 'Before — unused store room',
        afterLabel: 'After — listening room under construction',
      },
    },
    {
      id: 'prj-006',
      slug: 'youth-vocational-workshop',
      name: 'Youth vocational workshop',
      summary:
        'A shared workshop for tailoring, carpentry and solar maintenance training for young people.',
      description:
        'The workshop gives school leavers practical skills and a route into work or self-employment. Training runs in short cycles with local artisans as instructors and a starter-toolkit grant on completion.',
      location: 'Buguma',
      category: 'Youth empowerment',
      stage: 'Proposed',
      estimatedCostNgn: 14200000,
      fundingTargetNgn: 14200000,
      raisedNgn: 0,
      startYear: 2026,
      beneficiaries: '40 trainees a year',
      communityBenefits: [
        'Practical skills for school leavers',
        'Support for local artisans',
        'A route into self-employment',
      ],
      milestones: [
        { label: 'Site identified', done: true },
        { label: 'Curriculum agreed', done: false },
        { label: 'Building works', done: false },
      ],
      updates: [],
      documents: [{ name: 'Concept note', kind: 'Report', reference: 'BTA-PRJ-006-R1' }],
      locationNote: 'Proposed site behind the primary school.',
      mapX: 56,
      mapY: 50,
      beforeAfter: null,
    },
    {
      id: 'prj-007',
      slug: 'river-cleanup-and-mangrove-restoration',
      name: 'River clean-up and mangrove restoration',
      summary:
        'Community clean-ups and mangrove replanting along the creeks with the fisheries cooperative.',
      description:
        'Working with the fisheries cooperative, volunteers clear plastic waste from the creeks and replant mangroves in degraded areas. The project also collects simple data on the fish catch to track recovery.',
      location: 'Buguma creeks',
      category: 'Water and sanitation',
      stage: 'Ongoing',
      estimatedCostNgn: 3800000,
      fundingTargetNgn: 3800000,
      raisedNgn: 3050000,
      startYear: 2025,
      beneficiaries: 'Fishing households and the wider creek ecosystem',
      communityBenefits: [
        'Healthier nursery grounds for fish',
        'Less plastic in the creeks',
        'Better data on the local fishery',
      ],
      milestones: [
        { label: 'Baseline survey', done: true },
        { label: 'First planting season', done: true },
        { label: 'Second planting season', done: false },
      ],
      updates: [
        { id: 'upd-007', date: '2026-02-08', title: '3,000 propagules planted', body: 'Volunteers planted three thousand mangrove propagules across two degraded sites.' },
      ],
      documents: [{ name: 'Baseline report', kind: 'Report', reference: 'BTA-PRJ-007-R1' }],
      locationNote: 'Along the creeks behind the waterfront.',
      mapX: 24,
      mapY: 78,
      beforeAfter: {
        title: 'Degraded creek bank restoration',
        beforeImage: PROTOTYPE_IMAGES.river,
        afterImage: PROTOTYPE_IMAGES.boats,
        beforeLabel: 'Before — cleared creek bank',
        afterLabel: 'After — first planting season',
      },
    },
    {
      id: 'prj-008',
      slug: 'members-welfare-fund',
      name: 'Members’ welfare fund',
      summary:
        'A modest, confidential fund for members facing bereavement or sudden hardship.',
      description:
        'The welfare fund makes small, confidential grants to members and their immediate families at times of bereavement or sudden hardship. Disbursements are recorded in aggregate only, to protect privacy.',
      location: 'Association-wide',
      category: 'Cultural preservation',
      stage: 'Completed',
      estimatedCostNgn: 4000000,
      fundingTargetNgn: 4000000,
      raisedNgn: 4000000,
      startYear: 2023,
      beneficiaries: 'Members and their families',
      communityBenefits: [
        'A dignified response to bereavement',
        'Immediate support in a crisis',
        'Strengthened member solidarity',
      ],
      milestones: [
        { label: 'Fund established', done: true },
        { label: 'First full year of operation', done: true },
        { label: 'Reviewed and re-endowed', done: true },
      ],
      updates: [
        { id: 'upd-008', date: '2025-12-01', title: 'Cycle completed', body: 'The first cycle completed and the fund was re-endowed for the next three years.' },
      ],
      documents: [{ name: 'Fund rules', kind: 'Approval', reference: 'BTA-PRJ-008-A1' }],
      locationNote: 'Administered confidentially by the welfare sub-committee.',
      mapX: 50,
      mapY: 66,
      beforeAfter: null,
    },
  ],

  donationCategories: [
    {
      id: 'infrastructure',
      label: 'Infrastructure',
      description: 'Community buildings, water and sanitation, and shared public spaces.',
      image: 'community',
    },
    {
      id: 'healthcare',
      label: 'Healthcare',
      description: 'Equipment, supplies and training for the primary health post.',
      image: 'people',
    },
    {
      id: 'education',
      label: 'Education',
      description: 'Scholarships, reading materials and school support.',
      image: 'hero',
    },
    {
      id: 'cultural-preservation',
      label: 'Cultural preservation',
      description: 'The oral history archive, language and heritage projects.',
      image: 'elder',
    },
    {
      id: 'youth-empowerment',
      label: 'Youth empowerment',
      description: 'Vocational training, mentoring and enterprise support for young people.',
      image: 'boats',
    },
  ],

  contributions: [
    { id: 'con-001', categoryId: 'infrastructure', amountNgn: 150000, contributorName: 'A member (anonymous)', anonymous: true, date: '2026-01-22', reference: 'DEMO-DON-2001', receiptNo: 'BTA-DON-2001' },
    { id: 'con-002', categoryId: 'education', amountNgn: 75000, contributorName: 'I. Amachree', anonymous: false, date: '2026-02-03', reference: 'DEMO-DON-2002', receiptNo: 'BTA-DON-2002' },
    { id: 'con-003', categoryId: 'cultural-preservation', amountNgn: 50000, contributorName: 'A member (anonymous)', anonymous: true, date: '2026-02-11', reference: 'DEMO-DON-2003', receiptNo: 'BTA-DON-2003' },
    { id: 'con-004', categoryId: 'youth-empowerment', amountNgn: 120000, contributorName: 'T. Georgewill', anonymous: false, date: '2026-02-19', reference: 'DEMO-DON-2004', receiptNo: 'BTA-DON-2004' },
    { id: 'con-005', categoryId: 'healthcare', amountNgn: 200000, contributorName: 'A member (anonymous)', anonymous: true, date: '2026-02-24', reference: 'DEMO-DON-2005', receiptNo: 'BTA-DON-2005' },
  ],

  knowledge: [
    {
      id: 'knw-001',
      slug: 'keeping-the-creeks-alive',
      kind: 'Research',
      title: 'Keeping the creeks alive: a community view of the fishery',
      author: 'Dr Tamunotonye Briggs',
      authorRole: 'Member, public health physician',
      date: '2026-02-16',
      topics: ['Blue economy', 'Environment', 'Research'],
      summary:
        'A short community-led study of catch sizes and water quality drawing on interviews with fishing households.',
      body: [
        'The creeks have supported fishing households for generations, but fishers report smaller catches and longer trips. This short study combines interviews with twenty households and simple spot measurements taken by volunteers.',
        'The findings are indicative rather than scientific: they describe what families are seeing, not a formal fishery assessment. They are published here so that members can discuss next steps and link the data to the mangrove restoration project.',
        'If you work in marine science, environmental monitoring or fisheries policy, the fisheries cooperative would welcome help turning this into a longer-term dataset.',
      ],
      status: 'Published',
    },
    {
      id: 'knw-002',
      slug: 'practical-personal-finance-for-members',
      kind: 'Webinar',
      title: 'Practical personal finance for members',
      author: 'T. Georgewill',
      authorRole: 'Member, banker',
      date: '2026-02-06',
      topics: ['Finance', 'Enterprise', 'Webinar'],
      summary:
        'A recorded session on saving, borrowing sensibly and avoiding the traps in informal lending.',
      body: [
        'This session was recorded at the Knowledge and Ideas Forum. It covers simple budgeting, how to compare the real cost of a loan, and how to build a small emergency fund.',
        'The slides and a plain-language summary are available in the resource library. Nothing in the session is financial advice for a specific situation.',
      ],
      status: 'Published',
    },
    {
      id: 'knw-003',
      slug: 'getting-a-first-role-in-technology',
      kind: 'Article',
      title: 'Getting a first role in technology without a computer science degree',
      author: 'Ibifuro Amachree',
      authorRole: 'Diaspora member, data scientist',
      date: '2026-01-28',
      topics: ['Technology', 'Careers', 'Youth'],
      summary:
        'A practical guide for school leavers and graduates on building skills, portfolios and networks.',
      body: [
        'You do not need a computer science degree to get a first role in technology, but you do need evidence that you can do the work. Employers hiring junior candidates look for a small portfolio, a willingness to learn and a clear way of explaining your decisions.',
        'This article lists free and low-cost learning resources, suggests three portfolio projects and explains how to ask for mentorship. It is written from the author’s own experience of transitioning into data work.',
      ],
      status: 'Published',
    },
    {
      id: 'knw-004',
      slug: 'road-safety-in-riverine-communities',
      kind: 'Report',
      title: 'River safety: what the community told us',
      author: 'BTA Community Safety Working Group',
      authorRole: 'Volunteer working group',
      date: '2025-12-20',
      topics: ['Community', 'Safety', 'Report'],
      summary:
        'A summary of a community consultation on boat safety, lighting and emergency response.',
      body: [
        'The working group consulted boat operators, market traders and the health post on river safety. The consultation identified lighting at the jetty, access to life jackets and a simple emergency contact chain as the three priorities.',
        'The report is a community record, not an official investigation. It is published to inform the next round of project proposals.',
      ],
      status: 'Published',
    },
    {
      id: 'knw-005',
      slug: 'traditional-crafts-and-modern-markets',
      kind: 'Article',
      title: 'Traditional crafts and modern markets',
      author: 'Precious Abbey',
      authorRole: 'Member, cooperative manager',
      date: '2026-02-22',
      topics: ['Enterprise', 'Heritage', 'Culture'],
      summary:
        'How weavers and carvers can reach buyers at home and abroad without losing control of their craft.',
      body: [
        'Craft is both heritage and livelihood. This article looks at how makers can sell through cooperatives, price their work fairly and use photography and simple online storefronts to reach diaspora buyers.',
        'The emphasis is on keeping ownership with the makers and on telling the story of each piece honestly.',
      ],
      status: 'In review',
    },
    {
      id: 'knw-006',
      slug: 'mentoring-young-professionals',
      kind: 'Webinar',
      title: 'Mentoring young professionals: a diaspora roundtable',
      author: 'Bibi Oruwari',
      authorRole: 'Diaspora member, nurse practitioner',
      date: '2026-03-04',
      topics: ['Mentorship', 'Youth', 'Diaspora'],
      summary:
        'A roundtable on matching diaspora professionals with young people starting out.',
      body: [
        'Four diaspora professionals discussed how to run mentoring that is useful rather than decorative: clear expectations, a fixed term, and a way to end well.',
        'The session proposed a light matching process through the volunteer skills database, with private contact details shared only with the consent of both sides.',
      ],
      status: 'Submitted',
    },
  ],

  opportunities: [
    {
      id: 'opp-001',
      slug: 'bta-secondary-scholarship-2026',
      kind: 'Scholarship',
      title: 'BTA Secondary School Scholarship 2026',
      provider: 'BTA education and scholarships panel',
      location: 'Buguma and surrounding communities',
      studyLevel: 'Secondary school (JSS1–SS3)',
      award: 'Fees, books and transport for one academic year',
      eligibility: [
        'Attending or admitted to a secondary school in the home communities',
        'Household income below the panel’s means-tested threshold',
        'A short statement from the student and a reference from a teacher',
      ],
      summary:
        'Twelve means-tested scholarships for secondary school students, renewable each year subject to progress.',
      deadline: '2026-05-30',
      status: 'Open',
    },
    {
      id: 'opp-002',
      slug: 'university-support-grant-2026',
      kind: 'Scholarship',
      title: 'University Support Grant 2026',
      provider: 'BTA education and scholarships panel',
      location: 'Any Nigerian university',
      studyLevel: 'Undergraduate',
      award: 'A one-off grant towards tuition and materials',
      eligibility: [
        'Members or children of members in good standing',
        'In the second year of study or above',
        'Evidence of academic progress',
      ],
      summary: 'A small number of one-off grants to help undergraduates stay in university.',
      deadline: '2026-04-15',
      status: 'Closing soon',
    },
    {
      id: 'opp-003',
      slug: 'engineering-internship-placement',
      kind: 'Internship',
      title: 'Engineering internship placement',
      provider: 'Pledging member firms (illustrative)',
      location: 'Port Harcourt and remote',
      studyLevel: 'HND or degree, penultimate year',
      award: 'Six-month structured placement',
      eligibility: [
        'Studying engineering or a related technical discipline',
        'Available for a six-month placement',
        'Willing to submit a short reflection at the end',
      ],
      summary:
        'Illustrative placements with member firms for students who want practical engineering experience.',
      deadline: '2026-06-30',
      status: 'Open',
    },
    {
      id: 'opp-004',
      slug: 'diaspora-mentorship-programme',
      kind: 'Mentorship',
      title: 'Diaspora mentorship programme',
      provider: 'BTA diaspora hub',
      location: 'Remote',
      studyLevel: 'Students and early-career professionals',
      award: 'A six-month mentoring relationship',
      eligibility: [
        'Committed to at least one call a month',
        'Able to set two personal goals for the programme',
      ],
      summary:
        'Pairing young members with diaspora professionals in medicine, law, technology, finance and engineering.',
      deadline: '2026-07-31',
      status: 'Open',
    },
    {
      id: 'opp-005',
      slug: 'tailoring-and-carpentry-training',
      kind: 'Vocational training',
      title: 'Tailoring and carpentry training',
      provider: 'Youth vocational workshop (proposed)',
      location: 'Buguma',
      studyLevel: 'School leavers and young adults',
      award: 'Free training and a starter toolkit on completion',
      eligibility: [
        'Aged 16 to 30',
        'Available for the full training cycle',
      ],
      summary:
        'Practical training with local artisans, tied to the proposed youth vocational workshop.',
      deadline: '2026-08-15',
      status: 'Open',
    },
    {
      id: 'opp-006',
      slug: 'cv-and-interview-clinic',
      kind: 'Career resource',
      title: 'CV and interview clinic',
      provider: 'BTA knowledge-sharing hub',
      location: 'Remote and Buguma',
      studyLevel: 'All levels',
      award: 'A one-hour review session',
      eligibility: ['A current CV to review', 'A willingness to act on feedback'],
      summary:
        'Volunteer professionals review CVs and run practice interviews ahead of application season.',
      deadline: '2026-04-30',
      status: 'Open',
    },
  ],

  applications: [
    { id: 'app-001', opportunityId: 'opp-001', applicantName: 'Ebiere Dagogo', email: 'ebiere.dagogo@example.org', motivation: 'I am in SS2 and would like help with fees and books so I can finish school.', date: '2026-02-12', status: 'Under review' },
    { id: 'app-002', opportunityId: 'opp-001', applicantName: 'Tari Erekosima', email: 'tari.erekosima@example.org', motivation: 'My parents are petty traders and the transport to school is expensive.', date: '2026-02-18', status: 'Shortlisted' },
    { id: 'app-003', opportunityId: 'opp-002', applicantName: 'Atei Bobmanuel', email: 'atei.bobmanuel@example.org', motivation: 'I am in my third year of engineering and need help with materials.', date: '2026-02-21', status: 'Submitted' },
    { id: 'app-004', opportunityId: 'opp-004', applicantName: 'Sotonye Green', email: 'sotonye.green@example.org', motivation: 'I would like a mentor in data science to help me plan my first role.', date: '2026-02-25', status: 'Submitted' },
  ],

  businesses: [
    { id: 'biz-001', slug: 'kalabari-blue-consulting', name: 'Kalabari Blue Consulting', category: 'Professional services', owner: 'Igo West', location: 'Bonny', description: 'Marine surveying and environmental compliance support for small operators.', services: ['Marine survey', 'Environmental compliance'], contactEmail: 'hello@kalabariblue.example.org', website: 'https://kalabariblue.example.org', diasporaOwned: false, status: 'Published' },
    { id: 'biz-002', slug: 'briggs-family-clinic', name: 'Briggs Family Clinic', category: 'Healthcare', owner: 'Tamunotonye Briggs', location: 'Port Harcourt', description: 'A small family practice offering general consultations and preventive care.', services: ['General practice', 'Immunisation'], contactEmail: 'reception@briggsclinic.example.org', website: 'https://briggsclinic.example.org', diasporaOwned: false, status: 'Published' },
    { id: 'biz-003', slug: 'tariah-tailoring', name: 'Tariah Tailoring', category: 'Trades and crafts', owner: 'Boma Tariah', location: 'Buguma', description: 'Traditional and tailored clothing, with a small apprenticeship programme.', services: ['Tailoring', 'Apprenticeship'], contactEmail: 'tariah.tailoring@example.org', website: '', diasporaOwned: false, status: 'Published' },
    { id: 'biz-004', slug: 'overseas-data-works', name: 'Overseas Data Works', category: 'Technology', owner: 'Ibifuro Amachree', location: 'London, United Kingdom', description: 'Data analytics and reporting for small charities and cooperatives.', services: ['Data analysis', 'Dashboarding', 'Training'], contactEmail: 'contact@overseasdata.example.org', website: 'https://overseasdata.example.org', diasporaOwned: true, status: 'Published' },
    { id: 'biz-005', slug: 'abbey-fisheries-cooperative', name: 'Abbey Fisheries Cooperative', category: 'Agriculture and fisheries', owner: 'Precious Abbey', location: 'Buguma', description: 'A cooperative of fishing households selling fresh and smoked fish.', services: ['Fresh fish', 'Smoked fish', 'Cold storage'], contactEmail: 'abbey.fisheries@example.org', website: '', diasporaOwned: false, status: 'Published' },
    { id: 'biz-006', slug: 'amachree-solar-services', name: 'Amachree Solar Services', category: 'Engineering', owner: 'Amachree family', location: 'Buguma', description: 'Solar installation, maintenance and small electrical works.', services: ['Solar installation', 'Maintenance'], contactEmail: 'info@amachresolar.example.org', website: '', diasporaOwned: false, status: 'Published' },
    { id: 'biz-007', slug: 'houston-legal-associates', name: 'Houston Legal Associates', category: 'Professional services', owner: 'Ngozi Kalabari-Obi', location: 'Houston, United States', description: 'Immigration and family law consultancy for the diaspora community.', services: ['Immigration advice', 'Family law'], contactEmail: 'office@houstonlegal.example.org', website: 'https://houstonlegal.example.org', diasporaOwned: true, status: 'Published' },
    { id: 'biz-008', slug: 'greenfield-marine-logistics', name: 'Greenfield Marine Logistics', category: 'Transport', owner: 'Atei Greenfield', location: 'Buguma', description: 'Passenger boats and small freight across the creeks.', services: ['Passenger transport', 'Freight'], contactEmail: 'greenfield.logistics@example.org', website: '', diasporaOwned: false, status: 'Published' },
    { id: 'biz-009', slug: 'tariah-culinary-catering', name: 'Tariah Culinary Catering', category: 'Hospitality', owner: 'Boma Tariah', location: 'Buguma', description: 'Event catering for community celebrations and meetings.', services: ['Catering', 'Event support'], contactEmail: 'catering@tariahculinary.example.org', website: '', diasporaOwned: false, status: 'Published' },
    { id: 'biz-010', slug: 'sankara-learning-centre', name: 'Sankara Learning Centre', category: 'Education', owner: 'Ebiere Dagogo', location: 'Buguma', description: 'After-school lessons and computer literacy classes.', services: ['Lessons', 'Computer literacy'], contactEmail: 'sankara.learning@example.org', website: '', diasporaOwned: false, status: 'Pending review' },
  ],

  volunteers: [
    { id: 'vol-001', name: 'Ada Nwosu', profession: 'Civil engineer', category: 'Engineering', skills: ['Structural design', 'Project management', 'Cost estimation'], availability: 'Two days a month', mode: 'Local', location: 'Buguma', status: 'Matched' },
    { id: 'vol-002', name: 'Tamunotonye Briggs', profession: 'Medical doctor', category: 'Healthcare', skills: ['Public health', 'Clinical training'], availability: 'Monthly', mode: 'Either', location: 'Port Harcourt', status: 'Registered' },
    { id: 'vol-003', name: 'Ibifuro Amachree', profession: 'Data scientist', category: 'Technology', skills: ['Data analysis', 'Teaching', 'Mentoring'], availability: 'Evenings and weekends', mode: 'Remote', location: 'London, United Kingdom', status: 'Matched' },
    { id: 'vol-004', name: 'Soala Ogan', profession: 'Barrister', category: 'Law', skills: ['Governance', 'Contracts', 'Policy'], availability: 'Monthly', mode: 'Remote', location: 'Abuja', status: 'Registered' },
    { id: 'vol-005', name: 'Tamuno Georgewill', profession: 'Banker', category: 'Finance', skills: ['Financial literacy', 'Fundraising', 'Audit'], availability: 'Quarterly', mode: 'Either', location: 'Lagos', status: 'Pending' },
    { id: 'vol-006', name: 'Bibi Oruwari', profession: 'Nurse practitioner', category: 'Healthcare', skills: ['Mentoring', 'Health education'], availability: 'Monthly', mode: 'Remote', location: 'Toronto, Canada', status: 'Registered' },
    { id: 'vol-007', name: 'Precious Abbey', profession: 'Cooperative manager', category: 'Entrepreneurship', skills: ['Cooperatives', 'Fisheries', 'Group training'], availability: 'Weekly', mode: 'Local', location: 'Buguma', status: 'Matched' },
    { id: 'vol-008', name: 'Ebiere Dagogo', profession: 'Law student', category: 'Education', skills: ['Tutoring', 'Reading support'], availability: 'Weekends', mode: 'Local', location: 'Rivers State', status: 'Registered' },
  ],

  feedback: [
    { id: 'fbk-001', kind: 'Suggestion', subject: 'Publish the project tracker on the website', message: 'It would help members see how money is being spent if the tracker were public.', submittedBy: 'T. Briggs', date: '2026-02-01', status: 'Published', response: 'Agreed — the project bank now includes a public tracker.' },
    { id: 'fbk-002', kind: 'Project proposal', subject: 'Repair the jetty road lighting', message: 'The jetty road is dark at night. Could we look at solar lighting?', submittedBy: 'I. West', date: '2026-02-05', status: 'Under review', response: null },
    { id: 'fbk-003', kind: 'Survey response', subject: 'Membership survey 2026', message: 'Prefer meetings on Saturdays and shorter agendas with more time for discussion.', submittedBy: 'Anonymous', date: '2026-02-09', status: 'Published', response: null },
    { id: 'fbk-004', kind: 'General feedback', subject: 'Thank you for the scholarship', message: 'The scholarship has made a real difference to our family this term.', submittedBy: 'A parent', date: '2026-02-14', status: 'Published', response: 'Thank you for writing in.' },
    { id: 'fbk-005', kind: 'Suggestion', subject: 'Start a language class', message: 'Could we run beginner classes in the local language for young people?', submittedBy: 'B. Oruwari', date: '2026-02-17', status: 'Submitted', response: null },
    { id: 'fbk-006', kind: 'Project proposal', subject: 'Community library', message: 'A small lending library beside the hall would help students.', submittedBy: 'E. Dagogo', date: '2026-02-23', status: 'Submitted', response: null },
  ],

  partnerships: [
    { id: 'ptn-001', organisation: 'Delta Coastal Foundation (illustrative)', contactName: 'Programme Lead', email: 'programmes@deltacoastal.example.org', type: 'Foundation', priority: 'Water and sanitation', message: 'Interested in co-funding the water and sanitation upgrade.', date: '2026-01-29', status: 'Under review' },
    { id: 'ptn-002', organisation: 'Rivers Enterprise Group (illustrative)', contactName: 'CSR Manager', email: 'csr@riversenterprise.example.org', type: 'Corporate sponsor', priority: 'Youth empowerment', message: 'Would like to sponsor the vocational workshop and offer placements.', date: '2026-02-06', status: 'Published' },
    { id: 'ptn-003', organisation: 'Diaspora Friends of Buguma (illustrative)', contactName: 'Chair', email: 'chair@diasporafriends.example.org', type: 'Diaspora contributor', priority: 'Cultural preservation', message: 'A group of members abroad would like to support the oral history archive.', date: '2026-02-15', status: 'Submitted' },
  ],

  statements: [
    {
      id: 'stm-001',
      title: 'Income and expenditure summary',
      period: 'January – December 2025',
      scope: 'Association-wide',
      label: 'Illustrative sample',
      lines: [
        { label: 'Member subscriptions', amountNgn: 4200000 },
        { label: 'Contributions and donations', amountNgn: 6850000 },
        { label: 'Events income', amountNgn: 750000 },
        { label: 'Programme expenditure', amountNgn: 7300000 },
        { label: 'Administration', amountNgn: 1100000 },
        { label: 'Closing balance', amountNgn: 3400000 },
      ],
    },
    {
      id: 'stm-002',
      title: 'Project fund summary',
      period: 'January – December 2025',
      scope: 'Restricted project funds',
      label: 'Illustrative sample',
      lines: [
        { label: 'Community hall rehabilitation', amountNgn: 5400000 },
        { label: 'Water and sanitation upgrade', amountNgn: 1800000 },
        { label: 'Scholarships', amountNgn: 2100000 },
        { label: 'Oral history archive', amountNgn: 900000 },
      ],
    },
    {
      id: 'stm-003',
      title: 'Dues reconciliation',
      period: 'As at 28 February 2026',
      scope: 'Member subscriptions',
      label: 'Illustrative sample',
      lines: [
        { label: 'Expected for 2026', amountNgn: 3000000 },
        { label: 'Received to date', amountNgn: 1750000 },
        { label: 'Outstanding', amountNgn: 1250000 },
      ],
    },
  ],

  budgetLines: [
    { id: 'bgt-001', projectId: 'prj-001', item: 'Roof and trusses', budgetNgn: 7200000, spentNgn: 7050000 },
    { id: 'bgt-002', projectId: 'prj-001', item: 'Electrical installation', budgetNgn: 6300000, spentNgn: 0 },
    { id: 'bgt-003', projectId: 'prj-001', item: 'Accessibility works', budgetNgn: 5000000, spentNgn: 0 },
    { id: 'bgt-004', projectId: 'prj-002', item: 'Survey and drilling', budgetNgn: 9000000, spentNgn: 2400000 },
    { id: 'bgt-005', projectId: 'prj-002', item: 'Solar array and tank', budgetNgn: 11000000, spentNgn: 0 },
    { id: 'bgt-006', projectId: 'prj-002', item: 'Sanitation block', budgetNgn: 4000000, spentNgn: 0 },
    { id: 'bgt-007', projectId: 'prj-003', item: 'Scholarship awards', budgetNgn: 4800000, spentNgn: 3600000 },
    { id: 'bgt-008', projectId: 'prj-003', item: 'Books and materials', budgetNgn: 1200000, spentNgn: 600000 },
  ],

  adminRoles: [
    { id: 'rol-001', name: 'President', description: 'Chairs meetings and represents the association.', holders: 1, permissions: ['All sections', 'Approve projects', 'Publish announcements'] },
    { id: 'rol-002', name: 'Secretary', description: 'Maintains records, notices and minutes.', holders: 1, permissions: ['Membership', 'Content', 'Meetings'] },
    { id: 'rol-003', name: 'Treasurer', description: 'Manages dues, the project funds and reporting.', holders: 1, permissions: ['Dues', 'Transactions', 'Transparency'] },
    { id: 'rol-004', name: 'Projects coordinator', description: 'Runs the project bank and progress reporting.', holders: 1, permissions: ['Projects', 'Progress reports'] },
    { id: 'rol-005', name: 'Youth and education lead', description: 'Runs scholarships, mentoring and youth programmes.', holders: 1, permissions: ['Scholarships', 'Volunteers', 'Feedback'] },
  ],

  activity: [
    { id: 'act-001', date: '2026-02-27', actor: 'Treasurer', action: 'Recorded a simulated dues payment', target: 'Boma Tariah' },
    { id: 'act-002', date: '2026-02-25', actor: 'Youth and education lead', action: 'Moved an application to Under review', target: 'Sotonye Green' },
    { id: 'act-003', date: '2026-02-23', actor: 'Secretary', action: 'Received a new project proposal', target: 'Community library' },
    { id: 'act-004', date: '2026-02-20', actor: 'Projects coordinator', action: 'Published a progress update', target: 'Community hall rehabilitation' },
    { id: 'act-005', date: '2026-02-18', actor: 'Secretary', action: 'Published a circular', target: 'Scholarship panel call for nominations' },
    { id: 'act-006', date: '2026-02-16', actor: 'President', action: 'Approved a partnership enquiry', target: 'Rivers Enterprise Group (illustrative)' },
  ],

  diasporaRegistrations: [
    { id: 'dia-001', name: 'Ibifuro Amachree', email: 'ibifuro.amachree@example.org', country: 'United Kingdom', interests: ['Mentorship', 'Technology', 'Funding'], willingToVolunteer: true, date: '2026-01-12', status: 'Registered' },
    { id: 'dia-002', name: 'Ngozi Kalabari-Obi', email: 'ngozi.obi@example.org', country: 'United States', interests: ['Law', 'Funding'], willingToVolunteer: true, date: '2026-01-27', status: 'Contacted' },
    { id: 'dia-003', name: 'Bibi Oruwari', email: 'bibi.oruwari@example.org', country: 'Canada', interests: ['Mentorship', 'Healthcare'], willingToVolunteer: true, date: '2026-02-08', status: 'Contacted' },
  ],

  // The committee behind the work. Each entry points at a member record, so the
  // leadership page and the members' directory always show the same people.
  leaders: [
    {
      id: 'lead-001',
      memberId: 'mem-009',
      role: 'President',
      remit: 'Leads the club, chairs the annual general meeting and represents BTA to partners.',
      since: '2024',
      portrait: 'georgewill',
    },
    {
      id: 'lead-002',
      memberId: 'mem-001',
      role: 'Vice President',
      remit: 'Deputises for the president and coordinates the committee work plan.',
      since: '2024',
      portrait: 'nwosu',
    },
    {
      id: 'lead-003',
      memberId: 'mem-004',
      role: 'Secretary',
      remit: 'Keeps the institutional record: minutes, notices, circulars and the annual report.',
      since: '2025',
      portrait: 'ogan',
    },
    {
      id: 'lead-004',
      memberId: 'mem-002',
      role: 'Treasurer',
      remit: 'Oversees subscriptions, contributions and the published financial statements.',
      since: '2025',
      portrait: 'briggs',
    },
    {
      id: 'lead-005',
      memberId: 'mem-005',
      role: 'Education & Youth Lead',
      remit: 'Runs the scholarship, mentoring and school support programmes.',
      since: '2025',
      portrait: 'tariah',
    },
    {
      id: 'lead-006',
      memberId: 'mem-007',
      role: 'Diaspora & Partnerships Lead',
      remit: 'Connects the diaspora network and builds partnerships that fund community work.',
      since: '2026',
      portrait: 'kalabari-obi',
    },
  ],

  // Forum articles. These mirror the threads published in the CMS, so the forum
  // still reads as a forum when the Content Lake cannot be reached.
  forumThreads: [
    {
      id: 'fth-001',
      slug: 'understanding-personal-investment-in-nigeria',
      title: 'Understanding Personal Investment in Nigeria',
      excerpt:
        'What personal investment actually means in the Nigerian context: where to start, what to avoid, and how much of your income should be committed.',
      body: [
        {
          kind: 'paragraph',
          text: 'Every month someone in the club asks where to start with money they do not have much of. This article is the answer we agreed to write down properly: what personal investment means here, the three rules we follow, and the mistakes we have seen other people make.',
        },
        {
          kind: 'paragraph',
          text: 'Nothing here is financial advice, and no member of the club is a licensed adviser. It is what has worked for people in this club, written down so that the next person can start from a clearer place than we did.',
        },
        { kind: 'heading', text: 'Start with the boring part' },
        {
          kind: 'paragraph',
          text: 'Before any investment, the money that comes in has to be divided: the part that pays for the month, the part that covers the surprises, and only then the part that can be committed for years. Members who skip this step tend to start again from zero, usually at a worse moment than the first one.',
        },
        {
          kind: 'list',
          items: [
            'The month: rent, food, transport, school fees and the household share of everything else.',
            'The surprise: three to six months of the month money, held somewhere you can reach it the same day.',
            'The commitment: what is genuinely spare once the first two are covered, and can stay put for years.',
          ],
        },
        {
          kind: 'paragraph',
          text: 'The order matters more than the percentages. Most arguments we have had about investing were really arguments about which of these three boxes had not been filled yet.',
        },
        { kind: 'heading', text: 'Three questions before you buy anything' },
        {
          kind: 'list',
          items: [
            'Do I understand exactly what I am buying? If you cannot explain it to somebody else in two sentences, you do not understand it yet.',
            'What happens to it if I need the money next year? A commitment you might have to break is a hope, not a plan.',
            'Who is taking a fee from me, and how much? The fee is the one number that is always certain.',
          ],
        },
        {
          kind: 'paragraph',
          text: 'Those three questions have removed more bad decisions in this club than any product recommendation ever has. They are deliberately dull. That is the point.',
        },
        {
          kind: 'quote',
          text: 'The best time to start was ten years ago. The second best time is after the month is already under control.',
        },
        { kind: 'heading', text: 'What the club does with it' },
        {
          kind: 'paragraph',
          text: 'Once the month and the surprise are covered, several members in the club set aside a small monthly amount for the projects we run together: the school hall, the water work, the scholarships. It is the same discipline as above, pointed at something the whole club can see.',
        },
        {
          kind: 'paragraph',
          text: 'If you would like to talk this through with somebody before you commit to anything, that is what the monthly session is for. Bring your questions, not your answers.',
        },
      ],
      author: 'Tamuno Georgewill',
      authorRole: 'Treasurer',
      category: 'Knowledge & Ideas',
      date: '2026-10-18',
      image: 'community',
    },
    {
      id: 'fth-002',
      slug: 'running-a-fisheries-cooperative',
      title: 'Running a fisheries cooperative: what worked and what did not',
      excerpt:
        'Three years of running a cooperative on the river, written honestly: the decisions that paid off, the ones that did not, and the bookkeeping we should have kept from day one.',
      body: [
        {
          kind: 'paragraph',
          text: 'Our cooperative now supplies four neighbouring communities, and it nearly did not survive its second year. This is the version of the story I would have wanted before we started, written while the details are still honest and nobody has yet had time to make them sound better.',
        },
        {
          kind: 'paragraph',
          text: 'We were six members with two boats and a shared freezer that did not work. Everything below is what three years of that produced.',
        },
        { kind: 'heading', text: 'What worked' },
        {
          kind: 'list',
          items: [
            'Writing the rules down before we needed them. Membership, prices, dividends and the order of decisions were all on one page, signed by everyone.',
            'Buying cold storage together rather than individually. The saving paid for the first year of the record keeping we had not budgeted for.',
            'Meeting on the same day every month, whatever the weather. A fixed date is the cheapest governance there is.',
            'Paying the same day we sold. Delayed payment is where small cooperatives quietly lose their working capital.',
          ],
        },
        { kind: 'heading', text: 'What did not' },
        {
          kind: 'paragraph',
          text: 'We started without a bookkeeper. For eleven months the money was tracked in a notebook, and reconciling it at the end of the year took a fortnight and two arguments. We also took on a member who wanted to sell to us below the market price, and the disagreement nearly ended the cooperative.',
        },
        {
          kind: 'quote',
          text: 'The record of a decision is worth more than the decision itself.',
        },
        { kind: 'heading', text: 'What we would do differently' },
        {
          kind: 'list',
          items: [
            'Appoint a treasurer in the first meeting, and make the role a two-year commitment rather than a favour.',
            'Buy the cold storage before the second boat, not after.',
            'Write the buying rule down before the first difficult supplier conversation, not during it.',
          ],
        },
        {
          kind: 'paragraph',
          text: 'We are not an example to copy. We are an example of what happens when a group of people with no experience decide to do something anyway, and write down what they learn so that the next group starts further along.',
        },
      ],
      author: 'Precious Abbey',
      authorRole: 'Committee member',
      category: 'Aquaculture & Blue Economy',
      date: '2026-09-29',
      image: 'boats',
    },
    {
      id: 'fth-003',
      slug: 'getting-a-first-role-in-technology',
      title: 'Getting a first role in technology without a computer science degree',
      excerpt:
        'A practical path into the technology industry for people who studied something else: what to learn, what to build, and how to answer the interview question nobody prepares for.',
      body: [
        {
          kind: 'paragraph',
          text: 'Several members came into technology from law, education and engineering management. Here is the route that worked for them, in the order it actually happened rather than the order it is usually described.',
        },
        {
          kind: 'paragraph',
          text: 'The first thing to accept is that the industry hires for judgement, not for the certificate. What is missing is evidence that you have judgement, and that evidence is a project.',
        },
        { kind: 'heading', text: 'Pick one thing and build it for someone real' },
        {
          kind: 'paragraph',
          text: 'A portfolio of five small, finished projects beats a certificate every time. The projects do not need to be impressive; they need to be real, used by someone, and explainable in three minutes.',
        },
        {
          kind: 'list',
          items: [
            'The club membership list, searchable and mobile friendly. A real problem, a real user, a real deadline.',
            'A tool that turns a printed record into a searchable one for a small organisation.',
            'A page that loads on a slow connection. Unglamorous, and rarer than it should be.',
          ],
        },
        { kind: 'heading', text: 'The question nobody prepares for' },
        {
          kind: 'paragraph',
          text: 'Expect to be asked what you have changed in the work of other people. Answer with a specific example: a process you shortened, a report you automated, a colleague you handed something to that used to be lost.',
        },
        {
          kind: 'quote',
          text: 'It does not have to be technical. Reporting, filing, scheduling, teaching. It has to be real and yours.',
        },
        { kind: 'heading', text: 'What to do in the meantime' },
        {
          kind: 'paragraph',
          text: 'Take the work you have and make one part of it measurably better. Write down what you did, who it helped and what you would do differently. That paragraph is the beginning of every interview you will ever give.',
        },
      ],
      author: 'Ibifuro Amachree',
      authorRole: 'Diaspora member',
      category: 'Technology',
      date: '2026-09-12',
      image: 'river',
    },
    {
      id: 'fth-004',
      slug: 'oral-history-project-notes',
      title: 'Notes from the Oral History Project: recording an elder’s story',
      excerpt:
        'What we have learned after twelve recorded conversations: how to prepare, how to listen, and why the pauses matter more than the answers.',
      body: [
        {
          kind: 'paragraph',
          text: 'Twelve conversations in, the project has taught us more about listening than about recording. These are the working notes we share before the recordings are archived, so that any member who is asked to take part knows what they are agreeing to.',
        },
        { kind: 'heading', text: 'Before the visit' },
        {
          kind: 'list',
          items: [
            'Ask what the elder wants remembered, and write it down before you press record.',
            'Agree with the family who may hear it, and be specific about who will hear it.',
            'Test the equipment in the room, not in the car. A generator hum and a high ceiling will ruin the recording.',
            'Bring water, and a second person who is there to take notes rather than to talk.',
          ],
        },
        { kind: 'heading', text: 'During' },
        {
          kind: 'paragraph',
          text: 'Leave the silence alone. The pause before an answer is usually where the memory is being located, and filling it takes the memory with it. Two people, one recorder, and no hurry.',
        },
        {
          kind: 'quote',
          text: 'Every generation holds a part of the story. Our responsibility is to carry it forward.',
        },
        { kind: 'heading', text: 'After' },
        {
          kind: 'paragraph',
          text: 'The same day, we write three lines: what was said, what was asked to stay private, and who we should thank. Six weeks later, the recording is much harder to remember accurately, and six months later it is a summary.',
        },
        {
          kind: 'paragraph',
          text: 'Twelve conversations is not a history. It is a beginning, and it is a way of remembering that the elders in this district are still here, and still willing to be asked.',
        },
      ],
      author: 'Ada Nwosu',
      authorRole: 'Vice President',
      category: 'Heritage',
      date: '2026-08-20',
      image: 'elder',
    },
    {
      id: 'fth-005',
      slug: 'building-in-public-project-numbers',
      title: 'Building in public: why we publish our project numbers',
      excerpt:
        'Somebody asked why we publish costs and shortfalls alongside our successes. The short answer is trust; the long answer is in how decisions get made.',
      body: [
        {
          kind: 'paragraph',
          text: 'Publishing the numbers is not a favour we do to supporters. It is how the committee makes decisions, because a number that everybody can see is a number that has to be explained.',
        },
        { kind: 'heading', text: 'What we publish' },
        {
          kind: 'list',
          items: [
            'The cost of each project, and what it was estimated at when the project was approved.',
            'How much has been raised, and from where, so that a single large gift does not look like broad support.',
            'Where the money went, including the parts that did not work.',
            'The decisions the committee took afterwards, and why.',
          ],
        },
        { kind: 'heading', text: 'Why it is uncomfortable' },
        {
          kind: 'paragraph',
          text: 'Publishing a project that fell short feels like an attack on the people who ran it. We have learned that the opposite is true: a shortfall that is published is the cheapest lesson the club will ever buy, and the one that protects the members who fund it.',
        },
        {
          kind: 'quote',
          text: 'A project that fell short and was published is worth more to the club than a project that succeeded quietly and taught us nothing.',
        },
        { kind: 'heading', text: 'How to read a statement' },
        {
          kind: 'paragraph',
          text: 'Each statement lists the income, the expenditure, the closing balance and a short note explaining anything unusual. Where a figure is an estimate rather than a final amount, it says so. Where a project is still running, the statement shows the money committed so far, not the whole budget.',
        },
        {
          kind: 'paragraph',
          text: 'If a number looks wrong to you, that is the point of publishing it. Write to the committee and ask.',
        },
      ],
      author: 'Soala Ogan',
      authorRole: 'Secretary',
      category: 'Leadership & Governance',
      date: '2026-08-04',
      image: 'people',
    },
  ],

  // Forum discussions. The articles themselves are editorial content in the
  // CMS; these are the member comments and replies held in the demonstration
  // layer so a thread can be discussed before it is read.
  forumComments: [
    {
      id: 'cmt-001',
      threadSlug: 'understanding-personal-investment-in-nigeria',
      authorId: 'mem-004',
      body: 'The order of the three steps is the part I had to learn the hard way. I spent a year investing before I had a buffer, and the first emergency took everything.',
      date: '2026-10-19',
      replies: [
        {
          id: 'rep-001',
          authorId: 'mem-009',
          body: 'That matches what we see in the club. The buffer is the part nobody writes about, and it is the part that decides whether the rest works.',
          date: '2026-10-19',
        },
        {
          id: 'rep-002',
          authorId: 'mem-001',
          body: 'Could you write a follow-up on how much of the monthly income you would treat as the committed part? That is the number people ask me for most.',
          date: '2026-10-20',
        },
      ],
    },
    {
      id: 'cmt-002',
      threadSlug: 'understanding-personal-investment-in-nigeria',
      authorId: 'mem-003',
      body: 'Worth adding that the fees question in point three catches people who assume a product is free because no one mentions a charge at the counter.',
      date: '2026-10-20',
      replies: [],
    },
    {
      id: 'cmt-003',
      threadSlug: 'running-a-fisheries-cooperative',
      authorId: 'mem-008',
      body: 'The bookkeeping point is the one our cooperative is still paying for. We started with a spreadsheet and a WhatsApp group, and it is not enough once money is moving between members.',
      date: '2026-10-02',
      replies: [
        {
          id: 'rep-003',
          authorId: 'mem-008',
          body: 'Adding what helped us: a fixed monthly meeting date, and a second person who reads the books before the meeting rather than during it.',
          date: '2026-10-03',
        },
      ],
    },
    {
      id: 'cmt-004',
      threadSlug: 'running-a-fisheries-cooperative',
      authorId: 'mem-005',
      body: 'We had a similar disagreement about a supplier, and it was only solved by writing down the buying rule before the next season rather than arguing about the past one.',
      date: '2026-10-05',
      replies: [],
    },
    {
      id: 'cmt-005',
      threadSlug: 'getting-a-first-role-in-technology',
      authorId: 'mem-006',
      body: 'As someone who came from a law background, the advice about answering with a specific example is the most useful thing in this article. My first interview went badly because I only described what I had studied.',
      date: '2026-09-15',
      replies: [
        {
          id: 'rep-004',
          authorId: 'mem-003',
          body: 'Glad it helped. The example does not have to be technical: reporting, filing, scheduling, teaching. It has to be real and yours.',
          date: '2026-09-16',
        },
      ],
    },
    {
      id: 'cmt-006',
      threadSlug: 'oral-history-project-notes',
      authorId: 'mem-002',
      body: 'The pause point cannot be overstated. Our first recording was unusable because we filled every silence. We now count to five in our heads before speaking.',
      date: '2026-08-24',
      replies: [],
    },
    {
      id: 'cmt-007',
      threadSlug: 'building-in-public-project-numbers',
      authorId: 'mem-007',
      body: 'Publishing the shortfalls is the part that will test whether we mean it. If the numbers only appear when they are good, nobody will believe the ones that are not.',
      date: '2026-08-08',
      replies: [
        {
          id: 'rep-005',
          authorId: 'mem-004',
          body: 'Agreed, and that is why the statements page is written before the year starts rather than at the end of it.',
          date: '2026-08-09',
        },
      ],
    },
  ],
}

/* ---------------------------------------------------------------------------
 * Derived selectors and aggregate figures.
 *
 * These are pure functions over the baseline dataset, so the numbers shown on
 * the public site, in the portal and in the admin area are always consistent.
 * ------------------------------------------------------------------------- */

export interface DemoStats {
  members: number
  activeMembers: number
  diasporaMembers: number
  projects: number
  ongoingProjects: number
  projectsCompleted: number
  fundingTargetNgn: number
  fundedNgn: number
  opportunities: number
  businesses: number
  volunteers: number
  knowledgeResources: number
}

export function computeDemoStats(data: DemoDataset = DEMO_DATA): DemoStats {
  const fundingTargetNgn = data.projects.reduce((sum, project) => sum + project.fundingTargetNgn, 0)
  const fundedNgn = data.projects.reduce((sum, project) => sum + project.raisedNgn, 0)

  return {
    members: data.members.length,
    activeMembers: data.members.filter((member) => member.status === 'Active').length,
    diasporaMembers: data.members.filter((member) => member.category === 'Diaspora member').length,
    projects: data.projects.length,
    ongoingProjects: data.projects.filter((project) => project.stage === 'Ongoing').length,
    projectsCompleted: data.projects.filter((project) => project.stage === 'Completed').length,
    fundingTargetNgn,
    fundedNgn,
    opportunities: data.opportunities.length,
    businesses: data.businesses.filter((business) => business.status === 'Published').length,
    volunteers: data.volunteers.length,
    knowledgeResources: data.knowledge.filter((item) => item.status === 'Published').length,
  }
}

/** The single member the demonstration signs in as. */
export const DEMO_MEMBER_ID = 'mem-001'

export function findProject(slug: string, data: DemoDataset = DEMO_DATA) {
  return data.projects.find((project) => project.slug === slug) ?? null
}

export function findKnowledgeResource(slug: string, data: DemoDataset = DEMO_DATA) {
  return data.knowledge.find((item) => item.slug === slug) ?? null
}

export function findOpportunity(slug: string, data: DemoDataset = DEMO_DATA) {
  return data.opportunities.find((item) => item.slug === slug) ?? null
}

export function findBusiness(slug: string, data: DemoDataset = DEMO_DATA) {
  return data.businesses.find((item) => item.slug === slug) ?? null
}
