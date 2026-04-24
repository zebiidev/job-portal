import mysql from "mysql2/promise";

export const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "job_portal",
});

export const connectDb = async () => {
    try {
        let database = await db.getConnection();
        console.log("Connected to database successfully");
        database.release();
    } catch (error) {
        console.log("Error connecting to database", error);
        process.exit(1);
    }
};
