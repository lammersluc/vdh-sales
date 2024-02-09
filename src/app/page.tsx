'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/utils/firebase";

export default function Page() {

    const pages = [
        { name: 'Verzenden', onClick: (e: any) => { e.preventDefault(); router.push('/sales/send') }},
        { name: 'Bekijken', onClick: (e: any) => { e.preventDefault(); router.push('/sales/view') } },
        typeof localStorage !== 'undefined' && localStorage.getItem('user') === 'admin' && { name: 'Downloaden', onClick: (e: any) => { e.preventDefault(); router.push('/sales/download') } },
        { name: 'Uitloggen', onClick: (e: any) => { e.preventDefault(); auth.signOut() }, className: 'mt-8 bg-red-500'}
    ];
    const [isUserValid, setIsUserValid] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            auth.onAuthStateChanged((user: any) => {
                if (!user) return router.push("/account/login");
                setIsUserValid(true);
            });
        };

        checkAuth();
    }, []);

    if (isUserValid) return (

        <div className="flex flex-col h-full p-4 justify-center m-auto">

            <div className="flex flex-col w-80 items-center justify-center">

                {
                    pages.map((page, index) => (
                        page &&
                        <button
                            key={index}
                            onClick={page.onClick}
                            className={"p-2 my-2 w-full bg-blue-500 shadow-xl text-white rounded-md " + page.className}
                        >
                            {page.name}
                        </button>
                    ))
                }

            </div>

        </div>
            
    );

}