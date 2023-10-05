import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainContainer from '../user/MainContainer';
import Title from '../form/Title';
import FormInput from '../form/FormInput';
import Submit from '../form/Submit';
import { commonModalClasses } from '../../utils/theme';
import FormContainer from '../form/FormContainer';
import { errorNotification } from '../../context/Notification';
import { verifyPasswordResetToken } from '../../api/auth';
import { ImSpinner8 } from 'react-icons/im';

export default function ConfirmPassword() {
  const [password, setPassword] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const userId = searchParams.get('id');

  const navigate = useNavigate();

  const handleChange = ({ target }) => {
    const { value, name } = target;

    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  const isValidToken = useCallback(async () => {
    const { error, valid } = await verifyPasswordResetToken(token, userId);
    setIsVerifying(false);
    if (error) {
      navigate('/auth/reset-password', { replace: true });
      return errorNotification(error);
    }

    if (!valid) {
      setIsValid(false);
      return navigate('/auth/reset-password', { replace: true });
    }

    setIsValid(true);
  }, [navigate, token, userId]);

  useEffect(() => {
    isValidToken();
  }, [isValidToken]);

  if (isVerifying)
    return (
      <FormContainer>
        <MainContainer className={'flex justify-center'}>
          <h1 className="text-4xl font-semibold dark:text-white text-primary flex flex-col justify-center items-center gap-4">
            Please wait while we verify your token!
            <ImSpinner8 className="animate-spin" />
          </h1>
        </MainContainer>
      </FormContainer>
    );

  if (!isValid)
    return (
      <FormContainer>
        <MainContainer className={'flex justify-center'}>
          <h1 className="text-4xl font-semibold dark:text-white text-primary flex flex-col justify-center items-center gap-4">
            Sorry the password reset token is invalid!
          </h1>
        </MainContainer>
      </FormContainer>
    );

  return (
    <FormContainer>
      <MainContainer className={'flex justify-center'}>
        <form className={`${commonModalClasses} w-72`}>
          <Title>Enter New Password</Title>
          <FormInput
            label="New Password"
            onChange={handleChange}
            value={password.newPassword}
            placeholder="********"
            name="newPassword"
            type="password"
          />
          <FormInput
            label="Confirm Password"
            onChange={handleChange}
            value={password.confirmPassword}
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
