import React from 'react';
import { ImSpinner8 } from 'react-icons/im';

export default function Submit({ value, busy }) {
  return (
    <button
      type="submit"
      className="w-full rounded dark:bg-white dark:hover:bg-gray-200 bg-secondary dark:text-secondary text-white  hover:bg-opacity-90 transition font-semibold text-lg cursor-pointer h-10 flex items-center justify-center"
    >
      {busy ? <ImSpinner8 className="animate-spin" /> : value}
    </button>
  );
}
