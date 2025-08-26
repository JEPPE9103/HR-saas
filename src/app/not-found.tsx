import Link from "next/link";

export const dynamic = "force-static";

export default function NotFound(){
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold mb-2">Page not found</h1>
      <p className="text-muted-foreground mb-6">We couldn’t find that view. Try going back to your dashboard.</p>
      <Link className="inline-flex items-center rounded-md border px-3 py-2" href="/dashboard">Go to Dashboard</Link>
    </div>
  );
}


