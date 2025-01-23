"use client";

import Image from "next/image";
import { SendHorizontal, Book, Code, NotebookText, User } from "lucide-react";
import { useAppContext } from "../context/context";
import GroundingChunksList from "./GroundingChunksList";
import { useTheme } from "next-themes";
import React, { useRef, useState } from "react";

export default function Main() {
  const {
    chatWithVertex,
    groundingChunks,
    input,
    setInput,
    recentPrompt,
    loading,
    showResult,
    result
  } = useAppContext();
  const { theme } = useTheme();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="flex-1 min-h-screen bg-white dark:bg-gray-900 pb-[15vh] relative border-blue-500 dark:border-gray-300">
      <div className="flex items-center justify-between text-2xl bg-white dark:bg-gray-800 border-b-2 border-gray-400 dark:border-gray-300">
        {
          theme === "light" ? (
            <>
              <Image className="ml-[10%]" src="/aico-agent.png" alt="Logo" width={180} height={90} />
              <div className="row-span-3 text-left mr-[35%]">
                <span style={{ fontWeight: 'bold', fontSize: '30px' }}>
                 LEAN MANAGEMENT
                </span>
                <span className="flex flex-col" style={{ fontSize: '20px'}}>AFTER SALES ROBOTICS</span>
              </div>    
              <Image className="mr-[10%]" src="/logo-blue.png" alt="Logo" width={90} height={90} />
            </>
          ) : (
            <>
              <Image className="ml-[10%]" src="/aico-agent-blk.png" alt="Logo" width={180} height={90} />
              <div className="row-span-3 text-left mr-[35%] text-white">
                <span style={{ fontWeight: 'bold', fontSize: '30px' }}>
                 LEAN MANAGEMENT
                </span>
                <span className="flex flex-col" style={{ fontSize: '20px'}}>AFTER SALES ROBOTICS</span>
              </div>
              <Image className="mr-[10%]" src="/logo-white.png" alt="Logo" width={90} height={90} />
            </>
          )
        }
        
      </div>
      <div className="max-w-[900px] mx-auto">
        {!showResult ? (
          <>
            <div className="my-12 text-4xl text-gray-400 dark:text-gray-500 font-light p-5">
              <p>How can I help you today?</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 p-5">
              {[
                { name: "Prompt Improvement", icon: NotebookText, text: "Improve the following prompt for me:" },
                { name: "Document Summary Prompt", icon: Book, text: "Summarize the following document:" },
                { name: "Code Suggestion", icon: Code, text: "Write JavaScript code for following requirement:" },
              ].map((item, index) => (
                <div key={index} onClick={() => {setInput(item.text + " "); inputRef.current?.focus()}} className="h-[150px] p-4 bg-gray-200 dark:bg-gray-700 rounded-lg relative cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600">
                  <p className="text-gray-800 dark:text-gray-200">{item.name}</p>
                  <item.icon className="absolute bottom-2 right-2 p-1 dark:bg-gray-300 rounded-full" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-2 max-h-[70vh] overflow-y-auto">
            <div className="my-10 flex items-center gap-5">
              <User size={40} className="rounded-full border border-gray-800 dark:border-gray-200" />
              <p className="text-gray-800 dark:text-gray-200">{recentPrompt}</p>
            </div>
            <div className="flex items-start gap-5">
              <Image src="/logo-blue.png" alt="Logo" width={48} height={48} />
              {loading ? (
                <div className="w-full flex flex-col gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-2 bg-blue-500 rounded-full animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <p className="text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: result }}></p>
                  <GroundingChunksList groundingChunks={groundingChunks} />
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="absolute bottom-0 w-full max-w-[700px] pt-10 mt-5">
          <div className="flex items-start justify-between gap-5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 p-7 rounded-3xl">
            <textarea
              ref={inputRef}
              onChange={(e) => setInput(e.target.value)}
              value={input}
              placeholder="Input the robot model here for search"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  chatWithVertex();
                }
              }}
              className="flex-1 bg-transparent border-none outline-none text-base text-gray-800 dark:text-gray-200 resize-none max-h-32 overflow-auto"
            />
            <div className="self-end">
              <SendHorizontal onClick={() => chatWithVertex()} className="cursor-pointer text-gray-600 dark:text-gray-400" />
            </div>
          </div>
          <p className="text-sm mt-4 text-center text-gray-600 dark:text-gray-400">
            COMAU AICO generated content may be inaccurate. <a target="_blank" href="https://drive.google.com/file/d/1OXkt4Z9hVoy4rXGFBOhzR9e0LJers5fJ/view" className="text-blue-500 underline">Refered Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
