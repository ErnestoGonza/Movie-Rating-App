import React from 'react';
import MainContainer from '../MainContainer';

export default function SignIn() {
  return (
    <div className="fixed inset-0 bg-primary -z-10 flex justify-center items-center ">
      <MainContainer className={'flex justify-center'}>
        <form className="bg-secondary rounded p-6 w-72">
          <h1 className="text-xl text-white font-semibold text-center">
            Sign In
          </h1>
          <div className="flex flex-col-reverse">
            <input
              type="text"
              id="email"
              className="bg-transparent rounded border-2 border-dark-subtle w-full text-lg outline-none focus:border-white p-1 text-white peer transition"
              placeholder="Enter Email"
            />
            <label
              className="font-semibold text-dark-subtle peer-focus:text-white transition self-start hover:cursor-pointer"
              htmlFor="email"
            >
              Email
            </label>
          </div>
        </form>
      </MainContainer>
    </div>
  );
}
