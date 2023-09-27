import React from 'react';
import MainContainer from '../MainContainer';
import Title from '../form/Title';
import FormInput from '../form/FormInput';
import Submit from '../form/Submit';

export default function ConfirmPassword() {
  return (
    <div className="fixed inset-0 dark:bg-primary -z-10 flex justify-center items-center ">
      <MainContainer className={'flex justify-center'}>
        <form className="dark:bg-secondary rounded p-5 w-72 space-y-5">
          <Title>Enter New Password</Title>
          <FormInput
            label="New Password"
            placeholder="********"
            name="password"
            type="password"
          />
          <FormInput
            label="Confirm Password"
            placeholder="********"
            name="confirmPassword"
            type="password"
          />
          <Submit value={'Change Password'} />
        </form>
      </MainContainer>
    </div>
  );
}
