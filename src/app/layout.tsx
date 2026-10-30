import type { Metadata } from "next";
import { Geist, Geist_Mono, Libre_Baskerville } from "next/font/google";
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

const editorialSerif = Libre_Baskerville({
  variable: "--font-editorial-serif",
  weight: ["400", "700"],
  style: ["normal", "italic"],
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
      className={`${geistSans.variable} ${geistMono.variable} ${editorialSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <div className="h-1 bg-accent" />
        <header className="sticky top-0 z-10 border-b border-border bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="font-serif text-xl font-bold tracking-tight sm:text-2xl">
                Semana da Violência Política
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/#listas" className="font-medium hover:text-accent">
                Notícias
              </Link>
              <Link
                href="/enviar"
                className="rounded-full bg-accent px-4 py-2 font-medium text-white transition-colors hover:bg-accent-hover"
              >
                Enviar notícia
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border bg-surface text-sm text-muted">
          <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8">
            <p>
              Site colaborativo. Qualquer pessoa pode enviar uma notícia ou
              sugerir a edição de uma notícia já publicada. Todo conteúdo
              passa por revisão antes de ser publicado.
            </p>
            <p>
              <Link href="/admin/login" className="hover:text-accent hover:underline">
                Acesso da administração
              </Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
