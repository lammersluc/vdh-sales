'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, sales } from "@/utils/firebase";
import toast, { Toaster } from "react-hot-toast";
import { getDocs, query, where } from "firebase/firestore";
import { FiHome } from "react-icons/fi";

export default function Page() {

    const router = useRouter();

    const [docs, setDocs] = useState([] as any[])
    const [status, setStatus] = useState('Bekijk');
    const [isUserValid, setIsUserValid] = useState(false);
    const [formData, setFormData] = useState({
        begin: Date.now() - 7 * 24 * 60 * 60 * 1000,
        eind: Date.now()
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    const handleSumbit = async (e: any) => {

        e.preventDefault();

        if (
            !formData.begin ||
            !formData.eind
        ) return toast.error('Vul alle velden in');

        const begin = new Date(formData.begin).getTime();
        const eind = new Date(formData.eind).setHours(23, 59, 59, 999);
        
        if (begin > eind) return toast.error('Einddatum moet na begindatum zijn');

        setStatus('Laden...');

        const d = (await getDocs(query(sales, where("gebruiker", "==", auth.currentUser?.email), where("datum", ">=", begin), where("datum", "<=", eind)))).docs.map(doc => doc.data());
        
        if (d.length === 0) { 
            setStatus('Bekijk');
            return toast.error('Geen data gevonden');
        } else setDocs(d);

        const form = document.getElementById('form') as HTMLFormElement;
        form.reset();
        setStatus('Bekijk');
        toast.success('Successvol geladen');

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
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <FiHome onClick={() => router.push('/')} className="m-3 absolute top-0 left-0 w-14 h-auto text-blue-500 cursor-pointer"/>

            {
                docs.length === 0 ? (
                    <form onSubmit={handleSumbit} id="form" className="flex flex-col space-y-4 w-80">

                        <div className="my-2 w-full space-y-2 shadow-xl rounded-full text-center">
                            <input
                                name="begin"
                                type="date"
                                defaultValue={new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                required={true}
                                onChange={handleChange}
                                className="w-full h-full text-black p-2 bg-slate-100 focus:outline-none rounded-md text-center"
                            />
                        </div>

                        <div className="my-2 w-full space-y-2 shadow-xl rounded-full text-center">
                            <input
                                name="eind"
                                type="date"
                                defaultValue={new Date().toISOString().split('T')[0]}
                                required={true}
                                onChange={handleChange}
                                className="w-full h-full p-2 text-black bg-slate-100 focus:outline-none rounded-md text-center"
                            />
                        </div>

                        <button
                            type="submit"
                            className="p-2 bg-blue-500 text-white rounded-md shadow-xl"
                        >
                            {status}
                        </button>

                    </form>
                ) : (
                    <div className="flex flex-row flex-wrap w-full p-12 justify-center items-center">
                        {
                            docs.map((doc, i) => (
                                <div key={i} className="m-4 py-4 px-6 text-black shadow-xl bg-slate-100 focus:outline-none rounded-md text-center">
                                    <p className="text-center flex flex-row justify-between w-full"><div className="m-1 bg-slate-200 py-0.5 px-1 rounded-md">Bedrijfsnaam</div><div className="m-1 bg-slate-200 p-0.5 px-1 rounded-md">{doc.bedrijfsnaam}</div></p>
                                    <p className="text-center flex flex-row justify-between w-full"><div className="m-1 bg-slate-200 p-0.5 px-1 rounded-md">Locatie</div><div className="m-1 bg-slate-200 p-0.5 px-1 rounded-md">{doc.locatie}</div></p>
                                    <p className="text-center flex flex-row justify-between w-full"><div className="m-1 bg-slate-200 p-0.5 px-1 rounded-md">Reden</div><div className="m-1 bg-slate-200 p-0.5 px-1 rounded-md">{doc.reden}</div></p>
                                    <p className="text-center flex flex-row justify-between w-full"><div className="m-1 bg-slate-200 p-0.5 px-1 rounded-md">Subreden</div><div className="m-1 bg-slate-200 p-0.5 px-1 rounded-md">{doc.subreden || 'geen'}</div></p>
                                    <p className="text-center flex flex-row justify-between w-full"><div className="m-1 bg-slate-200 p-0.5 px-1 rounded-md">Offerte</div><div className="m-1 bg-slate-200 p-0.5 px-1 rounded-md">{doc.offerte ? 'a': 'nee'}</div></p>
                                    <p className="text-center flex flex-row justify-between w-full"><div className="m-1 bg-slate-200 p-0.5 px-1 rounded-md">In/Uit/Web</div><div className="m-1 bg-slate-200 p-0.5 px-1 rounded-md">{doc.inuitweb}</div></p>
                                    <p className="text-center flex flex-row justify-between w-full"><div className="m-1 bg-slate-200 p-0.5 px-1 rounded-md">Datum</div><div className="m-1 bg-slate-200 p-0.5 px-1 rounded-md">{new Date(doc.datum).toLocaleDateString()}</div></p>
                                </div>
                            ))
                        }
                    </div>
                )
            }
            
            <Toaster containerStyle={{textAlign:'center'}}/>

        </main>
    );

}