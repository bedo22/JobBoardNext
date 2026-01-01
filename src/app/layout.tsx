
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "../index.css";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

import { AuthProvider } from "@/components/providers/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        template: '%s | JobBoard',
        default: 'JobBoard | Find Your Next Remote Role',
    },
    description: 'The best place to find freelance and full-time remote developer jobs.',
    openGraph: {
        title: 'JobBoard | Remote Developer Jobs',
        description: 'Find high-paying remote developer jobs at top startups.',
        url: 'https://jobboard-9ar.pages.dev', // Replace with actual URL in production
        siteName: 'JobBoard',
        locale: 'en_US',
        type: 'website',
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn(inter.className, "min-h-screen bg-background")}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AuthProvider>
                        <div className="relative flex min-h-screen flex-col">
                            <Navbar />
                            <main className="flex-1">{children}</main>
                            <Footer />
                        </div>
                        <Toaster position="top-center" richColors />
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
