/* eslint-disable */

import {
    Box,
    Button,
    Center,
    Container,
    HStack,
    Input,
    SimpleGrid, Text
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
/* eslint-enable */

// eslint-disable-next-line import/extensions
const ColumnComponent = dynamic(() => import('@/components/ColumnComponent'), { ssr: false });

export default function Home() {
    const initialTasks = [
        { id: uuidv4(), label: 'Task 01' },
        { id: uuidv4(), label: 'Task 02' },
        { id: uuidv4(), label: 'Task 03' },
    ];
    const columns = {
        'column-01': {
            name: 'To do',
            items: initialTasks,
        },
        'column-02': {
            name: 'In Progress',
            items: [],
        },
        'column-03': {
            name: 'Done',
            items: [],
        },
    };

    const [status, setStatus] = useState(columns);
    const [tasks, setTasks] = useState(initialTasks);
    const [newTask, setNewTask] = useState('');

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) return;

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = status[source.droppableId];
            const destinationColumn = status[destination.droppableId];

            const sourceItems = [...sourceColumn.items];
            const destItems = [...destinationColumn.items];

            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);

            setStatus({
                ...status,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems,
                },
                [destination.droppableId]: {
                    ...destinationColumn,
                    items: destItems,
                },
            });
        } else {
            const column = status[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);

            setStatus({
                ...status,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems,
                },
            });
        }
    };

    const handleOnSubmit = (event) => {
        event.preventDefault();
        tasks.push({ id: uuidv4(), label: newTask });
        setTasks(tasks);
        setNewTask('');
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
                            {Object?.entries(status)?.map(([columnId, column]) => (
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
