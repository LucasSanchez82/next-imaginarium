import { flashDatas } from "@/lib/utils"
import { NextResponse } from "next/server";

export const GET = async () => {
    const datas = await flashDatas.getAll();
    console.log(datas);
    
    return NextResponse.json(datas, {status: 200});
}