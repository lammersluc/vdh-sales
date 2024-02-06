'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, sales } from "@/utils/firebase";
import toast, { Toaster } from "react-hot-toast";
import { addDoc } from "firebase/firestore";
import { FiHome } from "react-icons/fi";

export default function Page() {

    enum Reden {
        divers = 'divers',
        netwerk = 'netwerk',
        offerte = 'offerte',
        order = 'order',
        service = 'service'
    }

    enum InUitWeb {
        in = 'in',
        uit = 'uit',
        web = 'web'
    }

    const router = useRouter();

    const [status, setStatus] = useState('Verstuur');
    const [isUserValid, setIsUserValid] = useState(false);
    const [formData, setFormData] = useState({
      bedrijfsnaam: '',
      nieuw: false,
      locatie: '',
      reden: Reden.divers,
      subreden: '',
      offerte: false,
      inuitweb: InUitWeb.in
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value === 'on' ? true : value === 'off' ? false : value })
    }

    const handleSumbit = async (e: any) => {

      e.preventDefault();

      if (
        !formData.bedrijfsnaam ||
        !formData.locatie
    ) return toast.error('Vul alle velden in');

      setStatus('Versturen...');

      try {

        addDoc(sales, {
          gebruiker: auth.currentUser?.email || 'Onbekend',
          datum: Date.now(),
          ...formData
        });

    } catch (error: any) {
        return toast.error(error.message);
    }

      const form = document.getElementById('form') as HTMLFormElement;
      form.reset();
      setStatus('Verstuurd');
      toast.success('Verstuurd');

    }

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
        <main className="flex  min-h-screen justify-center items-center">
            <FiHome onClick={() => router.push('/')} className="m-3 absolute top-0 left-0 w-14 h-auto text-blue-500 cursor-pointer"/>

            <form onSubmit={handleSumbit} id="form" className="flex flex-col space-y-4 w-80">

                <div className="my-2 w-full space-y-2 shadow-xl rounded-md text-center">
                    <input
                        name="bedrijfsnaam"
                        type="text"
                        required={true}
                        onChange={handleChange}
                        placeholder="Bedrijfsnaam"
                        className="w-full h-full text-black p-2 bg-slate-100 focus:outline-none rounded-md text-center"
                    />
                </div>

                <div className="my-2 w-full space-y-2 shadow-xl rounded-md text-center">
                    <input
                        name="locatie"
                        type="text"
                        required={true}
                        onChange={handleChange}
                        placeholder="Locatie"
                        className="w-full h-full p-2 text-black bg-slate-100 focus:outline-none rounded-md text-center"
                    />
                </div>

                <div className="my-2 p-2 w-full space-y-2 text-center">
                    <label className="text-center" htmlFor="reden">Nieuw</label>
                    <div className="flex flex-col text-center items-center text-black space-y-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="nieuw" onChange={handleChange} className="sr-only peer"/>
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                    </div>
                </div>

                <div className="my-2 p-2 flex flex-col w-full space-y-2 text-center">
                    <label className="text-center" htmlFor="reden">Reden</label>
                    <div className="shadow-xl rounded-full">
                    <select
                        name="reden"
                        defaultValue={Reden.divers}
                        onChange={handleChange}
                        className="p-2 w-full focus:outline-none bg-slate-100 text-black"
                    >
                        <option value={Reden.divers}>Divers</option>
                        <option value={Reden.netwerk}>Netwerk</option>
                        <option value={Reden.offerte}>Offerte</option>
                        <option value={Reden.order}>Order</option>
                        <option value={Reden.service}>Service</option>
                    </select>
                    </div>
                </div>

                <div className="my-2 w-full space-y-2 shadow-xl rounded-md text-center">
                    <input
                        name="subreden"
                        type="text"
                        onChange={handleChange}
                        placeholder="Subreden"
                        className="w-full h-full text-black p-2 bg-slate-100 focus:outline-none rounded-md text-center"
                    />
                </div>

                <div className="my-2 p-2 w-full space-y-2 text-center">
                    <label className="text-center" htmlFor="reden">Offerte</label>
                    <div className="flex flex-col text-center items-center text-black space-y-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="offerte" onChange={handleChange} className="sr-only peer"/>
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                    </div>
                </div>

                <div className="my-2 p-2 flex flex-col w-full space-y-2 text-center">
                    <label className="text-center" htmlFor="inuitweb">In / Uit / Web</label>
                    <div className="shadow-xl rounded-full">
                    <select
                        name="intuitweb"
                        defaultValue={InUitWeb.in}
                        onChange={handleChange}
                        className="p-2 rounded-md w-full focus:outline-none text-black"
                    >
                        <option value={InUitWeb.in}>In</option>
                        <option value={InUitWeb.uit}>Uit</option>
                        <option value={InUitWeb.web}>Web</option>
                    </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className="p-2 bg-blue-500 text-white rounded-md shadow-xl"
                >
                    {status}
                </button>

            </form>
            
            <Toaster containerStyle={{textAlign:'center'}}/>

        </main>
    );

}