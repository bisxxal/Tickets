
"use client";
import React, { useState } from "react"; 
import { RxCross2 } from "react-icons/rx";
import { BiBot } from "react-icons/bi";
import { IoMdSend } from "react-icons/io";
import runChat from "@/lib/Gemini";
import Image from "next/image";

const ChatBot  = ({chat}:any) => {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [input, setInput] = useState<string>( chat||"");
  const [recentPrompt, setRecentPrompt] = useState<string>("");
  const [showResult, setShowResult] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [resultData, setResultData] = useState<string>("");
 
  const delayPara = (index: number, nextWord: string) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };
 
  // const newChat = () => {
  //   setLoading(false);
  //   setShowResult(false);
  // };
 
  const onSent = async (prompt?: string) => {
    try {
      setResultData("");
      setLoading(true);
      setShowResult(true);
      let response: string;
      
      if (prompt !== undefined) {
        response = await runChat(prompt);
        setRecentPrompt(prompt);
      } else {
        setRecentPrompt(input);
        response = await runChat(input);
      }
 
      let responseArray = response.split("**");
      let formattedResponse = responseArray.map((text, index) =>
        index % 2 !== 1 ? text : `</br> <span style="font-weight:700">${text}</span>`
      ).join("");

      formattedResponse = formattedResponse.split("*").join("</br>");
      const responseWords = formattedResponse.split(" ");
      responseWords.forEach((word, i) => delayPara(i, word + " "));

      setLoading(false);
      // setInput("");
    } catch (error) {
      console.error("Error while sending the prompt:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={() => setShowSearch(true)}
        className="inshadow fixed bottom-10 backdrop-blur-md right-10 flex items-center cursor-pointer gap-1 px-2 py-2 border-[2px] bg-[#ffffff0b] border-[#ffffff17] rounded-2xl"
      >
        Ask ChatBot
 
        <Image src='/ai.png' className='w-[50px] animate-bounce transition-all h-[50px]' height={90} width={90} alt="" />    
      </div>

      {showSearch && (
        <div className="bg-[#0000008e] z-50 h-screen w-full absolute top-0 left-0">
          <h1
            onClick={() => setShowSearch(false)}
            className="cursor-pointer z-10 absolute left-[86%] top-[1%] text-3xl font-thin"
          >
            <RxCross2 />
          </h1>
          <div className="h-[80vh] inshadow max-lg:w-[78%] w-[80vw] backdrop-blur-xl bg-[#0000004e] searchbg border-[2px] border-[#ffffff17] rounded-2xl absolute top-[5%] max-lg:left-[10%] left-[8%] mt-1 shadow-lg overflow-y-auto z-10">
           
               <h1 className=" text-center mt-3">Ask anything AI to guide You !!</h1>
            <div className="inshadow  z-[100] justify-between flex gap-3 px-2 py-2 border-[2px] bg-[#ffffff0b] border-[#ffffff17] rounded-xl w-[76%] mx-auto mt-4">
              <input
                type="text"
                className="border-none outline-none placeholder:text-gray-500 bg-transparent w-full  text-sm"
                placeholder="Ask about anything..."
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />

          <IoMdSend className=" cursor-pointer text-2xl" onClick={() => onSent()} />
            </div>
 
            <div className="p-4 text-white flex items-center min-h-full justify-center">
              {loading ? ( <Image className=" w-[130px] " src="/loading.gif" height={90} width={90} alt='' /> ) : <p dangerouslySetInnerHTML={{ __html: resultData }} />} 
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
