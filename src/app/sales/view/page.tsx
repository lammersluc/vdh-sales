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

        const d = (await getDocs(query(sales, where("gebruiker", "==", auth.currentUser?.email), where("datum", ">=", begin), where("datum", "<=", eind)))).docs.map(doc => doc.data()).sort((a, b) => b.datum - a.datum);
        
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
        <main className="flex min-h-screen justify-center items-center">
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
                    <div className="overflow-scroll p-10">
                    <table className="divide-y shadow-xl rounded-lg overflow-hidden">
                        <thead className="bg-gray-100 rounded-lg">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Datum
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Bedrijfsnaam
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Locatie
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Reden
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subreden
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Offerte
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    In/Uit/Web
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {docs.map((doc, i) => (
                                <tr key={i} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(doc.datum).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.bedrijfsnaam}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.locatie}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.reden}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.subreden}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.offerte ? 'ja' : 'nee'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.inuitweb}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                )
            }
            
            <Toaster containerStyle={{textAlign:'center'}}/>
        </main>
    );

}