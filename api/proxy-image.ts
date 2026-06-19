import type { Request, Response } from "express";

export default async function handler(req: Request, res: Response) {
  try {
    const imageUrl = req.query.url;
    if (!imageUrl || typeof imageUrl !== "string") {
      return res.status(400).send("Parameter 'url' is required.");
    }
    
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return res.status(response.status).send("Failed to fetch image");
    }
    
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.send(buffer);
  } catch (error: any) {
    console.error("Proxy error:", error);
    return res.status(500).send("Error proxying image");
  }
}
