"use client";
import React from "react";
import { IoMdClose } from "react-icons/io";

const PopupPassword = ({ setShowPopup }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div
      onClick={() => setShowPopup(false)}
      className="bg-black/40 flex items-center justify-center fixed inset-0"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-md h-[250px] relative  w-[400px]"
      >
        <span
          onClick={() => setShowPopup(false)}
          className="absolute right-3 top-3 text-2xl cursor-pointer hover:text-red-500"
        >
          <IoMdClose />
        </span>

        <form
          className="flex flex-col gap-5 mx-5 mt-16"
          onSubmit={handleSubmit}
        >
          <input
            placeholder="Enter old password"
            className="border rounded-md px-3 py-1 placeholder:text-sm"
            type="password"
          />
          <input
            placeholder="Enter new password"
            className="border rounded-md px-3 py-1 placeholder:text-sm"
            type="password"
          />
          <button className="px-3 py-1 justify-end text-white bg-black cursor-pointer  rounded-md">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default PopupPassword;
