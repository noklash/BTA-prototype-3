import { ImageResponse } from 'next/og'

/**
 * The social sharing image.
 *
 * Every page points its Open Graph and Twitter card at this route with the
 * page title as a parameter, so a shared link always shows the BTA mark, the
 * brand colours and the page it came from — without a separate asset per
 * route.
 *
 * The image is drawn with the same type scale as the site: Cormorant Garamond
 * for the title, Manrope for the eyebrow and the line.
 */
export const runtime = 'edge'

export const alt = 'Bainbo Taria Awo  '
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = (searchParams.get('title') ?? 'Bainbo Taria Awo  ').slice(0, 120)
  const eyebrow = (searchParams.get('eyebrow') ?? 'Bainbo Taria Awo  ').slice(0, 60)
  const footer = (searchParams.get('footer') ?? 'Our heritage. Our people. Our future.').slice(0, 80)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#061d35',
          padding: '72px',
          fontFamily: 'Manrope, Arial, sans-serif',
        }}
      >
        {/* The mark: a gold ring with three strokes, as on the site header. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '999px',
              border: '3px solid #d5a62e',
              background: '#0a3157',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            <div style={{ width: '32px', height: '3px', background: '#d5a62e', transform: 'rotate(-9deg)' }} />
            <div style={{ width: '32px', height: '3px', background: '#d5a62e', transform: 'rotate(-9deg)' }} />
            <div style={{ width: '32px', height: '3px', background: '#d5a62e', transform: 'rotate(-9deg)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: '#ffffff', fontSize: '38px', letterSpacing: '0.06em' }}>BTA</div>
            <div
              style={{
                color: '#8fa2b3',
                fontSize: '13px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}
            >
              Bainbo Taria Awo
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div
            style={{
              color: '#d5a62e',
              fontSize: '16px',
              fontWeight: 700,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              color: '#ffffff',
              fontSize: '62px',
              lineHeight: 1.08,
              fontFamily: 'Cormorant Garamond, Georgia, serif',
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #2c4258',
            paddingTop: '24px',
            color: '#8fa2b3',
            fontSize: '15px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          <span>{footer}</span>
          <span style={{ color: '#f0d47c' }}>bainbotariaawo.org</span>
        </div>
      </div>
    ),
    size,
  )
}
