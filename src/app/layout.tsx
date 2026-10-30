import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Semana da Violência Política",
  description:
    "Registro colaborativo de mortes, agressões, intimidações e destruições motivadas por violência política.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header className="border-b border-border bg-surface">
          <div className="mx-auto max-w-5xl px-4 py-4 flex flex-wrap items-center justify-between gap-3">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-bold tracking-tight">
                Semana da Violência Política
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/#listas" className="hover:underline">
                Notícias
              </Link>
              <Link
                href="/enviar"
                className="rounded-md bg-accent px-3 py-1.5 font-medium text-white hover:bg-accent-hover"
              >
                Enviar notícia
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border bg-surface text-sm text-muted">
          <div className="mx-auto max-w-5xl px-4 py-6 flex flex-col gap-2">
            <p>
              Site colaborativo. Qualquer pessoa pode enviar uma notícia ou
              sugerir a edição de uma notícia já publicada. Todo conteúdo
              passa por revisão antes de ser publicado.
            </p>
            <p>
              <Link href="/admin/login" className="hover:underline">
                Acesso da administração
              </Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
