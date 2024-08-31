import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"]
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const chatCompletion = await client.chat.completions.create({
      messages: [
        { role: "user", content: "Generate 1 intermediate english word with it's meaning and example in json." }
      ],
      //   model: "gpt-3.5-turbo"
      model: "gpt-4o-mini",
      response_format: {
        type: "json_object"
      }
    });

    let jsonString = chatCompletion.choices[0].message.content!;
    res.status(200).json(JSON.parse(jsonString));
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while fetching the word" });
  }
}
