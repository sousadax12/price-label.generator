'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';

export default function Home() {
  const { user } = useAuthContext() as { user: any };
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push('/signin');
    } else if (user) {
      router.push('/labels');
    }
  }, [user, router]);

  if (user === null) {
    return <div>Redirecting...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Price Label Generator!</h1>
      <p className="text-lg">You are successfully logged in.</p>
    </main>
  )
}
