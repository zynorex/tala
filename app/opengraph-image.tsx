import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const brandBg = 'linear-gradient(135deg, #c5e5ff 0%, #fff5b1 50%, #ffd1dc 100%)';
const borderColor = '#000000';
const titleColor = '#000000';
const accentColor = '#0d9488';

function titleFromPath(pathname: string) {
  if (pathname === '/' || pathname === '') return 'Home';
  const segments = pathname.split('/').filter(Boolean);
  return segments
    .map((seg) => seg.replace(/-/g, ' '))
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
    .join(' / ');
}

export default function OpenGraphImage({ request }: { request: Request }) {
  const { pathname } = new URL(request.url);
  const pageTitle = titleFromPath(pathname);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          backgroundImage: brandBg,
          border: `8px solid ${borderColor}`,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: 72,
                height: 72,
                border: `6px solid ${borderColor}`,
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 36,
                fontWeight: 900,
              }}
            >
              T
            </div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 900, color: titleColor }}>T.A.L.A.</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: accentColor }}>Trust is Code</div>
            </div>
          </div>
          <div
            style={{
              padding: '12px 18px',
              border: `4px solid ${borderColor}`,
              background: '#ffffff',
              fontSize: 18,
              fontWeight: 800,
              color: '#000000',
            }}
          >
            usetala.in
          </div>
        </div>

        <div style={{ marginTop: 48, flex: 1, display: 'flex', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: accentColor, marginBottom: 12 }}>Page</div>
            <div style={{ fontSize: 64, fontWeight: 900, color: titleColor, lineHeight: 1.05 }}>{pageTitle}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#111111' }}>Secure exam delivery on-chain</div>
          <div
            style={{
              padding: '10px 16px',
              border: `4px solid ${borderColor}`,
              background: '#000000',
              color: '#ffffff',
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: 0.5,
            }}
          >
            Trust by Design
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
