'use client';

import { useRouter, usePathname } from 'next/navigation'
import toast from 'react-hot-toast';

const Header = () => {

    const router = useRouter();
    const pathname = usePathname();

    let clickCount = 0;
    let lastClick = 0;
    
    const handleClick = () => {

        const currentTime = Date.now();

        if (pathname !== '/') return router.push('/');
    
        if (currentTime - lastClick > 1000) clickCount = 0;
    
        lastClick = currentTime;
        clickCount++;
    
        if (clickCount === 5) {

            if (localStorage.getItem('admin') === 'true' ) {

                localStorage.removeItem('admin');
                toast.error('Admin');

            } else {

                localStorage.setItem('admin', 'true');
                toast.success('Admin');

            }
            
        }
    
    }
    

    return (
        <div className="flex h-16 m-2 items-center justify-center">

            <img
                onClick={handleClick}
                src="/images/VDH-trans.png"
                className="h-full cursor-pointer rounded-full drop-shadow-xl"
            />

        </div>
    );
}

export { Header };