import Link from "next/link";
import { cn } from "@/lib/utils";

export const Logo = ({ className, href = "/my-canvases" }: { className?: string, href?: string }) => {
    return (
        <Link href={href} className={cn("flex items-center gap-2 group", className)}>
            <div className="w-8 h-8 flex-shrink-0">
                <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' className="w-full h-full">
                     <defs>
                        <style>{`
                            .block{fill:hsl(var(--foreground));ry:8px;transition:all 0.2s ease-in-out;}
                            .text{fill:hsl(var(--vivid-pink));font-family:Inter,sans-serif;font-weight:bold;font-size:24px;}
                            .group:hover .block{fill:hsl(var(--primary));}
                        `}</style>
                    </defs>
                    <rect x='0' y='0' width='48' height='48' className='block'/>
                    <rect x='52' y='0' width='48' height='48' className='block'/>
                    <rect x='0' y='52' width='48' height='48' className='block'/>
                    <rect x='52' y='52' width='48' height='48' className='block'/>
                    <text x='5' y='32' className='text'>Inno</text>
                    <text x='54' y='84' className='text'>Canvas</text>
                </svg>
            </div>
            <span className="font-bold text-2xl">InnoCanvas</span>
        </Link>
    )
}
