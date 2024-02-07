'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import { updateCurrentUser, updateProfile } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";

import { auth } from "@/utils/firebase";

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
            displayName: formData.displayname
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
                if (!user.displayName) return setIsUserValid(true);
                router.push("/");
            });
        };

        checkAuth();
    }, []);

    if (isUserValid) return (
        <main className="flex min-h-dvh justify-center items-center">

            <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-80">

                <input
                    name="displayname"
                    type="text"
                    required={true}
                    onChange={handleChange}
                    placeholder="Voor- en achternaam"
                    className="my-2 p-2 w-full space-y-2 bg-slate-100 shadow-xl rounded-md text-center focus:outline-none"
                />
            
                <button
                    type="submit"
                    className="p-2 bg-blue-500 shadow-xl text-white rounded-md"
                >
                    Opslaan
                </button>

            </form>
        
            <Toaster containerStyle={{textAlign:'center'}}/>

        </main>
    );
}
