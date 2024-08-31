import axios from "axios";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";

export default function Home() {
  const [word, setWord] = useState<{ word: string; example: string; meaning: string } | null>(null);
  const [meaning, setMeaning] = useState<string>("");

  async function fetchWords() {
    const { data } = await axios.get(`/api/word`);
    console.log(data);

    setWord(data);
  }

  async function checkMeaning(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!word) return;
    const { data } = await axios.post(`/api/check-meaning`, {
      meaning,
      word: word.word
    });
    console.log(data);
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
          </form>
        </div>
      )}
    </main>
  );
}
