/**
 * Domain types for the Prototype 3 demonstration data.
 *
 * Everything in this module describes *illustrative* records: fictional members,
 * projects, contributions, scholarships, businesses, volunteers and admin
 * activity. None of it comes from a real backend, and nothing here should be
 * presented to a user as a verified fact. See `src/lib/demo/data.ts` for the
 * dataset and `src/lib/demo/store.tsx` for the client-side mutations that let the
 * public forms, the members' portal and the admin area share one dataset.
 *
 * These types are intentionally separate from `src/types/content.ts`: that
 * module describes CMS query results, this one describes the demonstration
 * platform the committee asked for in Prototype 3.
 */

export type MembershipCategory =
  | 'Full member'
  | 'Associate member'
  | 'Diaspora member'
  | 'Student member'
  | 'Patron'

export type MembershipStatus = 'Active' | 'Pending' | 'Lapsed'

export type DuesStatus = 'Paid' | 'Due' | 'Overdue'

export interface Member {
  id: string
  name: string
  category: MembershipCategory
  status: MembershipStatus
  /** Town or country the member is based in. */
  location: string
  profession: string
  /** ISO date (YYYY-MM-DD) the member joined. */
  joinedOn: string
  duesStatus: DuesStatus
  /** Private fields: only ever shown to the member themselves and to admins. */
  email: string
  phone: string
  /** Whether the member agreed to appear in the opt-in directory. */
  directoryVisible: boolean
}

export type TransactionKind = 'Dues' | 'Contribution'

export interface Transaction {
  id: string
  memberId: string | null
  kind: TransactionKind
  /** Human label, for example "2026 annual dues" or "Infrastructure fund". */
  description: string
  amountNgn: number
  /** ISO date (YYYY-MM-DD). */
  date: string
  method: string
  reference: string
  receiptNo: string
}

export interface DuesInvoice {
  id: string
  memberId: string
  period: string
  amountNgn: number
  /** ISO date the payment is due. */
  dueDate: string
  status: DuesStatus
  invoiceNo: string
}

export type DocumentKind = 'Notice' | 'Agenda' | 'Minutes' | 'Circular'

export interface MeetingRecord {
  id: string
  kind: DocumentKind
  title: string
  /** ISO date. */
  date: string
  summary: string
  /** Reference for the illustrative supporting document. */
  documentRef: string
  status: 'Published' | 'Draft'
}

export type ProjectCategory =
  | 'Infrastructure'
  | 'Education'
  | 'Healthcare'
  | 'Cultural preservation'
  | 'Youth empowerment'
  | 'Water and sanitation'

export type ProjectStage = 'Proposed' | 'Approved' | 'Ongoing' | 'Completed'

export interface ProjectUpdate {
  id: string
  /** ISO date. */
  date: string
  title: string
  body: string
}

export interface ProjectMilestone {
  label: string
  done: boolean
}

export interface ProjectDocument {
  name: string
  kind: 'Budget' | 'Report' | 'Drawing' | 'Approval'
  reference: string
}

export interface BeforeAfter {
  title: string
  beforeImage: string
  afterImage: string
  beforeLabel: string
  afterLabel: string
}

export interface Project {
  id: string
  slug: string
  name: string
  summary: string
  description: string
  location: string
  category: ProjectCategory
  stage: ProjectStage
  estimatedCostNgn: number
  fundingTargetNgn: number
  raisedNgn: number
  startYear: number
  beneficiaries: string
  communityBenefits: string[]
  milestones: ProjectMilestone[]
  updates: ProjectUpdate[]
  documents: ProjectDocument[]
  /** Illustrative location relative to the local coastline, not geo-accurate. */
  locationNote: string
  mapX: number
  mapY: number
  beforeAfter: BeforeAfter | null
}

export interface DonationCategory {
  id: string
  label: string
  description: string
  /** One of the prototype image keys, used as the band illustration. */
  image: 'hero' | 'river' | 'boats' | 'people' | 'elder' | 'community'
}

export interface Contribution {
  id: string
  categoryId: string
  amountNgn: number
  contributorName: string
  anonymous: boolean
  /** ISO date. */
  date: string
  reference: string
  receiptNo: string
}

