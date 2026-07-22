import Link from "next/link";

export function Sidebar() {
    return (
        <aside className="w-64 border-r bg-muted/30 h-screen sticky top-0">

            <div className="p-6 font-bold text-lg">
                LearnFlow
            </div>

            <nav className="space-y-2 px-4">

                <Link
                    href="/library"
                    className="block rounded-lg px-3 py-2 hover:bg-accent"
                >
                    📚 Thư viện
                </Link>

                <Link
                    href="/settings"
                    className="block rounded-lg px-3 py-2 hover:bg-accent"
                >
                    ⚙️ Cài đặt
                </Link>

            </nav>

        </aside>
    );
}