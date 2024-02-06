'use client';

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation"
import { auth, signIn } from "@/utils/firebase";
import toast, { Toaster } from "react-hot-toast";
import { FiHome } from "react-icons/fi";

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

  const handleSubmit = (e: FormEvent) => {
    
    e.preventDefault();

    console.log('formData', formData)

    signIn(auth, formData.email, formData.password).then(() => {
      router.push("/");
      toast.success('Succesvol ingelogd');
    }).catch((error) => {
      toast.error(error.message);
    });

  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white">
      <FiHome onClick={() => router.push('/')} className="m-3 absolute top-0 left-0 w-14 h-auto text-blue-500 cursor-pointer"/>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-80">

        <input
          name="email"
          type="email"
          onChange={handleChange}
          placeholder="Email"
          className="my-2 p-2 w-full space-y-2 bg-slate-100 shadow-xl rounded-md text-center focus:outline-none"
        />
      
        <input
          name="password"
          type="password"
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

      </form>
      
      <Toaster containerStyle={{textAlign:'center'}}/>

    </main>
  );
}
