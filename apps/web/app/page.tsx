"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [slug, setSlug] = useState("");
  const router = useRouter();
  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <div>
        <input
          className="p-10"
          type="text"
          placeholder="Room Name"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        ></input>
        <button
          className="p-10"
          onClick={() => {
            router.push(`/room/${slug}`);
          }}
        >
          Join Room
        </button>{" "}
      </div>
    </div>
  );
}
