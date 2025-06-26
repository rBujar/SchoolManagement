"use client";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react"; // Icon library
import Image from "next/image";

export default function ChatbotWidget() {
  const [iframeUrl, setIframeUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch("/api/ayd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then(({ url }) => {
        setIframeUrl(url);
      });
  }, []);

  return (
    <>
      {/* Floating Chatbot Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-lamaYellow hover:bg-lamaYellowLight text-white p-3 rounded-full shadow-lg transition-all"
      >
        <Image src="/robot.png" alt="" width={14} height={14} className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow"/>
      </button>

      {/* Chatbot Window (Shows when Open) */}
      {isOpen && (
        <div className="fixed bottom-16 right-6 bg-white shadow-lg rounded-lg p-4 w-96 h-[600px]">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-gray-800">Botvisor-DB</h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800">
              ✖
            </button>
          </div>
          {iframeUrl ? (
            <iframe
              className="border rounded-lg w-full h-full"
              src={iframeUrl}
            ></iframe>
          ) : (
            <p>Loading chatbot...</p>
          )}
        </div>
      )}
    </>
  );
}
