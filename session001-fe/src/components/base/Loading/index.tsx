import React from "react";
import Lottie from "react-lottie";
import LoaderAnimation from "assets/animation/loader.json";

interface ILoadingProps {
  animation?: string;
}

export const Loading: React.FC<ILoadingProps> = ({ animation }) => {
  return (
    <div className={`flex justify-center h-full w-full items-center`}>
      <div className="w-72 h-1/12">Loading</div>
    </div>
  );
};
