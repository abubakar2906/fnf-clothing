'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setIsLoading(false);
        } else {
            router.push('/admin/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-off-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white p-8 shadow-sm border border-light-grey">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-serif font-bold text-ink-black">FNF CLOTHING</h1>
                    <p className="text-[10px] font-mono text-mid-grey uppercase tracking-widest mt-1">Admin Portal</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-alert-red font-sans text-xs p-3 border border-red-100">
                            {error}
                        </div>
                    )}
                    <div className="space-y-1">
                        <label className="text-xs font-sans uppercase tracking-widest text-ink-black">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border-b border-light-grey focus:border-ink-black py-2 outline-none font-sans text-sm transition-colors"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-sans uppercase tracking-widest text-ink-black">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-b border-light-grey focus:border-ink-black py-2 outline-none font-sans text-sm transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-ink-black text-white py-4 text-xs font-sans uppercase tracking-widest hover:bg-charcoal transition-colors mt-4 disabled:opacity-50"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
