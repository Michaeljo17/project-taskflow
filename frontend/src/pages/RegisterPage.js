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

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    password2: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const { username, password, password2 } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      return setError('Password tidak cocok');
    }
    setError('');
    setLoading(true);
    try {
      await register({ username, password });
      // Navigasi ke dashboard sudah diurus oleh context
    } catch (err) {
      setError(err.message || 'Pendaftaran gagal!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="450px" mx="auto" mt={{ base: "2rem", md: "4rem" }} p="8" bg="white" borderRadius="lg" boxShadow="md">
      <VStack spacing={4} as="form" onSubmit={onSubmit}>
        <Heading as="h1" size="lg" textAlign="center">
          Buat Akun Baru
        </Heading>

        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <FormControl isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            name="username"
            type="text"
            value={username}
            onChange={onChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            name="password"
            type="password"
            value={password}
            onChange={onChange}
            minLength={6}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Konfirmasi Password</FormLabel>
          <Input
            name="password2"
            type="password"
            value={password2}
            onChange={onChange}
            minLength={6}
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="purple"
          width="full"
          mt="4"
          isLoading={loading}
        >
          Daftar
        </Button>
      </VStack>
      <Text mt="6" textAlign="center" fontSize="sm">
        Sudah punya akun?{' '}
        <Link as={RouterLink} to="/login" color="purple.500" fontWeight="bold">
          Login di sini
        </Link>
      </Text>
    </Box>
  );
};

export default RegisterPage;