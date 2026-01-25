import { Icon } from "@iconify/react";
import React from "react";

const page = () => {
  return (
    <div className="px-5 ">
      <div className="text-white flex justify-between items-center w-full text-xl py-2 border-b border-b-neutral-300">
        <p className="text-lg">Quests</p>
        <div className="flex items-center gap-4">
          <Icon icon={"lucide:bell"} className="cursor-pointer" />
          <div className="flex justify-normal items-center gap-1 bg-[#1B1540] rounded-lg p-2 cursor-pointer">
            <Icon icon={"lucide:wallet-minimal"} />
            <p>$0</p>
          </div>
          <div className="flex justify-normal items-center gap-2 cursor-pointer">
            <img
              src={"/quest-detail/npm-icon.png"}
              className="size-5"
              width={16}
            />
            <p>Ruze.stellar</p>
            <Icon icon={"lucide:chevron-down"} className="ml-3" width={24} />
          </div>
        </div>
      </div>
      <div className="font-inter">
        <div className="flex justify-normal items-center gap-4 text-white text-2xl py-8">
          <img
            src={"/quest-detail/npm-icon.png"}
            className="size-20"
            width={30}
          />
          <h3>Download and test the latest Ruze.stellar 2.0</h3>
        </div>
        {/* ABOUT SURVEY  */}
        <div className="flex justify-normal items-start">
          <div className="w-[30%]">
            <p className="text-[#8C86B8] p-2">About survery</p>
            <div className=" border-t border-r border-b border-neutral-300">
              <div className="text-white flex flex-col gap-2 p-3 border-b border-b-neutral-300 py-6">
                <p>Product link</p>
                <p className="bg-[#1B1540] p-2 rounded-lg">
                  https://productlink.com
                </p>
              </div>
            </div>
            <div className=" border-r border-b border-neutral-300 flex flex-col gap-2 items-start text-white p-2 py-6">
              <div className="flex items-center gap-2">
                <img
                  src="/quest-detail/stellar-icon.png"
                  alt=""
                  className="size-6"
                />
                <h2 className="text-2xl font-semibold">640 XLM</h2>
              </div>
              <div className="flex items-center ">
                <div className="size-3 bg-[#9011FF] rounded-full" />
                <p className="text-[#CFC9FF]">10 XLM per Winner</p>
              </div>
            </div>
            <div className=" border-r border-b border-neutral-300 flex flex-col gap-2 items-start text-white p-2 py-6">
              <h2 className="text-2xl font-semibold">72</h2>
              <p className="text-[#CFC9FF]">Total Responses</p>
            </div>
            <div className=" border-r border-b border-neutral-300 flex flex-col gap-2 items-start text-white p-2 py-6">
              <h2 className="text-2xl font-semibold">0h: 0m: 0s</h2>
              <p className="text-[#CFC9FF]">Time Left</p>
            </div>
            <div className=" border-r  border-neutral-300 flex flex-col gap-1 items-start text-white p-2 py-4 h-screen">
              <p className="text-[#CFC9FF]">Winner announcement</p>
              <p>24th January, 2026</p>
            </div>
          </div>
          {/* END OF ABOUT SURVERY SECTION  */}
          <div className="w-[70%] ">
            <div className="flex justify-normal items-center gap-3 text-[#CFC9FF] p-2 border-b-neutral-300 border-b">
              <p>Details</p>
              <p>Response</p>
            </div>
            <div>
              <div className="flex justify-between items-center bg-[#141026] rounded-2xl p-4 m-4">
                <div className="flex flex-col gap-0">
                  <h2 className="text-xl text-white font-medium">
                    It's time to select the winners
                  </h2>
                  <p className="text-[#CFC9FF]">
                    Click this icon to add a winner
                  </p>
                </div>
                <div>
                  <h4 className="text-lg text-white">Winners selected</h4>
                  <p className="text-[#CFC9FF]">8/24</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {
                  [...Array(12)].map((i, _) => (
                    <div className="flex justify-between items-center text-white px-4" key={i}>
                      <div className="flex items-center gap-2">
                        <img
                          src="/quest-detail/avatar-quid.png"
                          alt=""
                          className="size-12 rounded-full"
                        />
                        <div className="flex flex-col gap-0 ">
                          <p className="text-[#CFC9FF] text-sm">
                            Submitted 2 days ago
                          </p>
                          <p>Samuel Igboji</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <img src="/quest-detail/stellar-icon.png" alt="" className="size-3"/>
                        <Icon icon={"lucide:heart"} />
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
