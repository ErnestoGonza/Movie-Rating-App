import React, { useState } from 'react';
import { BsFillSunFill, BsMoonFill } from 'react-icons/bs';
import Screen from './MainContainer';
import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks';

export default function Navbar() {
  const { toggleTheme } = useTheme();
  const [theme, setTheme] = useState(localStorage.getItem('theme'));

  return (
    <div className="bg-secondary shadow-sm shadow-gray-500">
      <Screen className={'p-2 flex justify-around h-14'}>
        <Link
          to={'/'}
          className="flex items-center space-x-4"
          style={{
            cursor: 'pointer',
          }}
        >
          <img
            src="./amity-dark-logo.png"
            alt="Amity movie review app logo"
            className="h-8"
          />
          <p className="font-logo text-2xl text-logo">Amity</p>
        </Link>
        <ul className="flex items-center space-x-4">
          <li>
            <button
              onClick={() => {
                toggleTheme();
                setTheme(localStorage.getItem('theme'));
              }}
              className="dark:bg-dark-subtle p-1 rounded dark:hover:bg-white bg-white hover:bg-dark-subtle"
            >
              {theme === 'dark' ? (
                <BsFillSunFill className="text-secondary" size={24} />
              ) : (
                <BsMoonFill className="text-secondary" size={24} />
              )}
            </button>
          </li>
          <li>
            <input
              type="text"
              className="border-2 border-dark-subtle p-1 rounded bg-transparent text-l outline-none focus:border-logo transition text-white"
              placeholder="Search..."
            />
          </li>
          <li>
            <Link
              className="group relative text-white font-semibold py-2 px-4 rounded text-l transition-transform active:bg-logo"
              to="/auth/sign-in"
            >
              Login
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-logo transform scale-x-0 transition-transform group-hover:scale-x-100"></span>
            </Link>
          </li>
        </ul>
      </Screen>
    </div>
  );
}
