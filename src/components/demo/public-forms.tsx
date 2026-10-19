'use client'

import { useDemo } from '@/lib/demo/store'
import type {
  FeedbackKind,
  KnowledgeKind,
  PartnerType,
  VolunteerCategory,
} from '@/lib/demo/types'
import { compactErrors, required, validEmail } from '@/lib/demo/validate'

import { CheckboxField, FieldSetLabel, FormFeedback, SelectField, TextAreaField, TextField } from './form-field'
import { useDemoForm } from './use-demo-form'

/**
 * The public demonstration forms.
 *
 * Every form here validates in the browser and then records its entry in the
 * shared demonstration store (`src/lib/demo/store.tsx`), so it appears in the
 * admin area of the same browser. Nothing is sent anywhere; each form says so.
 */

const VOLUNTEER_CATEGORIES: VolunteerCategory[] = [
  'Engineering',
  'Healthcare',
  'Education',
  'Law',
  'Finance',
  'Technology',
  'Entrepreneurship',
]

const FEEDBACK_KINDS: FeedbackKind[] = [
  'Suggestion',
  'Survey response',
  'Project proposal',
  'General feedback',
]

const PARTNER_TYPES: PartnerType[] = [
  'Development agency',
  'Foundation',
  'Corporate sponsor',
  'Diaspora contributor',
]

const KNOWLEDGE_KINDS: KnowledgeKind[] = ['Article', 'Research', 'Webinar', 'Report', 'Resource']

function options(values: readonly string[]) {
  return values.map((value) => ({ value, label: value }))
}

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

/* -------------------------------------------------------------------------- */

const VOLUNTEER_INITIAL = {
  name: '',
  profession: '',
  category: 'Engineering',
  skills: '',
  availability: '',
  mode: 'Either',
  location: '',
}

export function VolunteerForm() {
  const { submitVolunteer } = useDemo()

  const form = useDemoForm(VOLUNTEER_INITIAL, (values) =>
    compactErrors<keyof typeof values>({
      name: required(values.name, 'Your name'),
      profession: required(values.profession, 'Your profession'),
      skills: required(values.skills, 'At least one skill'),
      availability: required(values.availability, 'Your availability'),
      location: required(values.location, 'Your location'),
    }),
  )

  return (
    <form noValidate onSubmit={(event) => form.handleSubmit(event, (values) => {
      submitVolunteer({
        name: values.name.trim(),
        profession: values.profession.trim(),
        category: values.category as VolunteerCategory,
        skills: splitList(values.skills),
        availability: values.availability.trim(),
        mode: values.mode as 'Remote' | 'Local' | 'Either',
        location: values.location.trim(),
      })
      return 'Thank you — your skills have been added to the demonstration database. Private contact details are never shown in the directory.'
    })}>
      <p className="form-note wide">
        <strong>Demonstration form.</strong> Entries are held in this browser only and appear in the
        admin area. Nothing is stored on a server.
      </p>

      <TextField id={`${form.uid}-name`} name="name" label="Your name" value={form.values.name} error={form.errors.name} onChange={form.handleChange} required autoComplete="name" />
      <TextField id={`${form.uid}-profession`} name="profession" label="Profession" value={form.values.profession} error={form.errors.profession} onChange={form.handleChange} required />
      <SelectField id={`${form.uid}-category`} name="category" label="Professional category" value={form.values.category} error={form.errors.category} onChange={form.handleChange} options={options(VOLUNTEER_CATEGORIES)} />
      <SelectField id={`${form.uid}-mode`} name="mode" label="Volunteering preference" value={form.values.mode} onChange={form.handleChange} options={options(['Remote', 'Local', 'Either'])} />
      <TextField id={`${form.uid}-skills`} name="skills" label="Skills" value={form.values.skills} error={form.errors.skills} onChange={form.handleChange} hint="Separate each skill with a comma." required />
      <TextField id={`${form.uid}-availability`} name="availability" label="Availability" value={form.values.availability} error={form.errors.availability} onChange={form.handleChange} required />
      <TextField id={`${form.uid}-location`} name="location" label="Location" value={form.values.location} error={form.errors.location} onChange={form.handleChange} required wide />

      <div className="form-actions wide">
        <button type="submit" className="btn primary">
          Register my skills
        </button>
        <p className="form-hint">Contact details stay private; only your category and location are shown.</p>
      </div>

      <FormFeedback message={form.message} />
    </form>
  )
}

/* -------------------------------------------------------------------------- */

const FEEDBACK_INITIAL = {
  kind: 'Suggestion',
  subject: '',
  message: '',
  submittedBy: '',
}

