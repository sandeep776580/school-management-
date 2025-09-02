
import Link from 'next/link';

export default function Home() {
  return (
    <main className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Schools Mini Project</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/addSchool" className="card hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">Add a School</h2>
          <p>Use the form to add school details and upload an image.</p>
        </Link>
        <Link href="/showSchools" className="card hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">Show Schools</h2>
          <p>Browse all saved schools in a product-style grid.</p>
        </Link>
      </div>
    </main>
  );
}
