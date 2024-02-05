'use client';

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation"
import { auth, signIn } from "@/utils/firebase";

export default function Home() {

  const router = useRouter();

  const [error, setError] = useState('');
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

    signIn(auth, formData.email, formData.password).then((userCredential) => {
      router.push("/sales");
    }).catch((error) => {
      setError(error.message);
    });

  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white">

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-80">

        <input
          name="email"
          type="email"
          onChange={handleChange}
          placeholder="Email"
          className="my-2 p-2 w-full space-y-2 bg-slate-100 shadow-xl rounded-md text-center focus:outline-none"
        />
      
        <input
          name="wachtwoord"
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
        <p className="text-center text-red-700">{error}</p>
      </form>
      
    </main>
  );
}
