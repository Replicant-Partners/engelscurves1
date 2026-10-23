'use client';
import { useEffect } from 'react';
import Link from 'next/link';

// The explorer now lives inside the story as chapter 3 ("In motion").
// This route survives only to keep old links working.
export default function ExplorerRedirect() {
  useEffect(() => {
    window.location.replace('/story' + window.location.search + '#motion');
  }, []);
  return (
    <main className="min-h-screen flex items-center justify-center text-sm text-[#57606a]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <p>The explorer moved into the story. <Link href="/story#motion" className="underline underline-offset-2">Continue to chapter 3 &rarr;</Link></p>
    </main>
  );
}
