import {validatePreviewUrl} from "@sanity/preview-url-secret";
import {redirect} from "next/navigation";
import {draftMode} from "next/headers";
import { client } from "@/sanity/lib/client";
import { NextRequest } from "next/server";

const token = process.env.SANITY_API_TOKEN_READ;

export async function GET(request: NextRequest){

    const {isValid,redirectTo="/"} = await validatePreviewUrl(
        client.withConfig({token}),
        request.url
    );
    if(!isValid){
        return new Response("Invalid secret", {status: 401});
    }
    (await draftMode()).enable();


    redirect(redirectTo);
}