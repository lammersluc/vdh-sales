'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import { updateProfile } from "firebase/auth";
import toast from "react-hot-toast";

import { auth } from "@/utils/firebase";
import { Header, Footer } from "@/components";

export default function Page() {


    const router = useRouter();

    const [isUserValid, setIsUserValid] = useState(false);
    const [formData, setFormData] = useState({
        displayname: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e: FormEvent) => {
        
        e.preventDefault();

        if (!auth.currentUser) { 

            toast.error('Geen gebruiker gevonden');
            return router.push('/account/login');

        }

        await updateProfile(auth.currentUser, {
            displayName: formData.displayname.trim()
        }).catch((error) => {
            toast.error(error.message);
        });

        toast.success('Succesvol opgeslagen');
        router.push('/');

    }

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
        <main className="flex flex-col h-dvh">

            <Header />

            <div className="flex flex-col h-full items-center justify-center">
                
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-80">

                    <input
                        name="displayname"
                        type="text"
                        required={true}
                        onChange={handleChange}
                        placeholder="Voor- en achternaam"
                        className="my-2 p-2 space-y-2 bg-slate-100 shadow-xl rounded-md text-center focus:outline-none"
                    />
                
                    <button
                        type="submit"
                        className="p-2 bg-blue-500 shadow-xl text-white rounded-md"
                    >
                        Opslaan
                    </button>

                </form>

            </div>
        
            <Footer />

        </main>
    );
}
