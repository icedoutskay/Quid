"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useState } from "react";
const SideMenu = () => {
  const [activeMenu, setActiveMenu] = useState(false);
  return (
    <div className="bg-[#141126] w-[20%] py-2 px-4 h-screen ">
      <div className="flex justify-center items-center gap-5 border-b border-b-neutral-300">
        <svg
          className="size-12"
          viewBox="0 0 85 49"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6.42928 37.6266L10.3292 43.2301H6.69637C2.99812 43.2301 0 40.2522 0 36.5793V12.4702H5.02228V34.9166C5.02228 36.0345 5.57772 37.0234 6.42928 37.6266Z"
            fill="#9011FF"
            className="fill-[#9011FF]"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M18.415 43.0206C21.3032 42.2826 23.4373 39.6782 23.4373 36.5793V6.65078C23.4373 2.97791 20.4392 0 16.7409 0H6.69637C2.99812 0 0 2.97791 0 6.65078V9.14483H5.02228V8.31348C5.02228 6.47704 6.52124 4.98809 8.37047 4.98809H15.0668C16.9161 4.98809 18.415 6.47704 18.415 8.31348V34.9166C18.415 36.753 16.9161 38.242 15.0668 38.242H10.928L18.415 49V43.0206Z"
            fill="#9011FF "
            className="fill-[#9011FF]"
          />
          <path
            d="M44.8858 16.4393H48.2072V42.8828H45.3679L45.2608 38.2538C43.9215 41.6058 41.0287 43.4148 37.0109 43.4148C31.9216 43.4148 29.2966 40.4353 29.2966 34.689V16.4393H32.618V34.2101C32.618 38.4666 34.3323 40.5417 37.868 40.5417C42.3144 40.5417 44.8858 37.5089 44.8858 32.3479V16.4393Z"
            fill="white"
            className="dark:fill-white fill-gray-900"
          />
          <path
            d="M55.3573 11.3847V5.58517H58.6786V11.3847H55.3573ZM55.3037 42.8828V16.4393H58.6251V42.8828H55.3037Z"
            fill="white"
            className="dark:fill-white fill-gray-900"
          />
          <path
            d="M85 42.8828H81.9465C81.625 42.0847 81.4643 40.4885 81.4107 38.3602C80.0179 41.6058 77.1251 43.4148 73.0537 43.4148C67.8037 43.4148 65.1787 40.4353 65.1787 34.7422V24.633C65.1787 18.8867 67.8037 15.9072 73.0537 15.9072C76.8036 15.9072 79.5893 17.4502 81.0893 20.2701V5.63838H84.4107V35.8595C84.4107 39.0519 84.5714 41.393 85 42.8828ZM73.9108 40.5417C78.4643 40.5417 81.0893 37.5089 81.0893 32.3479V26.9741C81.0893 21.8131 78.4643 18.7803 73.9108 18.7803C70.2144 18.7803 68.5001 20.8554 68.5001 25.1119V34.2101C68.5001 38.4666 70.2144 40.5417 73.9108 40.5417Z"
            fill="white"
            className="dark:fill-white fill-gray-900"
          />
        </svg>
        <h5 className="text-base font-medium text-[#CFC9FF]">Creators</h5>
      </div>
      <div className="pt-6">
        <div
          className={`flex justify-normal items-center gap-3 ${activeMenu ? "text-white" : "text-[#8C86B8]"} mb-6 cursor-pointer`}
        >
          <Icon icon={"lucide:layout-dashboard"} />
          <p className="">Dashboard</p>
        </div>
        <Link
          href={"/creator/dashboard/quests"}
          className={`flex justify-normal items-center gap-3 ${activeMenu ? "text-white" : "text-[#8C86B8]"} mb-6 cursor-pointer`}
        >
          <Icon icon={"lucide:file-text"} />
          <p className="">Quests</p>
        </Link>
        <div
          className={`flex justify-normal items-center gap-3 ${activeMenu ? "text-white" : "text-[#8C86B8]"} mb-6 cursor-pointer`}
        >
          <Icon icon={"lucide:wallet"} />
          <p className="">Wallet</p>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
