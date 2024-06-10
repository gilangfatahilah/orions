import { NextResponse } from "next/server";
import prisma from '@/lib/db';
import * as z from 'zod';
import * as bcrypt from 'bcryptjs';

const userSchema = z.object({
  name: z.string().min(1, 'name is required').max(100),
  email: z.string().min(1, 'email is required').email('invalid email address'),
  password: z.string().min(1, 'password is required').min(8, 'password mush have at least 8 characters'),
  role: z.string().min(1, 'role is required').max(20),
  image: z.string().min(1, 'imageUrl is required'),
});

export const POST = async (req: Request): Promise<NextResponse | undefined> => {
  try {
    const body = await req.json();

    const { name, email, password, role, image } = userSchema.parse(body);

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUserByEmail = await prisma.user.findUnique({
      where: {
        email: email,
      }
    })

    if (existingUserByEmail) {
      return NextResponse.json({ user: null, message: 'User already exists' }, { status: 409 });
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        image,
      }
    })

    const rest = newUser;

    return NextResponse.json({ user: rest, message: 'Success, create new user.' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ user: null, message: 'Error, something wen wrong.' }, { status: 500 });
  }
}