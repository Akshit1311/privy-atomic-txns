import React from "react";

const Input = (
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) => {
  return (
    <input
      className="border border-zinc-800 rounded-lg p-2 outline-none"
      {...props}
    />
  );
};

export default Input;
