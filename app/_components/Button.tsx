import React from "react";
import { cn } from "../_utils";

const Button = (
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) => {
  return (
    <button
      {...props}
      className={cn(
        "bg-zinc-800 text-zinc-300 p-2 rounded-lg w-full hover:opacity-75 cursor-pointer font-medium",
        props.className
      )}
    >
      {props.children}
    </button>
  );
};

export default Button;
