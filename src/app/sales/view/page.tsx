'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getDocs, query, where } from "firebase/firestore";
import { DateRange } from "react-date-range";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { MdOutlineFileDownload } from 'react-icons/md'

import { admin, auth, sales } from "@/utils";
import { json2csv } from "json-2-csv";
import { nl } from "date-fns/locale";

export default function Page() {

    const router = useRouter();

    const [userOptions, setUserOptions] = useState([] as any[]);
    const [selectedUsers, setSelectedUsers] = useState([] as any[]);
    const [docs, setDocs] = useState([] as any[])
    const [isUserValid, setIsUserValid] = useState(false);
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    
    const handleChange = (ranges: any) => setDateRange([ranges.selection]);

    const handleSumbit = async (e: any) => {

        e.preventDefault();

        const promise = new Promise<string>(async (resolve, reject) => {

            const start = dateRange[0].startDate.setHours(0, 0, 0, 0);
            const end = dateRange[0].endDate.setHours(23, 59, 59, 999);
            
            try {

                let d;
                
                if (admin()) {
                    d = (await getDocs(query(sales, where("datum", ">=", start), where("datum", "<=", end)))).docs.map(doc => doc.data()).sort((a, b) => b.datum - a.datum);
                    const o = Array.from(new Set(d.map(doc => doc.gebruiker)));
                    setUserOptions(o);
                    setSelectedUsers(o);
                } else {
                    d = (await getDocs(query(sales, where("gebruiker", "==", auth.currentUser?.email), where("datum", ">=", start), where("datum", "<=", end)))).docs.map(doc => doc.data()).sort((a, b) => b.datum - a.datum);
                }

                if (!d.length) return reject('Geen data gevonden');
                
                setDocs(d);
                
            } catch (error: any) { return reject('Er ging iets mis...'); }

            e.target.reset();
            resolve('Data geladen');

        });

        toast.promise(promise, {
            loading: 'Laden...',
            success: msg => msg,
            error: err => err
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

        <div className="flex flex-col h-full p-4 justify-center m-auto">

            { docs.length > 0 ? (

                <div>
                    
                    {
                        userOptions.length > 0 && (
                            <div className="flex flex-row justify-center mx-2 space-x-2">
                                <div className="w-8 h-8 mt-4 text-blue-500" />
                                <div className="mb-6 w-full mx-auto flex flex-row flex-wrap justify-evenly space-x-2 space-y-2">
                                    {userOptions.map((userOption, index) => (
                                        <label key={index} className="inline-flex shadow-xl items-center justify-center px-3 py-1 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                            <input
                                                type="checkbox"
                                                value={userOption}
                                                checked={selectedUsers.includes(userOption)}
                                                onChange={(e) => handleCheckboxChange(e, userOption)}
                                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"/>
                                            <span className="ml-2">{formatUser(userOption)}</span>
                                        </label>
                                    ))}
                                </div>
                                <MdOutlineFileDownload
                                    className="w-8 h-8 mt-4 text-blue-500 cursor-pointer"
                                    onClick={() => {
                                        const promise = new Promise<string>(async (resolve, reject) => {

                                            const selected = docs.filter(doc => selectedUsers.includes(doc.gebruiker));

                                            if (!selected.length) return reject('Geen data geselecteerd');
                                
                                            try {
                                                                        
                                                const csv = json2csv(selected);
                                                const blob = new Blob([csv], { type: 'text/csv' });
                                                const url = window.URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = 'data.csv';
                                                document.body.appendChild(a);
                                                a.click();
                                                document.body.removeChild(a);
                                                    
                                            } catch (error: any) { return reject('Er ging iets mis...'); }
                                
                                            resolve('Data gedownload');
                                
                                        });
                                
                                        toast.promise(promise, {
                                            loading: 'Downloaden...',
                                            success: msg => msg,
                                            error: err => err
                                        });
                                    }}
                                />

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

                <form onSubmit={handleSumbit} className="flex flex-col items-center space-y-4">

                        <DateRange
                            onChange={handleChange}
                            ranges={dateRange}
                            className="text-black my-2 p-2 focus:outline-none shadow-xl rounded-md"
                            locale={nl}
                            showDateDisplay={false}
                            fixedHeight={true}                            
                        />
        
                    <button
                        type="submit"
                        className="p-2 bg-blue-500 text-white rounded-md shadow-xl w-80"
                    >
                        Bekijk
                    </button>
        
                </form>

            )}

        </div>
            
    );

}