import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  registerUserThunk,
  selectRegisterError,
  selectStatus
} from '../../services/slices/userSlice';
import { Preloader } from '@ui';
import { useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const registerError = useSelector(selectRegisterError);
  const status = useSelector(selectStatus);
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerUserThunk({ name: userName, email, password }));
  };

  if (status === 'loading') {
    return <Preloader />;
  }

  if (status === 'completed') {
    navigate('/profile');
  }

  return (
    <RegisterUI
      errorText={registerError ? registerError : ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
