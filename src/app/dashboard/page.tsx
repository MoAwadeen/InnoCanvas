'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    PlusCircle,
    FileText,
    TrendingUp,
    Calendar,
    Settings,
    Zap,
    ArrowRight,
    Download,
    Layout,
    User,
    LogOut,
    Loader,
    Sparkles,
    Search,
    ChevronRight,
    Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/logo';
import { Greeting } from '@/components/greeting';
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface Canvas {
    id: string;
    title: string;
    preview: string;
    created_at: string;
    business_description: string;
}

export default function UserDashboard() {
    const { user, userData, loading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [recentCanvases, setRecentCanvases] = useState<Canvas[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCanvases: 0,
        totalExports: 0,
        activePlan: 'free'
    });

    const fetchDashboardData = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            // Fetch canvases
            const { data: canvases, error: canvasError } = await supabase
                .from('canvases')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (canvasError) {
                console.error("Supabase Canvas Error:", canvasError);
                throw canvasError;
            }

            const formattedCanvases = (canvases || []).slice(0, 3).map((canvas: any) => {
                const canvasData = canvas.canvas_data || {};
                return {
                    id: canvas.id,
                    title: canvas.business_description || 'Untitled Canvas',
                    preview: [canvasData.valuePropositions, canvasData.customerSegments].filter(Boolean).join(' · '),
                    created_at: new Date(canvas.created_at).toLocaleDateString(),
                    business_description: canvas.business_description
                };
            });

            setRecentCanvases(formattedCanvases);
            setStats({
                totalCanvases: canvases?.length || 0,
                totalExports: userData?.statistics?.total_exports || 0,
                activePlan: userData?.plan || 'free'
            });

        } catch (error: any) {
            console.error("Error fetching dashboard data:", error);
            toast({
                title: 'Error',
                description: `Failed to load dashboard data: ${error.message || 'Unknown error'}`,
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    }, [user, userData, toast]);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push('/login');
            return;
        }
        fetchDashboardData();
    }, [user, authLoading, router, fetchDashboardData]);

    const handleLogout = async () => {
        try {
            if (process.env.NODE_ENV === 'development') {
                // In dev mode with our bypass, we might need a full reload or redirect
                // Since we hacked useAuth, let's just push to login
                router.push('/login');
                return;
            }
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            router.push('/login');
        } catch (error: any) {
            toast({ title: 'Logout failed', variant: 'destructive' });
        }
    };

    if (authLoading || (isLoading && !recentCanvases.length)) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-background">
                <Loader className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-background to-background">
            {/* Navigation */}
            <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl">
                <div className="container flex h-16 items-center justify-between">
                    <Logo href="/dashboard" />
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary text-primary">Overview</Link>
                        <Link href="/my-canvases" className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground">My Canvases</Link>
                        <Link href="/generate" className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground">AI Builder</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link href="/profile">
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <User className="h-5 w-5" />
                            </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="rounded-full" onClick={handleLogout}>
                            <LogOut className="h-5 w-5" />
                        </Button>
                        <Link href="/generate">
                            <Button className="btn-gradient hidden sm:flex">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                New Canvas
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container py-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                >
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <motion.div variants={itemVariants} className="space-y-2">
                            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                                Dashboard
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                Manage your strategic canvas and AI generations.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex items-center gap-4">
                            <Greeting />
                        </motion.div>
                    </div>

                    {/* Stats Grid */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: 'Total Canvases', value: stats.totalCanvases, icon: Layout, color: 'from-blue-500 to-cyan-500' },
                            { label: 'Total Exports', value: stats.totalExports, icon: Download, color: 'from-purple-500 to-pink-500' },
                            { label: 'Active Plan', value: stats.activePlan.toUpperCase(), icon: Zap, color: 'from-amber-500 to-orange-500' },
                        ].map((stat, i) => (
                            <Card key={i} className="card-glass border-white/5 overflow-hidden group">
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-20`} />
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                            <h3 className="text-3xl font-bold mt-1 tracking-tight">{stat.value}</h3>
                                        </div>
                                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                                            <stat.icon className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Quick Actions & AI Insight */}
                        <div className="lg:col-span-2 space-y-8">
                            <motion.div variants={itemVariants}>
                                <Card className="card-glass border border-white/10 bg-gradient-to-br from-primary/10 to-transparent overflow-hidden">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                <Sparkles className="h-5 w-5 text-amber-400" />
                                                AI Strategic Insight
                                            </CardTitle>
                                            <Badge variant="outline" className="animate-pulse bg-amber-500/10 text-amber-500 border-amber-500/20">Beta</Badge>
                                        </div>
                                        <CardDescription>AI-generated tips for your current business models</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                            <p className="text-sm italic text-white/80">
                                                "Based on your latest 'Tourism App' canvas, consider focusing on the 'Cost Structure' by leveraging shared server infrastructure to reduce burn rate in the initial 6 months."
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Button variant="outline" className="justify-between group">
                                                Optimize Cost Structure <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </Button>
                                            <Button variant="outline" className="justify-between group">
                                                Identify New Segments <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Recent Activity / Canvases */}
                            <motion.div variants={itemVariants} className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold">Recent Canvases</h2>
                                    <Link href="/my-canvases">
                                        <Button variant="ghost" className="text-muted-foreground hover:text-white">
                                            View All <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>

                                <div className="grid gap-4">
                                    {recentCanvases.length > 0 ? (
                                        recentCanvases.map((canvas, i) => (
                                            <Card key={i} className="card-glass border border-white/5 hover:border-white/10 transition-all group">
                                                <CardContent className="p-4 sm:p-6">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                        <div className="flex items-start gap-4">
                                                            <div className="mt-1 p-2 rounded-lg bg-primary/10 text-primary">
                                                                <FileText className="h-6 w-6" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{canvas.title}</h4>
                                                                <p className="text-sm text-muted-foreground line-clamp-1">{canvas.preview}</p>
                                                                <div className="flex items-center gap-3 mt-2">
                                                                    <span className="flex items-center text-xs text-muted-foreground">
                                                                        <Clock className="mr-1 h-3 w-3" /> {canvas.created_at}
                                                                    </span>
                                                                    <Badge variant="secondary" className="text-[10px] h-4 bg-white/5">Canvas</Badge>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Link href={`/generate?canvasId=${canvas.id}`}>
                                                                <Button variant="secondary" size="sm" className="w-full sm:w-auto">Open</Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl bg-white/2">
                                            <Layout className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                                            <h3 className="text-xl font-medium">No canvases yet</h3>
                                            <p className="text-muted-foreground mt-2 mb-6">Start your first business model journey with AI.</p>
                                            <Link href="/generate">
                                                <Button className="btn-gradient">Create Now</Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* Sidebar / Profile Summary */}
                        <div className="space-y-8">
                            <motion.div variants={itemVariants}>
                                <Card className="card-glass border-white/5">
                                    <CardHeader className="text-center pb-2">
                                        <div className="mx-auto h-20 w-20 rounded-full border-2 border-primary/20 p-1 mb-4">
                                            <div className="h-full w-full rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-2xl font-bold">
                                                {userData?.full_name?.charAt(0) || 'D'}
                                            </div>
                                        </div>
                                        <CardTitle>{userData?.full_name || 'Innovator'}</CardTitle>
                                        <CardDescription>{userData?.job_title || 'Founder'}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 pt-4 border-t border-white/5">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Location</span>
                                            <span className="font-medium">{userData?.country || 'Global'}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Industry</span>
                                            <span className="font-medium">{userData?.industry || 'Unset'}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Experience</span>
                                            <Badge variant="secondary" className="bg-primary/10 text-primary capitalize">{userData?.experience_level || 'Builder'}</Badge>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Link href="/profile" className="w-full">
                                            <Button variant="outline" className="w-full">Edit Profile</Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <Card className="card-glass border border-white/5 bg-gradient-to-tr from-cyan-500/5 to-transparent">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Platform Tips</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex gap-3">
                                            <div className="mt-1 flex-shrink-0 h-6 w-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-bold">1</div>
                                            <p className="text-sm text-muted-foreground">Try the <span className="text-foreground font-medium">Refinement Step</span> to get much more accurate AI canvases.</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="mt-1 flex-shrink-0 h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold">2</div>
                                            <p className="text-sm text-muted-foreground">You can <span className="text-foreground font-medium">Export to PDF</span> with your own logo in the Pro plan.</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
