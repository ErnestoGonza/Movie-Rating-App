import React, { useEffect, useState } from 'react';
import MainContainer from '../user/MainContainer';
import Title from '../form/Title';
import FormInput from '../form/FormInput';
import Submit from '../form/Submit';
import { commonModalClasses } from '../../utils/theme';
import FormContainer from '../form/FormContainer';
import { CustomLink } from '../form/CustomLink';
import { errorNotification } from '../../context/Notification';
import { useAuth } from '../../hooks';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const { handleLogin, authInfo } = useAuth();
  const { isPending, isLoggedIn } = authInfo;

  const handleChange = ({ target }) => {
    const { value, name } = target;

    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateUserInfo = ({ email, password }) => {
    const isValidEmail =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!email.trim()) return { ok: false, error: 'Email is missing!' };
    if (!isValidEmail.test(email))
      return { ok: false, error: 'Invalid email!' };

    if (!password.trim()) return { ok: false, error: 'Password is missing!' };
    if (password.length < 8 || password.length > 20)
      return {
        ok: false,
        error: 'Password must be between 8 - 20 characters!',
      };

    return { ok: true };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validUser = validateUserInfo(userInfo);

    if (!validUser.ok) errorNotification(validUser.error);

    handleLogin(userInfo.email, userInfo.password);

    if (authInfo.error) errorNotification(authInfo.error);
  };

  useEffect(() => {
    if (isLoggedIn) navigate('/'); // Navigate somewhere
  }, [isLoggedIn, navigate]);

  return (
    <FormContainer>
      <MainContainer className={'flex justify-center'}>
        <form onSubmit={handleSubmit} className={`${commonModalClasses} w-72`}>
          <Title>Sign In</Title>
          <FormInput
            value={userInfo.email}
            onChange={handleChange}
            label="Email"
            placeholder="john@gmail.com"
            name="email"
          />
          <FormInput
            value={userInfo.password}
            onChange={handleChange}
            label="Password"
            placeholder="*********"
            name="password"
            type="password"
          />
          <Submit value={'Sign In'} busy={isPending} />
          <div className="flex justify-between">
            <CustomLink to="/auth/forgot-password">Forgot Password</CustomLink>
            <CustomLink to="/auth/sign-up">Sign up</CustomLink>
          </div>
        </form>
      </MainContainer>
    </FormContainer>
  );
}
