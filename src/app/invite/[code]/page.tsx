import { redirect } from "next/navigation";

export default async function InviteLinkPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  // Redirect to onboard with pre-filled code
  redirect(`/onboard?code=${encodeURIComponent(code)}`);
}