export type KnowledgeKind = 'Article' | 'Research' | 'Webinar' | 'Report' | 'Resource'

export interface KnowledgeResource {
  id: string
  slug: string
  kind: KnowledgeKind
  title: string
  author: string
  authorRole: string
  /** ISO date. */
  date: string
  topics: string[]
  summary: string
  body: string[]
  status: 'Published' | 'Submitted' | 'In review'
}

export type OpportunityKind =
  | 'Scholarship'
  | 'Internship'
  | 'Mentorship'
  | 'Vocational training'
  | 'Career resource'

export interface Opportunity {
  id: string
  slug: string
  kind: OpportunityKind
  title: string
  provider: string
  location: string
  studyLevel: string
  award: string
  eligibility: string[]
  summary: string
  /** ISO date the application window closes. */
  deadline: string
  status: 'Open' | 'Closing soon' | 'Closed'
}

export interface Application {
  id: string
  opportunityId: string
  applicantName: string
  email: string
  motivation: string
  /** ISO date. */
  date: string
  status: 'Submitted' | 'Under review' | 'Shortlisted' | 'Not taken forward'
}

export interface BusinessListing {
  id: string
  slug: string
  name: string
  category: string
  owner: string
  location: string
  description: string
  services: string[]
  contactEmail: string
  website: string
  /** True when the owner is based outside the home region. */
  diasporaOwned: boolean
  status: 'Published' | 'Pending review'
}

export type VolunteerCategory =
  | 'Engineering'
  | 'Healthcare'
  | 'Education'
  | 'Law'
  | 'Finance'
  | 'Technology'
  | 'Entrepreneurship'

export interface Volunteer {
  id: string
  name: string
  profession: string
  category: VolunteerCategory
  skills: string[]
  availability: string
  mode: 'Remote' | 'Local' | 'Either'
  location: string
  status: 'Registered' | 'Matched' | 'Pending'
}

export type FeedbackKind = 'Suggestion' | 'Survey response' | 'Project proposal' | 'General feedback'

export type ModerationStatus = 'Submitted' | 'Under review' | 'Published'

export interface FeedbackEntry {
  id: string
  kind: FeedbackKind
  subject: string
  message: string
  submittedBy: string
  /** ISO date. */
  date: string
  status: ModerationStatus
  response: string | null
}

export type PartnerType =
  | 'Development agency'
  | 'Foundation'
  | 'Corporate sponsor'
  | 'Diaspora contributor'

export interface PartnershipEnquiry {
  id: string
  organisation: string
  contactName: string
  email: string
  type: PartnerType
  priority: string
  message: string
  /** ISO date. */
  date: string
  status: ModerationStatus
}

export interface FinancialStatement {
  id: string
  title: string
  period: string
  scope: string
  lines: { label: string; amountNgn: number }[]
  /** Always an illustrative sample: this project has no audited accounts. */
  label: 'Illustrative sample'
}

export interface BudgetLine {
  id: string
  projectId: string
  item: string
  budgetNgn: number
  spentNgn: number
}

export interface AdminRole {
  id: string
  name: string
  description: string
  holders: number
  permissions: string[]
}

export interface ActivityEntry {
  id: string
  /** ISO date. */
  date: string
  actor: string
  action: string
  target: string
}

export interface DiasporaRegistration {
  id: string
  name: string
  email: string
  country: string
  interests: string[]
  willingToVolunteer: boolean
  /** ISO date. */
  date: string
  status: 'Registered' | 'Contacted'
}

export interface DemoDataset {
  members: Member[]
  transactions: Transaction[]
  duesInvoices: DuesInvoice[]
  meetings: MeetingRecord[]
  projects: Project[]
  donationCategories: DonationCategory[]
  contributions: Contribution[]
  knowledge: KnowledgeResource[]
  opportunities: Opportunity[]
  applications: Application[]
  businesses: BusinessListing[]
  volunteers: Volunteer[]
  feedback: FeedbackEntry[]
  partnerships: PartnershipEnquiry[]
  statements: FinancialStatement[]
  budgetLines: BudgetLine[]
  adminRoles: AdminRole[]
  activity: ActivityEntry[]
  diasporaRegistrations: DiasporaRegistration[]
}
