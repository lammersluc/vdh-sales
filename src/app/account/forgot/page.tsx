'use client';

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation"
import { sendPasswordResetEmail } from "firebase/auth";
import toast from "react-hot-toast";

import { auth } from "@/utils/firebase";
import { Header, Footer } from "@/components";

export default function Page() {


    const router = useRouter();

    const [formData, setFormData] = useState({
        email: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e: FormEvent) => {
        
        e.preventDefault();

        const promise = new Promise(async (resolve, reject) => {

            try {
                await sendPasswordResetEmail(auth, formData.email);
            } catch (error: any) { return reject(error.message) }

            resolve(router.push('/'));

        });

        toast.promise(promise, {
            loading: 'Email verzenden...',
            success: 'Email verzonden',
            error: (error) => error
        });

    }

    return (
        <main className="flex flex-col h-dvh">

            <Header />

            <div className="flex flex-col h-full p-4 justify-center m-auto">
                
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-80">

                    <input
                        name="email"
                        type="email"
                        required={true}
                        onChange={handleChange}
                        placeholder="Email"
                        className="my-2 p-2 space-y-2 bg-slate-100 shadow-xl rounded-md text-center focus:outline-none"
                    />
                
                    <button
                        type="submit"
                        className="p-2 bg-blue-500 shadow-xl text-white rounded-md"
                    >
                        Verstuur
                    </button>

                </form>

            </div>
        
            <Footer />

        </main>
    );
}
