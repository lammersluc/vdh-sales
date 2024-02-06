import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { db } from "@/utils/firebase-admin"
import { checkToken } from "@/utils/checkToken";

export async function GET(req: NextRequest) {

    if (!await checkToken(headers().get("Authorization"))) return NextResponse.json({}, { status: 401 });

    const params = req.nextUrl.searchParams;

    const begin = params.get("begin");
    const eind = params.get("eind");

    if (!begin || !eind) return NextResponse.json({}, { status: 400 });

    const docs = (await db
        .collection("sales")
        .where("datum", ">=", parseInt(begin))
        .where("datum", "<=", parseInt(eind))
        .get()).docs;

    return NextResponse.json(
        docs.map(doc => {
            const data = doc.data();
            return {
                gebruiker: data.gebruiker,
                datum: data.datum,
                bedrijfsnaam: data.bedrijfsnaam,
                nieuw: data.nieuw,
                locatie: data.locatie,
                reden: data.reden,
                subreden: data.subreden,
                offerte: data.offerte,
                inuitweb: data.inuitweb,
            }
        })
    , { status: 200 });

}

export async function POST(req: Request) {

    if (!await checkToken(headers().get("Authorization"))) return NextResponse.json({}, { status: 401 });

    const body = await req.json();

    if (
        typeof body.gebruiker !== "string" ||
        typeof body.datum !== "number" ||
        typeof body.bedrijfsnaam !== "string" ||
        typeof body.nieuw !== "boolean" ||
        typeof body.locatie !== "string" ||
        typeof body.reden !== "string" ||
        typeof body.subreden !== "string" ||
        typeof body.offerte !== "boolean" ||
        typeof body.inuitweb !== "string"
    ) {
        return NextResponse.json({}, { status: 400 });
    }

    try {

        db.collection("sales").add({
            gebruiker: body.gebruiker,
            datum: body.datum,
            bedrijfsnaam: body.bedrijfsnaam,
            nieuw: body.nieuw,
            locatie: body.locatie,
            reden: body.reden,
            subreden: body.subreden,
            offerte: body.offerte,
            inuitweb: body.inuitweb,
        });

    } catch (error) {
        return NextResponse.json({}, { status: 500 });
    }

    return NextResponse.json({}, { status: 201 });
}