export function FeedbackForm() {
  const { submitFeedback } = useDemo()

  const form = useDemoForm(FEEDBACK_INITIAL, (values) =>
    compactErrors<keyof typeof values>({
      subject: required(values.subject, 'A short subject'),
      message: required(values.message, 'Your message'),
      submittedBy: required(values.submittedBy, 'Your name'),
    }),
  )

  return (
    <form noValidate onSubmit={(event) => form.handleSubmit(event, (values) => {
      submitFeedback({
        kind: values.kind as FeedbackKind,
        subject: values.subject.trim(),
        message: values.message.trim(),
        submittedBy: values.submittedBy.trim(),
      })
      return 'Thank you — your entry has been recorded with the status Submitted. You can follow its moderation status in the table below.'
    })}>
      <SelectField id={`${form.uid}-kind`} name="kind" label="What kind of feedback is this?" value={form.values.kind} onChange={form.handleChange} options={options(FEEDBACK_KINDS)} wide />
      <TextField id={`${form.uid}-subject`} name="subject" label="Subject" value={form.values.subject} error={form.errors.subject} onChange={form.handleChange} required />
      <TextField id={`${form.uid}-name`} name="submittedBy" label="Your name" value={form.values.submittedBy} error={form.errors.submittedBy} onChange={form.handleChange} required />
      <TextAreaField id={`${form.uid}-message`} name="message" label="Your message" value={form.values.message} error={form.errors.message} onChange={form.handleChange} required />

      <div className="form-actions wide">
        <button type="submit" className="btn primary">
          Submit feedback
        </button>
      </div>

      <FormFeedback message={form.message} />
    </form>
  )
}

/* -------------------------------------------------------------------------- */

const BUSINESS_INITIAL = {
  name: '',
  category: '',
  owner: '',
  location: '',
  description: '',
  services: '',
  contactEmail: '',
  website: '',
}

export function BusinessSubmissionForm() {
  const { submitBusiness } = useDemo()

  const form = useDemoForm(BUSINESS_INITIAL, (values) =>
    compactErrors<keyof typeof values>({
      name: required(values.name, 'The business name'),
      category: required(values.category, 'A category'),
      owner: required(values.owner, 'The owner or contact name'),
      location: required(values.location, 'A location'),
      description: required(values.description, 'A short description'),
      contactEmail: validEmail(values.contactEmail),
    }),
  )

  return (
    <form noValidate onSubmit={(event) => form.handleSubmit(event, (values) => {
      submitBusiness({
        name: values.name.trim(),
        category: values.category.trim(),
        owner: values.owner.trim(),
        location: values.location.trim(),
        description: values.description.trim(),
        services: splitList(values.services),
        contactEmail: values.contactEmail.trim(),
        website: values.website.trim(),
        diasporaOwned: false,
      })
      return 'Thank you — the listing was added with the status Pending review. It appears in the admin area for approval.'
    })}>
      <p className="form-note wide">
        <strong>Demonstration form.</strong> Listings are not verified and are labelled as
        illustrative. Submission here does not create a real directory entry.
      </p>

      <TextField id={`${form.uid}-name`} name="name" label="Business name" value={form.values.name} error={form.errors.name} onChange={form.handleChange} required />
      <TextField id={`${form.uid}-category`} name="category" label="Category" value={form.values.category} error={form.errors.category} onChange={form.handleChange} required />
      <TextField id={`${form.uid}-owner`} name="owner" label="Owner or contact name" value={form.values.owner} error={form.errors.owner} onChange={form.handleChange} required />
      <TextField id={`${form.uid}-location`} name="location" label="Location" value={form.values.location} error={form.errors.location} onChange={form.handleChange} required />
      <TextAreaField id={`${form.uid}-description`} name="description" label="Description" value={form.values.description} error={form.errors.description} onChange={form.handleChange} rows={3} />
      <TextField id={`${form.uid}-services`} name="services" label="Services" value={form.values.services} onChange={form.handleChange} hint="Separate each service with a comma." />
      <TextField id={`${form.uid}-email`} name="contactEmail" label="Contact email" type="email" value={form.values.contactEmail} error={form.errors.contactEmail} onChange={form.handleChange} required />
      <TextField id={`${form.uid}-website`} name="website" label="Website (optional)" type="url" value={form.values.website} onChange={form.handleChange} />

      <div className="form-actions wide">
        <button type="submit" className="btn primary">
          Submit listing
        </button>
      </div>

      <FormFeedback message={form.message} />
    </form>
  )
}

/* -------------------------------------------------------------------------- */

const PARTNERSHIP_INITIAL = {
  organisation: '',
  contactName: '',
  email: '',
  type: 'Foundation',
  priority: '',
  message: '',
}

