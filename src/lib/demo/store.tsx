'use client'

/**
 * Client-side demonstration store.
 *
 * The baseline dataset (`src/lib/demo/data.ts`) is the single source of truth
 * for Prototype 3. This provider layers interactive changes on top of that
 * baseline — a form submitted on a public page, a simulated dues payment in the
 * members' portal, a status change in the admin area — and persists them to
 * `localStorage`, so the same browser sees a consistent platform:
 *
 *   public form submission  ->  admin queue  ->  status change  ->  portal view
 *
 * Nothing is sent to a server and nothing survives clearing browser storage.
 * That limitation is stated in the UI wherever a mutation happens.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import {
  computeDemoStats,
  DEMO_DATA,
  DEMO_MEMBER_ID,
  type DemoStats,
} from './data'
import type {
  Application,
  BusinessListing,
  Contribution,
  DemoDataset,
  DiasporaRegistration,
  FeedbackEntry,
  ForumComment,
  ForumReply,
  KnowledgeResource,
  MeetingRecord,
  Member,
  ModerationStatus,
  PartnershipEnquiry,
  ProjectStage,
  Transaction,
  Volunteer,
} from './types'

const STORAGE_KEY = 'bta-prototype3-demo-v1'

export interface DemoSession {
  memberId: string
}

interface DemoContextValue {
  /** False until persisted state has been read, so UI can avoid a hydration flash. */
  hydrated: boolean
  session: DemoSession | null
  data: DemoDataset
  stats: DemoStats
  currentMember: Member | null
  memberById: (id: string) => Member | null
  login: (memberId?: string) => void
  logout: () => void
  updateProfile: (patch: Partial<Member>) => void
  payDues: (invoiceId: string) => Transaction | null
  makeContribution: (input: {
    categoryId: string
    amountNgn: number
    contributorName: string
    anonymous: boolean
  }) => Contribution
  submitApplication: (input: {
    opportunityId: string
    applicantName: string
    email: string
    motivation: string
  }) => Application
  submitBusiness: (input: Omit<BusinessListing, 'id' | 'slug' | 'status'>) => BusinessListing
  submitVolunteer: (input: Omit<Volunteer, 'id' | 'status'>) => Volunteer
  submitFeedback: (input: {
    kind: FeedbackEntry['kind']
    subject: string
    message: string
    submittedBy: string
  }) => FeedbackEntry
  submitPartnership: (input: Omit<PartnershipEnquiry, 'id' | 'date' | 'status'>) => PartnershipEnquiry
  registerDiaspora: (input: Omit<DiasporaRegistration, 'id' | 'date' | 'status'>) => DiasporaRegistration
  /** Adds a comment to a forum thread. Returns null when nobody is signed in. */
  addForumComment: (threadSlug: string, body: string) => ForumComment | null
  /** Adds a reply to a comment. Returns null when nobody is signed in. */
  addForumReply: (threadSlug: string, commentId: string, body: string) => ForumReply | null
  /** The comments on a thread, oldest first, with their replies. */
  commentsForThread: (threadSlug: string) => ForumComment[]
  setFeedbackStatus: (id: string, status: ModerationStatus, response?: string | null) => void
  setApplicationStatus: (id: string, status: Application['status']) => void
  setVolunteerStatus: (id: string, status: Volunteer['status']) => void
  setBusinessStatus: (id: string, status: BusinessListing['status']) => void
  setProjectStage: (projectId: string, stage: ProjectStage) => void
  setKnowledgeStatus: (id: string, status: KnowledgeResource['status']) => void
  setMeetingStatus: (id: string, status: MeetingRecord['status']) => void
  setMemberDuesStatus: (id: string, status: Member['duesStatus']) => void
  reset: () => void
}

const DemoContext = createContext<DemoContextValue | null>(null)

/** Deep-copies the baseline so the module-level constant is never mutated. */
function baseline(): DemoDataset {
  return structuredClone(DEMO_DATA)
}

