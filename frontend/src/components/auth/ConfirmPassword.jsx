import React from 'react';
import MainContainer from '../user/MainContainer';
import Title from '../form/Title';
import FormInput from '../form/FormInput';
import Submit from '../form/Submit';
import { commonModalClasses } from '../../utils/theme';
import FormContainer from '../form/FormContainer';

export default function ConfirmPassword() {
  return (
    <FormContainer>
      <MainContainer className={'flex justify-center'}>
        <form className={`${commonModalClasses} w-72`}>
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
    </FormContainer>
  );
}
