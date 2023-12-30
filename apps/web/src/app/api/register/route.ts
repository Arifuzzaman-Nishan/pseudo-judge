import { NextResponse, type NextRequest } from "next/server";
import * as bcrypt from "bcrypt";
import mongoConnection from "@/utils/database/connection";
import User from "@/utils/database/models/User";

export const POST = async (request: NextRequest) => {
  const registerData = await request.json();

  console.log("registerData is ", registerData);

  const { password, confirmPassword, ...restData } = registerData;

  await mongoConnection();
  console.log("successfully database is connected...");

  const existingUser = await User.findOne({ email: registerData.email });

  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: "Password don't match" },
      { status: 400 }
    );
  }

  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 6);

  const newUser = new User({
    ...restData,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    return NextResponse.json(
      { message: "User is successfully register" },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
};
