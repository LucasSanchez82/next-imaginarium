import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/schemas/authSchemas";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const safeBody = registerSchema.safeParse(body);

    if (safeBody.success) {
      const { name, email, password } = safeBody.data;

      const hashedPassword = await hash(password, 12);

      const user = await prisma.user.create({
        data: {
          name: name,
          email: email.toLowerCase(),
          password: hashedPassword,
        },
      });

      return NextResponse.json({
        user: {
          name: user.name,
          email: user.email,
        },
      });

    } else { // Si mauvais type alors
      return NextResponse.json({ error: safeBody.error.message }, {status: 401});
    }
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: error.message,
      }),
      { status: 500 }
    );
  }
}
