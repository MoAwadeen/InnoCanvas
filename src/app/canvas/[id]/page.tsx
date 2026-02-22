'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Loader, Handshake, Wrench, Package, Gift, Heart, Truck, Users, Wallet, DollarSign, ArrowLeft } from 'lucide-react';
import { supabase, getPublicUrl } from '@/lib/supabase';

const initialColors = {
    primary: '#77ff00',
    card: '#1c2333',
    background: '#0a0f1c',
    foreground: '#ffffff',
};

const bmcLayout = [
    { title: "Key Partnerships", keyProp: "keyPartnerships", icon: <Handshake /> },
    { title: "Key Activities", keyProp: "keyActivities", icon: <Wrench /> },
    { title: "Key Resources", keyProp: "keyResources", icon: <Package /> },
    { title: "Value Propositions", keyProp: "valuePropositions", icon: <Gift /> },
    { title: "Customer Relationships", keyProp: "customerRelationships", icon: <Heart /> },
    { title: "Channels", keyProp: "channels", icon: <Truck /> },
    { title: "Customer Segments", keyProp: "customerSegments", icon: <Users /> },
    { title: "Cost Structure", keyProp: "costStructure", icon: <Wallet /> },
    { title: "Revenue Streams", keyProp: "revenueStreams", icon: <DollarSign /> },
];

interface CanvasData {
    id: string;
    title: string;
    business_description: string;
    canvas_data: Record<string, string>;
    colors: typeof initialColors | null;
    logo_url: string | null;
    created_at: string;
}

