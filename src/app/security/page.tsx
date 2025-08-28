export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Security</h1>
      <div className="prose prose-slate max-w-none">
        <p className="mb-4">
          We take security seriously. Our platform is built with enterprise-grade security measures.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-4">Data Protection</h2>
        <p className="mb-4">
          All data is encrypted in transit and at rest using industry-standard encryption.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-4">Compliance</h2>
        <p className="mb-4">
          We comply with GDPR, ISO 27001, and other relevant security standards.
        </p>
      </div>
    </div>
  );
}


