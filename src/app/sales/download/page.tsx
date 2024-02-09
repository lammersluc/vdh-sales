'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDocs, query, where } from "firebase/firestore";
import toast from "react-hot-toast";
import { json2csv } from "json-2-csv";

import { auth, sales } from "@/utils/firebase";
import { Header, Footer } from "@/components";

export default function Page() {

    const router = useRouter();

    const [status, setStatus] = useState('Download');
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

        setStatus('Downloaden...');

        const docs = (await getDocs(query(sales, where("datum", ">=", begin), where("datum", "<=", eind)))).docs.map(doc => doc.data());

        if (docs.length === 0) {
            setStatus('Download');
            return toast.error('Geen data gevonden');
        }

        try {
            const csv = json2csv(docs);
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'data.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
                
        } catch (error: any) {
            return toast.error(error.message);
        }
        
        const form = document.getElementById('form') as HTMLFormElement;
        form.reset();
        setStatus('Download');
        toast.success('Bestand gedownload');

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
        <main className="flex flex-col h-dvh">

            <Header />

            <div className="flex flex-col h-full p-4 justify-center m-auto">

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

            </div>
            
            <Footer />

        </main>
    );

}