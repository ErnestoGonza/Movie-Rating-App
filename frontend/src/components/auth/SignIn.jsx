import React from 'react';
import MainContainer from '../MainContainer';
import Title from '../form/Title';
import FormInput from '../form/FormInput';
import Submit from '../form/Submit';

export default function SignIn() {
  return (
    <div className="fixed inset-0 bg-primary -z-10 flex justify-center items-center ">
      <MainContainer className={'flex justify-center'}>
        <form className="bg-secondary rounded p-5 w-72 space-y-5">
          <Title>Sign In</Title>
          <FormInput label="Email" placeholder="john@gmail.com" name="email" />
          <FormInput label="Password" placeholder="*********" name="password" />
          <Submit value={'Sign In'} />
          <div className="flex justify-between">
            <a
              className="text-dark-subtle hover:text-white transition"
              href="/#"
            >
              Forgot Password
            </a>
            <a
              className="text-dark-subtle hover:text-white transition"
              href="/sign-up"
            >
              Sign up
            </a>
          </div>
        </form>
      </MainContainer>
    </div>
  );
}