export function PartnershipForm() {
  const { submitPartnership } = useDemo()

  const form = useDemoForm(PARTNERSHIP_INITIAL, (values) =>
    compactErrors<keyof typeof values>({
      organisation: required(values.organisation, 'The organisation name'),
      contactName: required(values.contactName, 'A contact name'),
      email: validEmail(values.email),
      priority: required(values.priority, 'A development priority'),
      message: required(values.message, 'A short message'),
    }),
  )

  return (
    <form noValidate onSubmit={(event) => form.handleSubmit(event, (values) => {
      submitPartnership({
        organisation: values.organisation.trim(),
        contactName: values.contactName.trim(),
        email: values.email.trim(),
        type: values.type as PartnerType,
        priority: values.priority.trim(),
        message: values.message.trim(),
      })
      return 'Thank you — your enquiry has been recorded in the demonstration store and appears in the admin area. No real organisation has been contacted.'
    })}>
      <p className="form-note wide">
        <strong>Demonstration form.</strong> This does not contact any real agency, foundation or
        sponsor, and no partnership is implied.
      </p>

      <TextField id={`${form.uid}-org`} name="organisation" label="Organisation" value={form.values.organisation} error={form.errors.organisation} onChange={form.handleChange} required />
      <TextField id={`${form.uid}-contact`} name="contactName" label="Contact name" value={form.values.contactName} error={form.errors.contactName} onChange={form.handleChange} required />
      <TextField id={`${form.uid}-email`} name="email" label="Contact email" type="email" value={form.values.email} error={form.errors.email} onChange={form.handleChange} required />
      <SelectField id={`${form.uid}-type`} name="type" label="Partnership type" value={form.values.type} onChange={form.handleChange} options={options(PARTNER_TYPES)} />
      <TextField id={`${form.uid}-priority`} name="priority" label="Development priority" value={form.values.priority} error={form.errors.priority} onChange={form.handleChange} hint="For example: infrastructure, healthcare, education." required wide />
      <TextAreaField id={`${form.uid}-message`} name="message" label="How would you like to work with BTA?" value={form.values.message} error={form.errors.message} onChange={form.handleChange} required />

      <div className="form-actions wide">
        <button type="submit" className="btn primary">
          Send enquiry
        </button>
      </div>

      <FormFeedback message={form.message} />
    </form>
  )
}

/* -------------------------------------------------------------------------- */

const APPLICATION_INITIAL = { applicantName: '', email: '', motivation: '' }

export function ScholarshipApplicationForm({
  opportunityId,
  opportunityTitle,
}: {
  opportunityId: string
  opportunityTitle: string
}) {
  const { submitApplication } = useDemo()

  const form = useDemoForm(APPLICATION_INITIAL, (values) =>
    compactErrors<keyof typeof values>({
      applicantName: required(values.applicantName, 'Your name'),
      email: validEmail(values.email),
      motivation: required(values.motivation, 'A short statement'),
    }),
  )

  return (
    <form noValidate onSubmit={(event) => form.handleSubmit(event, (values) => {
      submitApplication({
        opportunityId,
        applicantName: values.applicantName.trim(),
        email: values.email.trim(),
        motivation: values.motivation.trim(),
      })
      return `Thank you — your application for ${opportunityTitle} has been recorded with the status Submitted. It appears in the demonstration admin area for review.`
    })}>
      <p className="form-note wide">
        <strong>Demonstration application.</strong> This is a fictional opportunity. Submitting does
        not apply for a real scholarship and no payment or document is ever requested.
      </p>

      <TextField id={`${form.uid}-name`} name="applicantName" label="Applicant name" value={form.values.applicantName} error={form.errors.applicantName} onChange={form.handleChange} required />
      <TextField id={`${form.uid}-email`} name="email" label="Contact email" type="email" value={form.values.email} error={form.errors.email} onChange={form.handleChange} required />
      <TextAreaField id={`${form.uid}-motivation`} name="motivation" label="Short statement" value={form.values.motivation} error={form.errors.motivation} onChange={form.handleChange} hint="A few sentences are enough." required />

      <div className="form-actions wide">
        <button type="submit" className="btn primary">
          Submit application
        </button>
      </div>

      <FormFeedback message={form.message} />
    </form>
  )
}

/* -------------------------------------------------------------------------- */

const DIASPORA_INITIAL = { name: '', email: '', country: '', interests: '', willingToVolunteer: 'false' }

