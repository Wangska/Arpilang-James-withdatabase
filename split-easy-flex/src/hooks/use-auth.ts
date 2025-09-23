import axios from 'axios';
import { useState } from 'react';

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (
    firstName: string,
    lastName: string,
    nickname: string,
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('http://localhost:8000/signup', {
        firstName,
        lastName,
        nickname,
        username,
        email,
        password,
        confirmPassword
      }, { withCredentials: true });
      setLoading(false);
      return res.data;
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.error || 'Signup failed');
      throw err;
    }
  };

  return { signup, loading, error };
}

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('http://localhost:8000/login', {
        email,
        password,
      }, { withCredentials: true });
      setLoading(false);
      return res.data;
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return { login, loading, error };
}
