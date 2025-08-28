import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  loginUserThunk,
  selectLoginError,
  selectStatus
} from '../../services/slices/userSlice';
import { Preloader } from '@ui';
import { useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const loginError = useSelector(selectLoginError);
  const status = useSelector(selectStatus);
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUserThunk({ email, password }));
  };

  if (status === 'loading') {
    return <Preloader />;
  }

  if (status === 'completed') {
    navigate('/profile');
  }

  return (
    <LoginUI
      errorText={loginError ? loginError : ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
