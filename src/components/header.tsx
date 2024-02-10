'use client';

import { useRouter } from 'next/navigation'

const Header = () => {
    const router = useRouter();
    return (
        <div className="flex h-16 m-2 items-center justify-center">
            <img
            onClick={() => router.push('/')}
            src="/images/VDH-trans.png"
            className="h-full cursor-pointer rounded-full drop-shadow-xl"
            />
        </div>
    );
}

export { Header };