export function DiasporaForm() {
  const { registerDiaspora } = useDemo()

  const form = useDemoForm(DIASPORA_INITIAL, (values) =>
    compactErrors<keyof typeof values>({
      name: required(values.name, 'Your name'),
      email: validEmail(values.email),
      country: required(values.country, 'Your country of residence'),
      interests: required(values.interests, 'At least one interest'),
    }),
  )

  return (
    <form noValidate onSubmit={(event) => form.handleSubmit(event, (values) => {
      registerDiaspora({
        name: values.name.trim(),
        email: values.email.trim(),
        country: values.country.trim(),
        interests: splitList(values.interests),
        willingToVolunteer: values.willingToVolunteer === 'true',
      })
      return 'Thank you — your diaspora registration has been recorded in this browser and appears in the admin area.'
    })}>
      <p className="form-note wide">
        <strong>Demonstration registration.</strong> Nothing is stored on a server and no one is
        contacted.
      </p>

      <TextField id={`${form.uid}-name`} name="name" label="Your name" value={form.values.name} error={form.errors.name} onChange={form.handleChange} required />
      <TextField id={`${form.uid}-email`} name="email" label="Email address" type="email" value={form.values.email} error={form.errors.email} onChange={form.handleChange} required />
      <TextField id={`${form.uid}-country`} name="country" label="Country of residence" value={form.values.country} error={form.errors.country} onChange={form.handleChange} required />
      <TextField id={`${form.uid}-interests`} name="interests" label="Areas of interest" value={form.values.interests} error={form.errors.interests} onChange={form.handleChange} hint="For example: mentorship, funding, events." required wide />
      <CheckboxField id={`${form.uid}-volunteer`} name="willingToVolunteer" label="I would like to volunteer remotely" checked={form.values.willingToVolunteer === 'true'} onChange={form.handleChange} />

      <div className="form-actions wide">
        <button type="submit" className="btn primary">
          Register as diaspora
        </button>
      </div>

      <FormFeedback message={form.message} />
    </form>
  )
}

/* -------------------------------------------------------------------------- */

const KNOWLEDGE_INITIAL = {
  kind: 'Article',
  title: '',
  author: '',
  authorRole: '',
  topics: '',
  summary: '',
  body: '',
}

export function KnowledgeContributionForm() {
  const { submitFeedback } = useDemo()

  const form = useDemoForm(KNOWLEDGE_INITIAL, (values) =>
    compactErrors<keyof typeof values>({
      title: required(values.title, 'A title'),
      author: required(values.author, 'Your name'),
      summary: required(values.summary, 'A short summary'),
      body: required(values.body, 'The main text'),
    }),
  )

  return (
    <form noValidate onSubmit={(event) => form.handleSubmit(event, (values) => {
      const topics = splitList(values.topics)
      submitFeedback({
        kind: 'Project proposal',
        subject: `[Knowledge contribution: ${values.kind}] ${values.title.trim()}`,
        message: `${values.summary.trim()}\n\n${values.body.trim()}`,
        submittedBy: `${values.author.trim()}${values.authorRole ? ` (${values.authorRole.trim()})` : ''}${topics.length ? ` — topics: ${topics.join(', ')}` : ''}`,
      })
      return 'Thank you — your contribution has been recorded with the status Submitted and appears in the moderation queue for review.'
    })}>
      <p className="form-note wide">
        <strong>Demonstration submission.</strong> Contributions are not published automatically;
        they enter the review queue in the admin area.
      </p>

      <FieldSetLabel>Contribution details</FieldSetLabel>

      <SelectField id={`${form.uid}-kind`} name="kind" label="Contribution type" value={form.values.kind} onChange={form.handleChange} options={options(KNOWLEDGE_KINDS)} />
      <TextField id={`${form.uid}-title`} name="title" label="Title" value={form.values.title} error={form.errors.title} onChange={form.handleChange} required />
      <TextField id={`${form.uid}-author`} name="author" label="Author name" value={form.values.author} error={form.errors.author} onChange={form.handleChange} required />
      <TextField id={`${form.uid}-role`} name="authorRole" label="Author role (optional)" value={form.values.authorRole} onChange={form.handleChange} />
      <TextField id={`${form.uid}-topics`} name="topics" label="Topics" value={form.values.topics} onChange={form.handleChange} hint="Separate each topic with a comma." wide />
      <TextAreaField id={`${form.uid}-summary`} name="summary" label="Summary" value={form.values.summary} error={form.errors.summary} onChange={form.handleChange} rows={3} />
      <TextAreaField id={`${form.uid}-body`} name="body" label="Main text" value={form.values.body} error={form.errors.body} onChange={form.handleChange} rows={7} />

      <div className="form-actions wide">
        <button type="submit" className="btn primary">
          Submit for review
        </button>
      </div>

      <FormFeedback message={form.message} />
    </form>
  )
}
