'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, sales } from "@/utils/firebase";
import toast from "react-hot-toast";
import { getDocs, query, where } from "firebase/firestore";

import { Header, Footer } from "@/components";

export default function Page() {

    const router = useRouter();

    const [visible, setVisible] = useState(false);
    const [userOptions, setUserOptions] = useState([] as any[]);
    const [selectedUsers, setSelectedUsers] = useState([] as any[]);
    const [docs, setDocs] = useState([] as any[])
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

        const promise = new Promise(async (resolve, reject) => {

            const begin = new Date(formData.begin).getTime();
            const eind = new Date(formData.eind).setHours(23, 59, 59, 999);
            
            if (begin > eind) return reject('Einddatum moet na begindatum zijn');

            try {

                let d;
                
                if (localStorage.getItem('user') === 'admin') {
                    d = (await getDocs(query(sales, where("datum", ">=", begin), where("datum", "<=", eind)))).docs.map(doc => doc.data()).sort((a, b) => b.datum - a.datum);
                    const o = Array.from(new Set(d.map(doc => doc.gebruiker)));
                    setUserOptions(o);
                    setSelectedUsers(o);
                } else {
                    d = (await getDocs(query(sales, where("gebruiker", "==", auth.currentUser?.email), where("datum", ">=", begin), where("datum", "<=", eind)))).docs.map(doc => doc.data()).sort((a, b) => b.datum - a.datum);
                }

                if (d.length > 0) { 
                    setDocs(d);
                    setVisible(true);
                } else {
                    return reject('Geen data gevonden');
                }
                
            } catch (error: any) { return reject(error.message); }

            const form = document.getElementById('form') as HTMLFormElement;
            resolve(form.reset());

        });

        toast.promise(promise, {
            loading: 'Downloaden...',
            success: 'Gedownload',
            error: (error) => error
        });

    }

    const handleCheckboxChange = (e: any, user: string) => {

        if (e.target.checked) {
            setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, user]);
        } else {
            setSelectedUsers((prevSelectedUsers) =>
                prevSelectedUsers.filter((selectedUser) => selectedUser !== user)
            );
        }

    };

    const formatUser = (user: string) => 
        user.split('@')[0]
            .replace(/^[a-z]|(?:\.[a-z])/g, (v) => v.toUpperCase())
            .replace(/\./g, '. ')
            .replace(/\b\w/g, (c) => c.toUpperCase())
            .replace(/\.[a-z]/g, (v) => v.toUpperCase());


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
            {
                visible ? (

                    <div>
                        
                        {
                            userOptions.length > 0 && (
                                <div className="mb-6 w-full mx-auto flex flex-row flex-wrap justify-evenly space-x-2 space-y-2">
                                    {userOptions.map((userOption, index) => (
                                        <div key={index} className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                value={userOption}
                                                checked={selectedUsers.includes(userOption)}
                                                onChange={(e) => handleCheckboxChange(e, userOption)}
                                                className="form-checkbox h-4 w-4 rounded-full bg-blue-500"
                                            />
                                            <span className="ml-2">{formatUser(userOption)}</span>
                                        </div>
                                    ))}
                                </div>
                            )
                        }

                        <table className="divide-y mx-auto shadow-xl rounded-lg overflow-hidden max-w-full">

                            <thead className="flex bg-gray-100 w-full">
                                <tr className="flex w-full">
                                    <th scope="col" className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Datum
                                    </th>
                                    <th scope="col" className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Bedrijfsnaam
                                    </th>
                                    <th scope="col" className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Locatie
                                    </th>
                                    <th scope="col" className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Reden
                                    </th>
                                    <th scope="col" className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Subreden
                                    </th>
                                    <th scope="col" className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Offerte
                                    </th>
                                    <th scope="col" className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        In/Uit/Web
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="flex flex-col h-[470px] overflow-y-auto">
                                {docs.map((doc, i) => (userOptions.length === 0 || selectedUsers.includes(doc.gebruiker)) && (
                                    <tr key={i} className={`flex w-full ${i % 2 === 0 ? 'bg-slate-50' : 'bg-white'} `}>
                                        <td className="px-8 py-4 w-full whitespace-nowrap text-sm text-gray-900">{new Date(doc.datum).toLocaleDateString()}</td>
                                        <td className="px-8 py-4 w-full whitespace-nowrap text-sm text-gray-900">{doc.bedrijfsnaam}</td>
                                        <td className="px-8 py-4 w-full wwhitespace-nowrap text-sm text-gray-900">{doc.locatie}</td>
                                        <td className="px-8 py-4 w-full whitespace-nowrap text-sm text-gray-900">{doc.reden}</td>
                                        <td className="px-8 py-4 w-full whitespace-nowrap text-sm text-gray-900">{doc.subreden}</td>
                                        <td className="px-8 py-4 w-full whitespace-nowrap text-sm text-gray-900">{doc.offerte ? 'ja' : 'nee'}</td>
                                        <td className="px-8 py-4 w-full whitespace-nowrap text-sm text-gray-900">{doc.inuitweb}</td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>

                    </div>

                ) : (

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
                            Bekijk
                        </button>

                    </form>

                )
            }
            </div>
            
            <Footer />

        </main>
    );

}