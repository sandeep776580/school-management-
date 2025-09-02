
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function ShowSchools() {
  const { data, error, isLoading, mutate } = useSWR('/api/schools', fetcher);

  return (
    <main className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Schools</h1>
        <button className="btn" onClick={() => mutate()}>Refresh</button>
      </div>
      {error && <p className="text-red-600">Failed to load: {error.message}</p>}
      {isLoading && <p>Loading...</p>}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {data?.schools?.map((s) => (
          <article key={s.id} className="card hover:shadow-lg transition">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
              {s.image ? (
                <img
                  src={`/schoolImages/${s.image}`}
                  alt={s.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
              )}
            </div>
            <h2 className="text-lg font-semibold mb-1">{s.name}</h2>
            <p className="text-sm text-gray-600">{s.address}</p>
            <p className="text-sm text-gray-600">{s.city}</p>
          </article>
        ))}
      </div>
      {!data?.schools?.length && !isLoading && (
        <p className="mt-8 text-gray-600">No schools found. Add one from the Add School page.</p>
      )}
    </main>
  );
}
