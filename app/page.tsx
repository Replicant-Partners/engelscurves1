export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f8fa] text-[#1b1f23] p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="border-b border-[#d0d7de] pb-4">
          <h1 className="text-3xl font-semibold tracking-tight">Engel Curves Research V3</h1>
          <p className="text-[#6e7681] mt-2">Data pipeline managed by local-research-swarm and verified by vcp-math-auditor.</p>
        </header>
        
        <section className="bg-white border border-[#d0d7de] rounded-md p-6">
          <p className="text-[#6e7681]">Initializing Swarm extraction...</p>
        </section>
      </div>
    </main>
  );
}
