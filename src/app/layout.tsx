import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Haxon Workspace — Your team's second brain",
  description:
    "Docs, boards, grids, and an AI that actually understands your work — unified into one blazing-fast workspace.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-gray-950 text-gray-100">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
        >
          {children}
          <Toaster richColors theme="dark" position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
