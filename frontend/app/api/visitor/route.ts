import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/visitor-count`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Strapi GET response:", data);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Failed to fetch visitor count:", error);
        return NextResponse.json({ error: "Failed to fetch visitor count" }, { status: 500 });
    }
}

export async function POST() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/visitor-count/increment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Strapi POST response:", data);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Failed to increment visitor count:", error);
        return NextResponse.json({ error: "Failed to increment visitor count" }, { status: 500 });
    }
} 
