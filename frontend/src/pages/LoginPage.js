import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Link
} from '@chakra-ui/react';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const { username, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ username, password });
    } catch (err) {
      setError(err.message || 'Login failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="450px" mx="auto" mt={{ base: "2rem", md: "4rem" }} p="8" bg="white" borderRadius="lg" boxShadow="md">
      <VStack spacing={4} as="form" onSubmit={onSubmit}>
        <Heading as="h1" size="lg" textAlign="center">
          Selamat Datang Kembali!
        </Heading>

        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <FormControl isRequired>
          <FormLabel>Username</FormLabel>
          <Input id="username" name="username" type="text" value={username} onChange={onChange}/>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input id="password" name="password" type="password" value={password} onChange={onChange}/>
        </FormControl>

        <Button type="submit" colorScheme="purple" width="full" mt="4" isLoading={loading}>
          Login
        </Button>
      </VStack>
      <Text mt="6" textAlign="center" fontSize="sm">
        Belum punya akun?{' '}
        <Link as={RouterLink} to="/register" color="purple.500" fontWeight="bold">
          Daftar di sini
        </Link>
      </Text>
    </Box>
  );
};

export default LoginPage;