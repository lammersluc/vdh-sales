'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/utils/firebase";

import { admins } from "@/utils";
import { Header, Footer } from "@/components";

export default function Page() {

    const [isUserValid, setIsUserValid] = useState(false);

    const router = useRouter();

    const pages = [
        { name: 'Verzenden', href: '/sales/send' },
        { name: 'Bekijken', href: '/sales/view' },
        admins.find(a => a === auth.currentUser?.uid) ? { name: 'Downloaden', href: '/sales/download' } : undefined,
        { name: 'Uitloggen', href: '/account/logout', className: 'mt-8 bg-red-500'}
    ];

    useEffect(() => {
        const checkAuth = () => {
            auth.onAuthStateChanged((user: any) => {
                if (!user) return router.push("/account/login");
                if (!user.displayName) return router.push("/account/username");
                setIsUserValid(true);
            });
        };

        checkAuth();
    }, []);

    if (isUserValid) return (
        <main className="flex flex-col h-dvh">

            <Header />

            <div className="flex flex-col h-full items-center justify-center">

                <div className="flex flex-col w-80 items-center justify-center">

                    {
                        pages.map((page, index) => (
                            page &&
                            <button
                                key={index}
                                onClick={() => router.push(page.href)}
                                className={"p-2 my-2 w-full bg-blue-500 shadow-xl text-white rounded-md " + page.className}
                            >
                                {page.name}
                            </button>
                        ))
                    }

                </div>

            </div>
            
            <Footer />

        </main>
    );

}