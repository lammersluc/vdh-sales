'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/utils/firebase";
import toast, { Toaster } from "react-hot-toast";
import { FiHome } from "react-icons/fi";

export default function Page() {

    const [isUserValid, setIsUserValid] = useState(false);

    const router = useRouter();

    const pages = [
        { name: 'Verzenden', href: '/sales' },
        { name: 'Bekijken', href: '/sales/view' },
        auth.currentUser?.uid === 'VDqFJNHGQueHOFjOXYoFpv4jPXG3' ? { name: 'Downloaden', href: '/sales/download' } : undefined
    ];

    useEffect(() => {
        const checkAuth = () => {
            auth.onAuthStateChanged((user: any) => {
                if (user) {
                setIsUserValid(true);
                } else {
                router.push("/account/login");
                }
            });
        };

        checkAuth();
    }, []);

    if (isUserValid) return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <FiHome onClick={() => router.push('/')} className="m-3 absolute top-0 left-0 w-14 h-auto text-blue-500 cursor-pointer"/>

            <div className="flex flex-col space-y-4 w-80">

                {
                    pages.map((page) => (
                        page &&
                        <button
                            onClick={() => router.push(page.href)}
                            className="p-2 bg-blue-500 shadow-xl text-white rounded-md"
                        >
                            {page.name}
                        </button>                    ))
                }

            </div>
            
            <Toaster containerStyle={{textAlign:'center'}}/>

        </main>
    );

}