import React from 'react';
import { BsFillSunFill } from 'react-icons/bs';
import Screen from '../MainContainer';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="bg-secondary shadow-sm shadow-gray-500">
      <Screen className={'p-2 flex justify-around h-14'}>
        <div
          onClick={() => navigate('/')}
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
              className="border-2 border-dark-subtle p-1 rounded bg-transparent text-l outline-none focus:border-white transition text-white"
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