export default function PublicCanvasPage() {
    const params = useParams();
    const canvasId = params.id as string;
    const [canvas, setCanvas] = useState<CanvasData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCanvas = async () => {
            try {
                const { data, error } = await supabase
                    .from('canvases')
                    .select('id, title, business_description, canvas_data, colors, logo_url, created_at')
                    .eq('id', canvasId)
                    .eq('is_public', true)
                    .single();

                if (error || !data) {
                    setError('Canvas not found or is not public.');
                    return;
                }

                setCanvas(data as CanvasData);
            } catch (err) {
                setError('Failed to load canvas.');
            } finally {
                setLoading(false);
            }
        };

        if (canvasId) fetchCanvas();
    }, [canvasId]);

    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-background">
                <Loader className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !canvas) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground gap-6">
                <h1 className="text-3xl font-bold">Canvas Not Found</h1>
                <p className="text-muted-foreground">{error || 'This canvas does not exist or is not publicly shared.'}</p>
                <Link href="/">
                    <Button variant="gradient">
                        <ArrowLeft className="mr-2" /> Go Home
                    </Button>
                </Link>
            </div>
        );
    }

    const colors = canvas.colors || initialColors;
    const bmcData = canvas.canvas_data || {};
    const logoUrl = canvas.logo_url ? getPublicUrl('logos', canvas.logo_url) : null;

    return (
        <div className="min-h-screen w-full bg-background text-foreground p-4 md:p-8">
            <header className="flex justify-between items-center mb-8">
                <Link href="/" className="text-zinc-100 font-bold tracking-tight text-lg hover:text-white duration-200">
                    InnoCanvas
                </Link>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                        Shared on {new Date(canvas.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <Link href="/register">
                        <Button variant="gradient" size="sm">Create Your Own</Button>
                    </Link>
                </div>
            </header>

            <main className="flex flex-col items-center gap-6">
                {/* Title */}
                <div className="text-center max-w-3xl">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{canvas.title || 'Business Model Canvas'}</h1>
                    {canvas.business_description && (
                        <p className="text-muted-foreground">{canvas.business_description}</p>
                    )}
                </div>

                {/* Canvas */}
                <div className="w-full">
                    <div className="aspect-[16/9] p-8 flex flex-col relative rounded-2xl overflow-hidden" style={{ background: colors.background }}>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <h2 className="text-3xl font-bold" style={{ color: colors.primary }}>Business Model Canvas</h2>
                            {logoUrl && (
                                <div className="relative w-40 h-20">
                                    <Image src={logoUrl} alt="Logo" layout="fill" objectFit="contain" />
                                </div>
                            )}
                        </div>

                        <div className="flex-grow grid grid-cols-10 grid-rows-6 gap-2 relative z-10">
                            <div className="col-span-2 row-span-4">
                                <ReadOnlyBmcBlock {...bmcLayout[0]} content={bmcData[bmcLayout[0].keyProp]} colors={colors} />
                            </div>
                            <div className="col-span-2 row-span-2">
                                <ReadOnlyBmcBlock {...bmcLayout[1]} content={bmcData[bmcLayout[1].keyProp]} colors={colors} />
                            </div>
                            <div className="col-span-2 row-span-2 col-start-3 row-start-3">
                                <ReadOnlyBmcBlock {...bmcLayout[2]} content={bmcData[bmcLayout[2].keyProp]} colors={colors} />
                            </div>
                            <div className="col-span-2 row-span-4">
                                <ReadOnlyBmcBlock {...bmcLayout[3]} content={bmcData[bmcLayout[3].keyProp]} colors={colors} />
                            </div>
                            <div className="col-span-2 row-span-2 col-start-7">
                                <ReadOnlyBmcBlock {...bmcLayout[4]} content={bmcData[bmcLayout[4].keyProp]} colors={colors} />
                            </div>
                            <div className="col-span-2 row-span-2 col-start-7 row-start-3">
                                <ReadOnlyBmcBlock {...bmcLayout[5]} content={bmcData[bmcLayout[5].keyProp]} colors={colors} />
                            </div>
                            <div className="col-span-2 row-span-4 col-start-9">
                                <ReadOnlyBmcBlock {...bmcLayout[6]} content={bmcData[bmcLayout[6].keyProp]} colors={colors} />
                            </div>
                            <div className="col-span-5 row-span-2 col-start-1 row-start-5">
                                <ReadOnlyBmcBlock {...bmcLayout[7]} content={bmcData[bmcLayout[7].keyProp]} colors={colors} />
                            </div>
                            <div className="col-span-5 row-span-2 col-start-6 row-start-5">
                                <ReadOnlyBmcBlock {...bmcLayout[8]} content={bmcData[bmcLayout[8].keyProp]} colors={colors} />
                            </div>
                        </div>

                        {/* Watermark */}
                        <div className="absolute bottom-4 right-4 z-40">
                            <div className="text-center opacity-20" style={{ color: colors.primary }}>
                                <div className="text-lg font-bold">InnoCanvas</div>
                                <div className="text-xs">Powered by AI</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-8 p-8 border border-border rounded-2xl bg-card max-w-lg">
                    <h3 className="text-xl font-bold mb-2">Create Your Own Canvas</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                        Generate an AI-powered Business Model Canvas for your idea in minutes.
                    </p>
                    <Link href="/register">
                        <Button variant="gradient" size="lg">Get Started Free</Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}

const ReadOnlyBmcBlock = ({ title, content, icon, colors }: {
    title: string;
    content: string;
    icon: React.ReactNode;
    colors: typeof initialColors;
}) => (
    <div className="p-2 md:p-4 rounded-xl flex flex-col h-full" style={{ backgroundColor: colors.card, border: `1px solid ${colors.primary}20` }}>
        <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm" style={{ color: colors.primary }}>
            <div className="flex-shrink-0">{icon}</div>
            <h3 className="font-bold">{title}</h3>
        </div>
        <div className="mt-2 flex-grow overflow-hidden">
            <div className="text-xs md:text-sm whitespace-pre-wrap overflow-y-auto h-full p-1" style={{ color: colors.foreground }}>
                {content || 'No data'}
            </div>
        </div>
    </div>
);
