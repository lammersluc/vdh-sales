'use client';

import { useRouter } from "next/navigation";

import { auth } from "@/utils/firebase";

export default async function Page() {

    const router = useRouter();

    await auth.signOut();
    
    router.push("/account/login");
    
}