import { addNewTask, handleOnDragEnd, loadTasks } from '@/app/features/task/taskSlice';
import { Box, Button, Center, Container, HStack, Input, SimpleGrid, Text } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';

const ColumnComponent = dynamic(() => import('@/components/ColumnComponent'), { ssr: false });

export default function Home() {
    const columns = useSelector((state) => state.task);
    const dispatch = useDispatch();

    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        dispatch(loadTasks());
    }, []);

    const handleOnSubmit = (event) => {
        event.preventDefault();

        dispatch(addNewTask(newTask));

        setNewTask('');
    };

    const onDragEnd = (result) => {
        dispatch(handleOnDragEnd(result));
    };

    return (
        <>
            <Head>
                <title>Kanban Board</title>
            </Head>

            <Container maxW="7xl" p="4" overflow="hidden">
                <Center h="40px" color="white">
                    <form onSubmit={handleOnSubmit}>
                        <HStack spacing="4">
                            <Input
                                placeholder="Write your task ..."
                                borderRadius="none"
                                border="1px solid black"
                                color="blackAlpha.600"
                                ontSize="lg"
                                fontWeight="semibold"
                                name="task"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                            />
                            <Button
                                type="submit"
                                borderRadius="none"
                                px="8"
                                border="1px solid black"
                                bg="white"
                            >
                                <Text color="red.500" fontWeight="semibold">
                                    Add
                                </Text>
                            </Button>
                        </HStack>
                    </form>
                </Center>

                <Box pt="6">
                    <DragDropContext onDragEnd={onDragEnd}>
                        <SimpleGrid columns="3" spacing={10}>
                            {Object?.entries(columns)?.map(([columnId, column]) => (
                                <ColumnComponent
                                    key={columnId}
                                    columnId={columnId}
                                    column={column}
                                />
                            ))}
                        </SimpleGrid>
                    </DragDropContext>
                </Box>
            </Container>
        </>
    );
}
