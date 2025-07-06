import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Alert,
  AlertIcon,
  Link,
  Divider
} from '@chakra-ui/react';

const SettingsPage = () => {
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
  const [newUsername, setNewUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { updateUsername } = useAuth();
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isUsernameLoading, setIsUsernameLoading] = useState(false);

  const onPasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  const onUsernameChange = (e) => setNewUsername(e.target.value);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setIsPasswordLoading(true);
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError('Password baru dan konfirmasi tidak cocok!');
      setIsPasswordLoading(false);
      return;
    }
    try {
      const response = await authService.updatePassword({ oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword });
      setSuccess(response.message);
      setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      setError(err.message || 'Gagal memperbarui password.');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setIsUsernameLoading(true);
    try {
      const response = await updateUsername({ newUsername });
      setSuccess(response.message);
      setNewUsername('');
    } catch (err) {
      setError(err.message || 'Gagal memperbarui username.');
    } finally {
      setIsUsernameLoading(false);
    }
  };

  return (
    <Box maxW="450px" mx="auto" mt={{ base: "2rem", md: "4rem" }} p="8" bg="white" borderRadius="lg" boxShadow="md">
      <Link as={RouterLink} to="/" color="purple.500" fontSize="sm" fontWeight="bold">
        ← Kembali ke Dashboard
      </Link>

      <VStack spacing={6} mt={6} align="stretch">
        {/* FORM GANTI PASSWORD */}
        <VStack as="form" onSubmit={handlePasswordSubmit} spacing={4}>
          <Heading as="h2" size="md" textAlign="center">Ganti Password</Heading>
          <FormControl isRequired>
            <FormLabel fontSize="sm">Password Saat Ini</FormLabel>
            <Input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={onPasswordChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel fontSize="sm">Password Baru</FormLabel>
            <Input type="password" name="newPassword" value={passwordData.newPassword} onChange={onPasswordChange} minLength={6} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel fontSize="sm">Konfirmasi Password Baru</FormLabel>
            <Input type="password" name="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={onPasswordChange} minLength={6} />
          </FormControl>
          <Button type="submit" colorScheme="purple" width="full" isLoading={isPasswordLoading}>
            Update Password
          </Button>
        </VStack>

        <Divider />

        {/* FORM GANTI USERNAME */}
        <VStack as="form" onSubmit={handleUsernameSubmit} spacing={4}>
          <Heading as="h2" size="md" textAlign="center">Ganti Username</Heading>
          <FormControl isRequired>
            <FormLabel fontSize="sm">Username Baru</FormLabel>
            <Input type="text" name="newUsername" value={newUsername} onChange={onUsernameChange} />
          </FormControl>
          <Button type="submit" colorScheme="purple" width="full" isLoading={isUsernameLoading}>
            Update Username
          </Button>
        </VStack>
      </VStack>

      {/* Menampilkan pesan error atau sukses */}
      {(error || success) && (
        <Alert status={error ? 'error' : 'success'} borderRadius="md" mt={6}>
          <AlertIcon />
          {error || success}
        </Alert>
      )}
    </Box>
  );
};

export default SettingsPage;