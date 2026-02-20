import './globals.css'
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { QueryProvider } from '@/components/providers/query-provider'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/contexts/theme-context'
import { IdeaProvider } from '@/contexts/idea-context'

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-jakarta' 
})

export const metadata: Metadata = {
  title: 'evo',
  description: 'AI-powered market analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent dark mode flicker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const t = localStorage.getItem('evo-theme');
              if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              }
            `
          }}
        />
      </head>
      <body className={`${jakarta.className} antialiased`}>
        <ThemeProvider>
          <IdeaProvider>
            <QueryProvider>
              {children}
              <Toaster />
            </QueryProvider>
          </IdeaProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
