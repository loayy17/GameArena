import { Router } from "lucide-react";
import { useRouter } from "next/router";
import { NextRequest } from "next/server";

const MedalWere = (request: NextRequest) => {
    const Router = useRouter();
    const accessToken = request.cookies.get("Access-token")?.value;
    if (!accessToken && (!request.nextUrl.pathname.startsWith("/login")
        || request.nextUrl.pathname.startsWith("/register") )) {
        return Router.replace("/login");
    }
}