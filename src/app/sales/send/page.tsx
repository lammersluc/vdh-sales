'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { addDoc } from "firebase/firestore";

import { auth, sales } from "@/utils";

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

        if (value !== InUitWeb.uit || e.target.form.locatie.value) return;

        navigator.geolocation.getCurrentPosition(async (p) => {
            const address = (await (await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${p.coords.latitude}&lon=${p.coords.longitude}&zoom=18&addressdetails=1`)).json()).address;
            const loc = address.city || address.town || address.village || '';
            e.target.form.locatie.value = loc;
            setFormData({ ...formData, locatie: loc });
        });

    }

    const handleSumbit = async (e: any) => {

        e.preventDefault();

        const promise = new Promise<string>(async (resolve, reject) => {

            try {

                addDoc(sales, {
                    ...formData,
                    bedrijfsnaam: formData.bedrijfsnaam.trim(),
                    locatie: formData.locatie.trim(),
                    subreden: formData.subreden.trim(),
                    gebruiker: auth.currentUser?.email || 'onbekend',
                    datum: Date.now()
                });

            } catch (error: any) { return reject('Er ging iets mis...'); }

            e.target.reset();
            resolve('Verzonden');

        });

        toast.promise(promise, {
            loading: 'Versturen...',
            success: msg => msg,
            error: err => err
        });

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
            
        <div className="flex flex-col h-full p-4 justify-center m-auto">

            <form onSubmit={handleSumbit} className="flex flex-col space-y-4 w-80">

                <div className="my-2 flex flex-col space-y-2">
                    <label className="text-center" htmlFor="inuitweb">In / Uit / Web</label>
                    <div className="relative flex flex-col">
                        <select
                            name="inuitweb"
                            onChange={handleChange}
                            className="p-2 shadow-xl rounded-md focus:outline-none bg-slate-100 appearance-none"
                        >
                            {
                                Object.values(InUitWeb).map((value) => (
                                    <option
                                        key={value}
                                        value={value}
                                    >
                                        {value.charAt(0).toUpperCase() + value.slice(1)}
                                    </option>
                                ))
                            }
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>

                <input
                    name="bedrijfsnaam"
                    type="text"
                    required={true}
                    onChange={handleChange}
                    placeholder="Bedrijfsnaam"
                    className="text-black p-2 my-2 bg-slate-100 focus:outline-none shadow-xl rounded-md text-center"
                />

                <input
                    name="locatie"
                    type="text"
                    required={true}
                    onChange={handleChange}
                    placeholder="Locatie"
                    className="p-2 my-2 text-black bg-slate-100 focus:outline-none shadow-xl rounded-md text-center"
                />

                <div className="my-2 flex flex-col space-y-2">
                    <label className="text-center" htmlFor="reden">Nieuw</label>
                    <div className="flex flex-col text-center items-center text-black space-y-4">
                    <label className="relative inline-flex shadow-xl rounded-xl items-center cursor-pointer">
                            <input type="checkbox" name="nieuw" onChange={handleChange} className="sr-only peer"/>
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                    </div>
                </div>

                <div className="my-2 flex flex-col space-y-2 text-center">
                    <label className="text-center" htmlFor="reden">Reden</label>
                    <div className="relative flex flex-col">
                        <select
                            name="reden"
                            onChange={handleChange}
                            className="p-2 shadow-xl rounded-md focus:outline-none bg-slate-100 appearance-none"
                        >
                            {
                                Object.values(Reden).map((value) => (
                                    <option
                                        key={value}
                                        value={value}
                                    >
                                        {value.charAt(0).toUpperCase() + value.slice(1)}
                                    </option>
                                ))
                            }
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>
                
                <input
                    name="subreden"
                    type="text"
                    onChange={handleChange}
                    placeholder="Subreden"
                    className="text-black p-2 my-2 bg-slate-100 focus:outline-none shadow-xl rounded-md text-center"
                />

                <div className="my-2 flex flex-col space-y-2 text-center">
                    <label className="text-center" htmlFor="reden">Offerte</label>
                    <div className="flex flex-col text-center items-center text-black space-y-4">
                        <label className="relative inline-flex shadow-xl rounded-xl items-center cursor-pointer">
                            <input type="checkbox" name="offerte" onChange={handleChange} className="sr-only peer"/>
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    className="p-2 bg-blue-500 text-white rounded-md shadow-xl"
                >
                    Verstuur
                </button>

            </form>

        </div>

    );

}