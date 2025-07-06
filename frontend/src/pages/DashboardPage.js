import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import TaskForm from '../components/TaskForm'; // Kita masih pakai komponen lama untuk sementara
import TaskList from '../components/TaskList'; // Kita masih pakai komponen lama untuk sementara
import { taskAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Grid,
  GridItem,
  Link,
  Spinner,
  Alert,
  AlertIcon
} from '@chakra-ui/react';

// Komponen kecil untuk kartu statistik
const StatCard = ({ title, value }) => (
  <Box p={5} bg="white" shadow="md" borderWidth="1px" borderRadius="lg">
    <Heading fontSize="3xl" color="purple.500">{value}</Heading>
    <Text mt={2} color="gray.500" fontWeight="medium">{title}</Text>
  </Box>
);

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, highPriority: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, logout } = useAuth();

  const displayMessage = (setter, message) => { /* ... (fungsi sama seperti sebelumnya) ... */ };
  const loadData = useCallback(async () => { /* ... (fungsi sama seperti sebelumnya) ... */ }, [user, logout]);
  useEffect(() => { loadData(); }, [loadData]);
  const handleTaskAction = async (action, successMsg, ...args) => { /* ... (fungsi sama seperti sebelumnya) ... */ };
  const handleTaskCreated = (data) => handleTaskAction(taskAPI.createTask, 'Task created successfully!', data);
  const handleTaskUpdate = (id, data) => handleTaskAction(taskAPI.updateTask, 'Task updated successfully!', id, data);
  const handleTaskDelete = (id) => { /* ... (fungsi sama seperti sebelumnya) ... */ };

  return (
    // Gunakan Container untuk layout utama
    <Container maxW="container.xl" py={{ base: 4, md: 8 }}>
      <VStack spacing={8}>
        {/* HEADER */}
        <VStack as="header" spacing={3}>
          <Heading as="h1" size="2xl" bgGradient="linear(to-r, purple.500, blue.500)" bgClip="text">
            TaskFlow
          </Heading>
          <HStack spacing={4}>
            <Text fontSize="lg">Selamat datang, **{user?.username}**!</Text>
            <Link as={RouterLink} to="/settings">
              <Button size="sm" variant="ghost">Pengaturan</Button>
            </Link>
            <Button onClick={logout} colorScheme="red" size="sm">Logout</Button>
          </HStack>
        </VStack>

        {/* PESAN ERROR & SUKSES */}
        {error && <Alert status="error" borderRadius="md"><AlertIcon />{error}</Alert>}
        {success && <Alert status="success" borderRadius="md"><AlertIcon />{success}</Alert>}

        {/* KARTU STATISTIK */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} width="full">
          <StatCard title="Total Tasks" value={stats.total} />
          <StatCard title="Completed" value={stats.completed} />
          <StatCard title="Pending" value={stats.pending} />
          <StatCard title="High Priority" value={stats.highPriority} />
        </SimpleGrid>

        {/* KONTEN UTAMA (FORM & LIST) */}
        <Grid templateColumns={{ base: "1fr", lg: "1fr 2fr" }} gap={8} width="full">
          <GridItem>
            <Box bg="white" p={6} borderRadius="lg" shadow="md">
              <TaskForm onTaskCreated={handleTaskCreated} />
            </Box>
          </GridItem>
          <GridItem>
            <Box bg="white" p={6} borderRadius="lg" shadow="md">
              {loading ? (
                <VStack justify="center" align="center" h="200px">
                  <Spinner size="xl" color="purple.500" />
                </VStack>
              ) : (
                <TaskList
                  tasks={tasks}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskDelete={handleTaskDelete}
                />
              )}
            </Box>
          </GridItem>
        </Grid>
      </VStack>
    </Container>
  );
};

export default DashboardPage;