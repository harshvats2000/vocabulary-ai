import axios from "axios";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";

export default function Home() {
  const [word, setWord] = useState<{ word: string; example: string; meaning: string } | null>(null);
  const [meaning, setMeaning] = useState<string>("");
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<null | { answer: "no" | "yes"; reason?: string }>(null);

  async function fetchWords() {
    const { data } = await axios.get(`/api/word`);

    setWord(data);
  }

  async function checkMeaning(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setChecking(true);
    if (!word) return;
    const { data } = await axios.post(`/api/check-meaning`, {
      meaning,
      word: word.word
    });

    setCheckResult(data);
    setChecking(false);
  }

  useEffect(() => {
    fetchWords();
  }, []);

  return (
    <main>
      {/* <h1>Vocabulary</h1> */}

      {!!word && (
        <div>
          <p className="font-bold uppercase">{word.word}</p>
          <p>{word.meaning}</p>
          <p>{word.example}</p>
          <form onSubmit={checkMeaning}>
            <input
              className="border p-2"
              type="text"
              placeholder="What does it mean?"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
            />
            <button type="submit">Check</button>
            <div className="mt-2">
              {checking === false && checkResult?.answer === "yes" && (
                <div className="p-2 bg-green-100 text-green-700">
                  <h2>CORRECT</h2>
                  <p>{checkResult.reason}</p>
                </div>
              )}
              {checking === false && checkResult?.answer === "no" && (
                <div className="p-2 bg-red-100 text-red-700">
                  <h2>WRONG</h2>
                  <p>{checkResult.reason}</p>
                </div>
              )}
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
