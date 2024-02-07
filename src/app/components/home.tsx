'use client';

import { useRouter } from 'next/navigation'
import { FaHouseChimney } from 'react-icons/fa6'

const Home = () => {
    const router = useRouter();
    return (
        <FaHouseChimney onClick={() => router.push('/')} className="m-6 absolute top-0 left-0 w-14 h-auto text-blue-500 cursor-pointer"/>
    );
}

export default Home;