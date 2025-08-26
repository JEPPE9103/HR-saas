import Link from "next/link";

export default function NotFound(){
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-slate-500">The page you are looking for does not exist.</p>
      <div className="mt-4">
        <Link href="/dashboard" className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">Back to dashboard</Link>
      </div>
    </div>
  );
}


