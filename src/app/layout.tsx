import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { dark } from "@clerk/themes"
import { ClerkProvider } from "@clerk/nextjs";


const font = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <title>Digital Family</title>
            </head>
            <body
                className={cn(
                    "min-h-screen bg-background text-foreground antialiased max-w-full overflow-x-hidden",
                    font.className
                )}
            >
                <ClerkProvider appearance={{baseTheme: dark}}>
                    {children}
                </ClerkProvider>
            </body>
        </html>
    );
};
