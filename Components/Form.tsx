"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const colors = [
  "#ff3b30",
  "#ff9500",
  "#ffcc00",
  "#34e759",
  "#007aff",
  "#5856d6",
  "#af52de",
  "#ff2d55",
  "#a2845e",
];
export default function Form() {
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchTask = async () => {
      if (id) {
        setLoading(true);
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`
          );
          if (!response.ok) throw new Error("Failed to fetch task details.");
          const data = await response.json();
          setTitle(data.title);
          setColor(data.color);
        } catch (err) {
          setError(
            (err as { message: string }).message || "Something went wrong."
          );
        } finally {
          setLoading(false);
        }
      }
    };
    fetchTask();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !color) {
      setError("Both title and color are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const method = id ? "PUT" : "POST";
      const endpoint = id ? `/api/tasks/${id}` : "/api/tasks";
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, color }),
      });

      if (!response.ok) throw new Error("Failed to save the task.");
      router.push("/");
    } catch (err) {
      setError((err as { message: string }).message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mt-[4rem]">
      <Image
        src="../back.svg"
        alt="Add todo icon"
        className="my-5 cursor-pointer"
        width={24}
        height={24}
        onClick={() => router.push("/")}
      />
      <form onSubmit={handleSubmit}>
        <h2 className="text-primary font-bold my-1">Title</h2>
        <input
          type="text"
          placeholder="Ex. Brush you teeth"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 rounded bg-surface mb-5"
          disabled={loading}
        />
        <h2 className="text-primary font-bold my-1">Color</h2>
        <div className="flex flex-wrap gap-4 my-2">
          {colors.map((clr) => (
            <button
              key={clr}
              type="button"
              onClick={() => setColor(clr)}
              style={{ backgroundColor: clr }}
              className={`rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 ${
                clr === color && "ring-2 ring-white"
              }`}
              disabled={loading}
            ></button>
          ))}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-primary text-foreground py-3 px-4 rounded hover:bg-primary-700 w-full mt-[2rem] flex justify-center items-center gap-1"
          disabled={loading}
        >
          {loading ? "Saving..." : id ? "Save Task" : "Add Task"}
          <Image
            src={id ? "../tick.svg" : "../plus.svg"}
            alt={id ? "Save task icon" : "Add task icon"}
            width={16}
            height={16}
          />
        </button>
      </form>
    </div>
  );
}
