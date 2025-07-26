import Logo from "@/components/logo";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4">
            <div className="mb-8">
                <Logo />
            </div>
            {children}
        </div>
    )
}
