import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";
import { successResponse, validateMethod } from "@/utils/api";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    validateMethod(req, ["GET"]);
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.replace("Bearer ", "");
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
        return res.status(401).json({ error: "Invalid token" });
    }

    successResponse(
        res,
        {
            user: data.user,
        }
    )
}