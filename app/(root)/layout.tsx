import { Backdrop } from "@/components/layout/backdrop";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { isAdmin } from "@/modules/auth/server";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
	const admin = await isAdmin();

	return (
		<div className="relative flex min-h-dvh flex-col">
			<Backdrop />
			<SiteHeader isAdmin={admin} />
			<main className="flex-1">{children}</main>
			<SiteFooter />
		</div>
	);
}
