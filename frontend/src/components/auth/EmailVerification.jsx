import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainContainer from '../user/MainContainer';
import Title from '../form/Title';
import Submit from '../form/Submit';
import { commonModalClasses } from '../../utils/theme';
import FormContainer from '../form/FormContainer';
import { verifyUserEmail } from '../../api/auth';
import {
  errorNotification,
  successNotificaiton,
} from '../../context/Notification';
import { useAuth } from '../../hooks';

const OTP_LENGTH = 6;

const isValidOTP = (otp) => {
  let valid = false;

  for (let el of otp) {
    valid = !isNaN(parseInt(el));
    if (!valid) break;
  }

  return valid;
};

export default function EmailVerification() {
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(''));
  const inputRefs = useRef(Array(OTP_LENGTH).fill(null));
  const navigate = useNavigate();
  const { isAuth, authInfo } = useAuth();
  const { isLoggedIn } = authInfo;

  const { state } = useLocation();
  const user = state?.user;

  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);

  useEffect(() => {
    if (!user) navigate('/not-found');
    if (isLoggedIn) navigate('/');
  }, [user, isLoggedIn, navigate]);

  const handleInputChange = (event, index) => {
    const value = event.target.value;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value.length === 1 && index < OTP_LENGTH - 1) {
      // Move focus to the next input
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = ({ key }, index) => {
    if (key === 'Backspace' && index > 0) {
      if (otp[index] === '') {
        // If the current input is empty, focus on the previous input
        inputRefs.current[index - 1].focus();
      } else {
        // If the current input is not empty, delete its value
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidOTP(otp)) {
      return errorNotification('Invalid OTP');
    } else {
      const {
        error,
        message,
        user: verifiedUser,
      } = await verifyUserEmail({
        userId: user.id,
        OTP: otp.join(''),
      });

      if (error) return errorNotification(error);

      successNotificaiton(message);
      localStorage.setItem('auth-token', verifiedUser.token);
      isAuth();
    }
  };

  return (
    <FormContainer>
      <MainContainer className={'flex justify-center'}>
        <form onSubmit={handleSubmit} className={`${commonModalClasses}`}>
          <div>
            <Title>Please enter your 6-digit verificaiton code</Title>
            <p className="text-center dark:text-dark-subtle text-light-subtle">
              Code has been sent to your email
            </p>
          </div>
          <div className="flex justify-center items-center space-x-4">
            {otp.map((_, index) => {
              return (
                <input
                  type="tel"
                  min="0"
                  max="9"
                  step="1"
                  maxLength="1"
                  key={index}
                  ref={(input) => (inputRefs.current[index] = input)}
                  value={otp[index]}
                  onChange={(event) => handleInputChange(event, index)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  className="w-12 h-12 border-2 rounded dark:border-dark-subtle border-light-subtle dark:focus:border-logo focus:border-logo bg-transparent outline-none text-center dark:text-white text-primary font-semibold"
                />
              );
            })}
          </div>
          <Submit value={'Verify Account'} />
        </form>
      </MainContainer>
    </FormContainer>
  );
}
