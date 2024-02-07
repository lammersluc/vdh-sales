'use client';

import { useRouter } from "next/navigation";

import { auth } from "@/utils/firebase";

export default function Page() {

    const router = useRouter();

    auth.signOut().then(() => {
        router.push("/account/login");
    });
    
    return null;
    
}