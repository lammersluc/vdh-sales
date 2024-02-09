'use client';

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation"
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";

import { auth } from "@/utils/firebase";
import { FaGoogle } from "react-icons/fa6";
import { Header, Footer } from "@/components";

export default function Page() {

    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e: FormEvent) => {
    
        e.preventDefault();

        const promise = new Promise(async (resolve, reject) => {

            try {

                if (e.currentTarget.id === 'google') {

                await signInWithPopup(auth, new GoogleAuthProvider());

                } else {

                await signInWithEmailAndPassword(auth, formData.email, formData.password);

                }

            } catch (error: any) { return reject(error.message) }

            resolve(router.push('/'));

        });

        toast.promise(promise, {
            loading: 'Inloggen...',
            success: 'Ingelogd',
            error: (error) => error
        });

    }

    return (

        <main className="flex flex-col h-dvh">

            <Header />

            <div className="flex flex-col h-full p-4 justify-center m-auto">

                <form id="email" onSubmit={handleSubmit} className="flex flex-col space-y-4 w-80">

                <input
                    name="email"
                    type="email"
                    required={true}
                    onChange={handleChange}
                    placeholder="Email"
                    className="my-2 p-2 space-y-2 bg-slate-100 shadow-xl rounded-md text-center focus:outline-none"
                />

                <input
                    name="password"
                    type="password"
                    required={true}
                    onChange={handleChange}
                    placeholder="Wachtwoord"
                    className="my-2 p-2 space-y-2 bg-slate-100 shadow-xl rounded-md text-center focus:outline-none"
                />

                <p
                    onClick={() => router.push('/account/forgot')}
                    className="text-blue-500 text-center hover:cursor-pointer">
                    Wachtwoord vergeten?
                    </p>

                <button
                    type="submit"
                    className="p-2 bg-blue-500 shadow-xl text-white rounded-md"
                >
                    Login
                </button>

                <div
                    id="google"
                    onClick={handleSubmit}
                    className="p-2 bg-blue-500 shadow-xl text-white rounded-md hover:cursor-pointer"
                >
                    <FaGoogle className="h-6 mx-auto text-white" />
                </div>

                </form>

            </div>
            
            <Footer />
        
        </main>

    );
}
