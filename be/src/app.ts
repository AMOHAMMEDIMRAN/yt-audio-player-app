import express from "express";

export const app = express();

app.use(express.json());

// app.use("/api/v1/auth", )