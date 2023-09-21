import React from 'react';
import { BsFillSunFill } from 'react-icons/bs';
import Screen from '../MainContainer';

export default function Navbar() {
  return (
    <div className="bg-secondary shadow-sm shadow-gray-500">
      <Screen className={'p-2 flex justify-around h-14'}>
        <div className="flex items-center space-x-4">
          <img
            src="./amity-dark-logo.png"
            alt="Amity movie review app logo"
            className="h-10"
          />
          <p className="font-logo text-3xl text-logo">Amity</p>
        </div>
        <ul className="flex items-center space-x-4">
          <li>
            <button className="bg-dark-subtle p-1 rounded hover:bg-white">
              <BsFillSunFill className="text-secondary" size={24} />
            </button>
          </li>
          <li>
            <input
              type="text"
              className="border-2 border-dark-subtle p-1 rounded bg-transparent text-xl outline-none focus:border-white transition text-white"
              placeholder="Search..."
            />
          </li>
          <li>
            <button className="group relative text-white font-semibold py-2 px-4 rounded text-xl">
              Login
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-logo transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400"></span>
            </button>
          </li>
        </ul>
      </Screen>
    </div>
  );
}
