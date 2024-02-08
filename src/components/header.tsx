'use client';

import { useRouter } from 'next/navigation'

const Header = () => {
    const router = useRouter();
    return (
        <div className="flex h-16 m-2 items-center justify-center">
            <img onClick={() => router.push('/')} src="/icons/VDH-trans.png" className="w-auto h-5/6 text-blue-500 cursor-pointer shadow-xl rounded-full"/>
        </div>
    );
}

export { Header };