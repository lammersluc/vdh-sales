'use client';

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation"
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";

import { auth } from "@/utils/firebase";
import { FaGoogle } from "react-icons/fa6";

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

      try {

        if (e.currentTarget.id === 'google') {

          await signInWithPopup(auth, new GoogleAuthProvider());

        } else {

          await signInWithEmailAndPassword(auth, formData.email, formData.password);

        }

      } catch (error: any) { return toast.error(error.message) }

      toast.success('Succesvol ingelogd');

      if (!auth.currentUser?.displayName) return router.push('/account/username');

      router.push('/');

    }

    return (

    <main className="flex min-h-dvh justify-center items-center">

        <form id="email" onSubmit={handleSubmit} className="flex flex-col space-y-4 w-80">

            <input
                name="email"
                type="email"
                required={true}
                onChange={handleChange}
                placeholder="Email"
                className="my-2 p-2 w-full space-y-2 bg-slate-100 shadow-xl rounded-md text-center focus:outline-none"
            />
        
            <input
                name="password"
                type="password"
                required={true}
                onChange={handleChange}
                placeholder="Wachtwoord"
                className="my-2 p-2 w-full space-y-2 bg-slate-100 shadow-xl rounded-md text-center focus:outline-none"
            />
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
      
        <Toaster containerStyle={{textAlign:'center'}}/>

    </main>

  );
}
