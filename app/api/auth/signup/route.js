import bcrypt from "bcrypt";
import { db } from "@/config/connectDb";
import { NextResponse } from "next/server";
export async function POST(req) {
  try {
    const { name, email, password, image, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Please fill all required fields" },
        { status: 400 },
      );
    }

    let [isExist] = await db.execute("SELECT id FROM `user` WHERE email = ? LIMIT 1", [email]);

    if (isExist.length > 0) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let [creatingUser] = await db.execute(
        "INSERT INTO `user` (name, email, password, image, role) VALUES (?, ?, ?, ?, ?)",
        [name, email, hashedPassword, image || null, role || "job-seeker"]
    );

    if (creatingUser.affectedRows === 0) {
      return NextResponse.json(
        { message: "Unable to create account" },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Account created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      ["ECONNREFUSED", "ENOTFOUND", "ETIMEDOUT", "EHOSTUNREACH"].includes(
        error.code,
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Database unavailable. Start MySQL and verify DB_* env vars in .env.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
