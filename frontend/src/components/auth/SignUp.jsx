import React from 'react';
import MainContainer from '../MainContainer';
import Title from '../form/Title';
import FormInput from '../form/FormInput';
import Submit from '../form/Submit';
import { Link } from 'react-router-dom';

export default function SignUp() {
  return (
    <div className="fixed inset-0 bg-primary -z-10 flex justify-center items-center ">
      <MainContainer className={'flex justify-center'}>
        <form className="bg-secondary rounded p-5 w-72 space-y-5">
          <Title>Create Account</Title>
          <FormInput label="First Name" placeholder="John" name="first name" />
          <FormInput label="Last Name" placeholder="Doe" name="last name" />
          <FormInput label="Email" placeholder="john@gmail.com" name="email" />
          <FormInput label="Password" placeholder="*********" name="password" />
          <Submit value={'Create Account'} />
          <div className="flex justify-center">
            <Link
              className="text-dark-subtle hover:text-white transition"
              to="/auth/sign-in"
            >
              Already have an Account?
            </Link>
          </div>
        </form>
      </MainContainer>
    </div>
  );
}