let sequence = 0
function nextId(prefix: string): string {
  sequence += 1
  const stamp = Date.now().toString(36)
  return `${prefix}-${stamp}-${sequence}`
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

function reference(prefix: string): string {
  return `DEMO-${prefix}-${Math.floor(1000 + Math.random() * 9000)}`
}

/**
 * Reads and lightly validates persisted state. Anything unexpected (a schema
 * change, corrupted JSON) falls back to the baseline rather than throwing, so a
 * stale key can never break the site.
 */
function loadPersisted(): { data: DemoDataset; session: DemoSession | null } {
  const fallback = { data: baseline(), session: null as DemoSession | null }

  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return fallback
    }

    const parsed = JSON.parse(raw) as {
      data?: Partial<DemoDataset>
      session?: DemoSession | null
    }

    if (!parsed || typeof parsed !== 'object' || !parsed.data) {
      return fallback
    }

    const base = baseline()
    const merged: DemoDataset = { ...base }
    for (const key of Object.keys(base) as (keyof DemoDataset)[]) {
      const value = parsed.data[key]
      if (Array.isArray(value)) {
        // Each collection is validated only as an array of objects; the shapes
        // are owned by this application, so a deeper check adds little here.
        merged[key] = value as never
      }
    }

    const session =
      parsed.session && typeof parsed.session.memberId === 'string' ? parsed.session : null

    return { data: merged, session }
  } catch {
    return fallback
  }
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DemoDataset>(() => baseline())
  const [session, setSession] = useState<DemoSession | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const loaded = useRef(false)

  // Load persisted state once, after mount.
  useEffect(() => {
    if (loaded.current) {
      return
    }
    loaded.current = true
    const persisted = loadPersisted()
    setData(persisted.data)
    setSession(persisted.session)
    setHydrated(true)
  }, [])

  // Persist on every change, once hydrated.
  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') {
      return
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, session }))
    } catch {
      // Storage can be full or disabled (private mode); the demonstration still
      // works for the current page, it just will not persist.
    }
  }, [data, session, hydrated])

  const login = useCallback((memberId: string = DEMO_MEMBER_ID) => {
    setSession({ memberId })
  }, [])

  const logout = useCallback(() => {
    setSession(null)
  }, [])

  const currentMember = useMemo(() => {
    if (!session) {
      return null
    }
    return data.members.find((member) => member.id === session.memberId) ?? null
  }, [data.members, session])

  const memberById = useCallback(
    (id: string) => data.members.find((member) => member.id === id) ?? null,
    [data.members],
  )

  const updateProfile = useCallback(
    (patch: Partial<Member>) => {
      setSession((current) => {
        if (!current) {
          return current
        }
        setData((previous) => ({
          ...previous,
          members: previous.members.map((member) =>
            member.id === current.memberId ? { ...member, ...patch } : member,
          ),
        }))
        return current
      })
    },
    [],
  )

  const payDues = useCallback(
    (invoiceId: string): Transaction | null => {
      const invoice = data.duesInvoices.find((item) => item.id === invoiceId)
      if (!invoice) {
        return null
      }

      const transaction: Transaction = {
        id: nextId('txn'),
        memberId: invoice.memberId,
        kind: 'Dues',
        description: invoice.period,
        amountNgn: invoice.amountNgn,
        date: todayIso(),
        method: 'Simulated card',
        reference: reference('TXN'),
        receiptNo: reference('RCP'),
      }

      setData((previous) => ({
        ...previous,
        transactions: [transaction, ...previous.transactions],
        duesInvoices: previous.duesInvoices.map((item) =>
          item.id === invoiceId ? { ...item, status: 'Paid' } : item,
        ),
        members: previous.members.map((member) =>
          member.id === invoice.memberId ? { ...member, duesStatus: 'Paid' } : member,
        ),
        activity: [
          {
            id: nextId('act'),
            date: todayIso(),
            actor: 'Member',
            action: 'Made a simulated dues payment',
            target: invoice.period,
          },
          ...previous.activity,
        ],
      }))

      return transaction
    },
    [data.duesInvoices],
  )

  const makeContribution = useCallback<DemoContextValue['makeContribution']>((input) => {
    const contribution: Contribution = {
      id: nextId('con'),
      categoryId: input.categoryId,
      amountNgn: input.amountNgn,
      contributorName: input.anonymous ? 'A member (anonymous)' : input.contributorName,
      anonymous: input.anonymous,
      date: todayIso(),
      reference: reference('DON'),
      receiptNo: reference('DON'),
    }

    setData((previous) => ({
      ...previous,
      contributions: [contribution, ...previous.contributions],
      activity: [
        {
          id: nextId('act'),
          date: todayIso(),
          actor: 'Supporter',
          action: 'Made a simulated contribution',
          target: input.categoryId,
        },
        ...previous.activity,
      ],
    }))

    return contribution
  }, [])

  const submitApplication = useCallback<DemoContextValue['submitApplication']>((input) => {
    const application: Application = {
      id: nextId('app'),
      opportunityId: input.opportunityId,
      applicantName: input.applicantName,
      email: input.email,
      motivation: input.motivation,
      date: todayIso(),
      status: 'Submitted',
    }
    setData((previous) => ({
      ...previous,
      applications: [application, ...previous.applications],
    }))
    return application
  }, [])

  const submitBusiness = useCallback<DemoContextValue['submitBusiness']>((input) => {
    const business: BusinessListing = {
      ...input,
      id: nextId('biz'),
      slug: `${input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`,
      status: 'Pending review',
    }
    setData((previous) => ({
      ...previous,
      businesses: [business, ...previous.businesses],
    }))
    return business
  }, [])

  const submitVolunteer = useCallback<DemoContextValue['submitVolunteer']>((input) => {
    const volunteer: Volunteer = { ...input, id: nextId('vol'), status: 'Registered' }
    setData((previous) => ({
      ...previous,
      volunteers: [volunteer, ...previous.volunteers],
    }))
    return volunteer
  }, [])

  const submitFeedback = useCallback<DemoContextValue['submitFeedback']>((input) => {
    const entry: FeedbackEntry = {
      id: nextId('fbk'),
      kind: input.kind,
      subject: input.subject,
      message: input.message,
      submittedBy: input.submittedBy,
      date: todayIso(),
      status: 'Submitted',
      response: null,
    }
    setData((previous) => ({ ...previous, feedback: [entry, ...previous.feedback] }))
    return entry
  }, [])

  const submitPartnership = useCallback<DemoContextValue['submitPartnership']>((input) => {
    const enquiry: PartnershipEnquiry = {
      ...input,
      id: nextId('ptn'),
      date: todayIso(),
      status: 'Submitted',
    }
    setData((previous) => ({ ...previous, partnerships: [enquiry, ...previous.partnerships] }))
    return enquiry
  }, [])

  const registerDiaspora = useCallback<DemoContextValue['registerDiaspora']>((input) => {
    const registration: DiasporaRegistration = {
      ...input,
      id: nextId('dia'),
      date: todayIso(),
      status: 'Registered',
    }
    setData((previous) => ({
      ...previous,
      diasporaRegistrations: [registration, ...previous.diasporaRegistrations],
    }))
    return registration
  }, [])

  const commentsForThread = useCallback(
    (threadSlug: string) => data.forumComments.filter((comment) => comment.threadSlug === threadSlug),
    [data.forumComments],
  )

  const addForumComment = useCallback<DemoContextValue['addForumComment']>((threadSlug, body) => {
    if (!session || body.trim().length === 0) {
      return null
    }

    const comment: ForumComment = {
      id: nextId('cmt'),
      threadSlug,
      authorId: session.memberId,
      body: body.trim(),
      date: todayIso(),
      replies: [],
    }

    setData((previous) => ({
      ...previous,
      forumComments: [...previous.forumComments, comment],
      activity: [
        {
          id: nextId('act'),
          date: todayIso(),
          actor: 'Member',
          action: 'Commented on a forum thread',
          target: threadSlug,
        },
        ...previous.activity,
      ],
    }))

    return comment
  }, [session])

  const addForumReply = useCallback<DemoContextValue['addForumReply']>(
    (threadSlug, commentId, body) => {
      if (!session || body.trim().length === 0) {
        return null
      }

      const reply: ForumReply = {
        id: nextId('rep'),
        authorId: session.memberId,
        body: body.trim(),
        date: todayIso(),
      }

      setData((previous) => ({
        ...previous,
        forumComments: previous.forumComments.map((comment) =>
          comment.id === commentId && comment.threadSlug === threadSlug
            ? { ...comment, replies: [...comment.replies, reply] }
            : comment,
        ),
        activity: [
          {
            id: nextId('act'),
            date: todayIso(),
            actor: 'Member',
            action: 'Replied to a comment',
            target: threadSlug,
          },
          ...previous.activity,
        ],
      }))

      return reply
    },
    [session],
  )

  const setFeedbackStatus = useCallback<DemoContextValue['setFeedbackStatus']>(
    (id, status, response) => {
      setData((previous) => ({
        ...previous,
        feedback: previous.feedback.map((entry) =>
          entry.id === id
            ? { ...entry, status, response: response === undefined ? entry.response : response }
            : entry,
        ),
      }))
    },
    [],
  )

  const setApplicationStatus = useCallback<DemoContextValue['setApplicationStatus']>(
    (id, status) => {
      setData((previous) => ({
        ...previous,
        applications: previous.applications.map((entry) =>
          entry.id === id ? { ...entry, status } : entry,
        ),
      }))
    },
    [],
  )

  const setVolunteerStatus = useCallback<DemoContextValue['setVolunteerStatus']>((id, status) => {
    setData((previous) => ({
      ...previous,
      volunteers: previous.volunteers.map((entry) =>
        entry.id === id ? { ...entry, status } : entry,
      ),
    }))
  }, [])

  const setBusinessStatus = useCallback<DemoContextValue['setBusinessStatus']>((id, status) => {
    setData((previous) => ({
      ...previous,
      businesses: previous.businesses.map((entry) =>
        entry.id === id ? { ...entry, status } : entry,
      ),
    }))
  }, [])

  const setProjectStage = useCallback<DemoContextValue['setProjectStage']>((projectId, stage) => {
    setData((previous) => ({
      ...previous,
      projects: previous.projects.map((project) =>
        project.id === projectId ? { ...project, stage } : project,
      ),
      activity: [
        {
          id: nextId('act'),
          date: todayIso(),
          actor: 'Administrator',
          action: `Changed a project stage to ${stage}`,
          target: projectId,
        },
        ...previous.activity,
      ],
    }))
  }, [])

  const setKnowledgeStatus = useCallback<DemoContextValue['setKnowledgeStatus']>((id, status) => {
    setData((previous) => ({
      ...previous,
      knowledge: previous.knowledge.map((item) => (item.id === id ? { ...item, status } : item)),
    }))
  }, [])

  const setMeetingStatus = useCallback<DemoContextValue['setMeetingStatus']>((id, status) => {
    setData((previous) => ({
      ...previous,
      meetings: previous.meetings.map((meeting) =>
        meeting.id === id ? { ...meeting, status } : meeting,
      ),
    }))
  }, [])

  const setMemberDuesStatus = useCallback<DemoContextValue['setMemberDuesStatus']>((id, status) => {
    setData((previous) => ({
      ...previous,
      members: previous.members.map((member) =>
        member.id === id ? { ...member, duesStatus: status } : member,
      ),
    }))
  }, [])

  const reset = useCallback(() => {
    setData(baseline())
    setSession(null)
  }, [])

  const stats = useMemo(() => computeDemoStats(data), [data])

  const value = useMemo<DemoContextValue>(
    () => ({
      hydrated,
      session,
      data,
      stats,
      currentMember,
      memberById,
      login,
      logout,
      updateProfile,
      payDues,
      makeContribution,
      submitApplication,
      submitBusiness,
      submitVolunteer,
      submitFeedback,
      submitPartnership,
      registerDiaspora,
      commentsForThread,
      addForumComment,
      addForumReply,
      setFeedbackStatus,
      setApplicationStatus,
      setVolunteerStatus,
      setBusinessStatus,
      setProjectStage,
      setKnowledgeStatus,
      setMeetingStatus,
      setMemberDuesStatus,
      reset,
    }),
    [
      hydrated,
      session,
      data,
      stats,
      currentMember,
      memberById,
      login,
      logout,
      updateProfile,
      payDues,
      makeContribution,
      submitApplication,
      submitBusiness,
      submitVolunteer,
      submitFeedback,
      submitPartnership,
      registerDiaspora,
      commentsForThread,
      addForumComment,
      addForumReply,
      setFeedbackStatus,
      setApplicationStatus,
      setVolunteerStatus,
      setBusinessStatus,
      setProjectStage,
      setKnowledgeStatus,
      setMeetingStatus,
      setMemberDuesStatus,
      reset,
    ],
  )

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo(): DemoContextValue {
  const value = useContext(DemoContext)
  if (!value) {
    throw new Error('useDemo must be used inside <DemoProvider>.')
  }
  return value
}
