"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  color: string;
  completed: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`
        );
        const data = await response.json();
        setTasks(data || []);
        setCompletedTasks(data?.filter((task: Task) => task.completed) || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleComplete = async (taskId: string, completed: boolean) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed }),
        }
      );

      if (!response.ok) throw new Error("Failed to update task");

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed } : task
        )
      );
      setCompletedTasks((prevTasks) =>
        completed
          ? [...prevTasks, tasks.find((task) => task.id === taskId)!]
          : prevTasks.filter((task) => task.id !== taskId)
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async (taskId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete task");

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      setCompletedTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== taskId)
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="w-full -mt-2">
      <button
        onClick={() => router.push("/add")}
        className="bg-primary text-foreground py-2 px-4 rounded hover:bg-primary-700 w-full -mt-3 flex justify-center items-center gap-1"
      >
        Create Task
        <Image src="plus.svg" alt="Add todo icon" width={16} height={16} />
      </button>
      <div className="flex justify-between my-5">
        <div className="flex gap-2 items-center mt-5">
          <span className="text-primary font-bold">Tasks</span>
          <span className="bg-surface px-2 rounded-full">{tasks.length}</span>
        </div>
        <div className="flex gap-2 items-center mt-5">
          <span className="text-secondary font-bold">Completed </span>
          <span className="bg-surface px-2 rounded-full">
            {tasks.length > 0
              ? `${completedTasks.length} of ${tasks.length}`
              : completedTasks.length}
          </span>
        </div>
      </div>
      {tasks.length > 0 ? (
        <ul className="mt-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="bg-surface w-full rounded-md mb-3 shadow-md p-3 flex gap-4 items-start justify-between"
            >
              <div className="flex gap-3">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4"
                  checked={task.completed}
                  onChange={(e) => handleComplete(task.id, e.target.checked)}
                />
                <p
                  className={`cursor-pointer ${
                    task.completed && "line-through"
                  }`}
                  onClick={() => router.push(`/edit/${task.id}`)}
                >
                  {task.title}
                </p>
              </div>

              <Image
                src="trash.svg"
                alt="Add todo icon"
                width={24}
                height={24}
                className="cursor-pointer"
                onClick={() => handleDelete(task.id)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col gap-3 border-t-2 border-grey items-center justify-center p-[4rem]">
          <Image
            src="clipboard.svg"
            alt="Add todo icon"
            width={56}
            height={56}
            className="mt-5"
          />
          <p className="text-grey font-bold">
            You don&apos;t have any tasks registered yet.
          </p>
          <p className="text-grey">
            Create tasks and organize your to-do items.
          </p>
        </div>
      )}
    </div>
  );
}
