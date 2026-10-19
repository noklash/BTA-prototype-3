import { NextResponse } from 'next/server'

import {
  MEMBERSHIP_DEMONSTRATION_SUCCESS_MESSAGE,
  validateMembershipInquiry,
  type MembershipInquiryResponse,
} from '@/lib/validation/membership'

/**
 * `POST /api/membership-inquiry`
 *
 * Validates a membership inquiry and reports the result. It deliberately does
 * **not** persist or forward anything: this project has no database and no mail
 * provider, and pretending otherwise would be misleading. The response carries
 * `demonstration: true` and a message that says so, and the form renders that
 * message verbatim.
 *
 * Body: `{ name: string, email: string, message: string }`
 *
 * Responses:
 *  - `200` `{ ok: true, demonstration: true, message }`        — validated
 *  - `400` `{ ok: false, message }`                            — not valid JSON
 *  - `422` `{ ok: false, message, errors }`                    — field errors
 *  - `415` `{ ok: false, message }`                            — wrong content type
 *
 * This route is statically analysed by Next.js; no runtime secrets or Sanity
 * credentials are read here.
 */

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export async function POST(request: Request): Promise<NextResponse<MembershipInquiryResponse>> {
  const contentType = request.headers.get('content-type') ?? ''

  if (!contentType.toLowerCase().includes('application/json')) {
    return NextResponse.json(
      { ok: false, message: 'Send the inquiry as a JSON body.' },
      { status: 415 },
    )
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, message: 'The request body was not valid JSON.' },
      { status: 400 },
    )
  }

  const validation = validateMembershipInquiry(isPlainObject(payload) ? payload : {})

  if (!validation.success) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Some details need attention before this inquiry can be submitted.',
        errors: validation.errors,
      },
      { status: 422 },
    )
  }

  // Log only that a submission was received. The submitted name, email and
  // message are personal data and are never written to the logs.
  console.info(
    '[membership-inquiry] validated a demonstration submission; nothing was stored or delivered.',
  )

  return NextResponse.json(
    { ok: true, demonstration: true, message: MEMBERSHIP_DEMONSTRATION_SUCCESS_MESSAGE },
    { status: 200 },
  )
}

/** Any other method is a client error, stated explicitly rather than as a 404. */
export function GET(): NextResponse<MembershipInquiryResponse> {
  return NextResponse.json(
    { ok: false, message: 'Only POST is supported by this endpoint.' },
    { status: 405, headers: { Allow: 'POST' } },
  )
}
