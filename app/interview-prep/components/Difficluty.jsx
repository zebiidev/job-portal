import React from "react";

const Difficluty = ({ onSelectDifficulty, selectedDifficulty }) => {
  const difficulty = ["Easy", "Medium", "Hard"];

  return (
    <div className="w-full min-h-screen flex mt-6 justify-center">
      <div className="bg-gray-100 w-[80vw] md:w-[30vw] h-[300px] rounded-md">
        <h1 className="px-4 py-3 text-xl font-medium">Select Difficulty</h1>
        <hr className="mx-4" />

        <div className="px-4 flex items-center gap-4 mt-9">
          {difficulty.map((item, idx) => {
            const isSelected = selectedDifficulty === item;
            return (
              <div
                onClick={() => onSelectDifficulty(item, idx)}
                className={`px-3 rounded-md py-1 cursor-pointer ${
                  isSelected ? "bg-blue-400" : "bg-gray-500"
                }`}
                key={idx}
              >
                {item}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Difficluty;
