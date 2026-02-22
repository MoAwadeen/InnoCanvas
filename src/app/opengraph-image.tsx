import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'InnoCanvas - AI Business Model Canvas Generator';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #0a0f1c 0%, #111827 50%, #0a0f1c 100%)',
                    fontFamily: 'Inter, sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Grid pattern overlay */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        opacity: 0.08,
                        backgroundImage:
                            'linear-gradient(rgba(119,255,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(119,255,0,0.3) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />

                {/* Glow effect */}
                <div
                    style={{
                        position: 'absolute',
                        top: -100,
                        right: -100,
                        width: 500,
                        height: 500,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(119,255,0,0.15) 0%, transparent 70%)',
                        display: 'flex',
                    }}
                />

                {/* Content */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: '60px 80px',
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {/* Logo / Brand */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                        <div
                            style={{
                                display: 'flex',
                                gap: '4px',
                                flexWrap: 'wrap',
                                width: '40px',
                                height: '40px',
                            }}
                        >
                            <div style={{ width: '18px', height: '18px', background: '#77ff00', borderRadius: '4px', display: 'flex' }} />
                            <div style={{ width: '18px', height: '18px', background: '#77ff00', borderRadius: '4px', display: 'flex' }} />
                            <div style={{ width: '18px', height: '18px', background: '#77ff00', borderRadius: '4px', display: 'flex' }} />
                            <div style={{ width: '18px', height: '18px', background: '#77ff00', borderRadius: '4px', display: 'flex' }} />
                        </div>
                        <span style={{ color: '#77ff00', fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px' }}>
                            InnoCanvas
                        </span>
                    </div>

                    {/* Headline */}
                    <h1
                        style={{
                            color: '#ffffff',
                            fontSize: '64px',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            margin: '0 0 20px 0',
                            letterSpacing: '-2px',
                            maxWidth: '700px',
                        }}
                    >
                        Turn Ideas Into Business Models
                    </h1>

                    {/* Subheadline */}
                    <p
                        style={{
                            color: '#9ca3af',
                            fontSize: '24px',
                            fontWeight: 400,
                            margin: 0,
                            maxWidth: '550px',
                            lineHeight: 1.4,
                        }}
                    >
                        AI-powered Business Model Canvas generator for entrepreneurs, startups, and professionals.
                    </p>

                    {/* Accent bar */}
                    <div
                        style={{
                            display: 'flex',
                            width: '120px',
                            height: '4px',
                            background: 'linear-gradient(90deg, #77ff00, #44cc00)',
                            borderRadius: '2px',
                            marginTop: '32px',
                        }}
                    />

                    {/* Domain */}
                    <p style={{ color: '#6b7280', fontSize: '18px', marginTop: '24px', fontWeight: 500 }}>
                        innocanvas.site
                    </p>
                </div>

                {/* Right side: abstract canvas grid */}
                <div
                    style={{
                        position: 'absolute',
                        right: '60px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        opacity: 0.6,
                    }}
                >
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ width: '80px', height: '80px', border: '2px solid #77ff00', borderRadius: '12px', display: 'flex' }} />
                        <div style={{ width: '80px', height: '80px', border: '2px solid #77ff00', borderRadius: '12px', display: 'flex' }} />
                        <div style={{ width: '80px', height: '80px', border: '2px solid #77ff00', borderRadius: '12px', display: 'flex' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ width: '80px', height: '80px', border: '2px solid #77ff00', borderRadius: '12px', display: 'flex' }} />
                        <div style={{ width: '80px', height: '80px', border: '2px solid #77ff00', borderRadius: '12px', background: 'rgba(119,255,0,0.1)', display: 'flex' }} />
                        <div style={{ width: '80px', height: '80px', border: '2px solid #77ff00', borderRadius: '12px', display: 'flex' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ width: '168px', height: '60px', border: '2px solid #77ff00', borderRadius: '12px', display: 'flex' }} />
                        <div style={{ width: '80px', height: '60px', border: '2px solid #77ff00', borderRadius: '12px', display: 'flex' }} />
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}
