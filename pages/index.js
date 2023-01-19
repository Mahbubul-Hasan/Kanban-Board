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
// import { v4 as uuidv4 } from 'uuid';
/* eslint-enable */

// eslint-disable-next-line import/extensions
const ColumnComponent = dynamic(() => import('@/components/ColumnComponent'), { ssr: false });

// const tasks = [
//     { id: uuidv4(), label: 'Task 01' },
//     { id: uuidv4(), label: 'Task 02' },
//     { id: uuidv4(), label: 'Task 03' },
// ];
// const columns = {
//     [uuidv4()]: {
//         name: 'To do',
//         items: tasks,
//     },
//     [uuidv4()]: {
//         name: 'In Progress',
//         items: [],
//     },
//     [uuidv4()]: {
//         name: 'Done',
//         items: [],
//     },
// };
const tasks = [
    { id: 'task-01', label: 'Task 01' },
    { id: 'task-02', label: 'Task 02' },
    { id: 'task-03', label: 'Task 03' },
];
const columns = {
    'column-01': {
        name: 'To do',
        items: tasks,
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

export default function Home() {
    const [status, setStatus] = useState(columns);

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) return;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = status[source.droppableId];
            const destColumn = status[destination.droppableId];

            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];

            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);

            setStatus({
                ...status,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems,
                },
                [destination.droppableId]: {
                    ...destColumn,
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

    return (
        <>
            <Head>
                <title>Kanban Board</title>
            </Head>

            <Container maxW="7xl" p="4" overflow="hidden">
                <Center h="40px" color="white">
                    <HStack spacing="4">
                        <Input
                            placeholder="Write your task ..."
                            borderRadius="none"
                            border="1px solid black"
                        />
                        <Button borderRadius="none" px="8" border="1px solid black" bg="white">
                            <Text color="red.500" fontWeight="semibold">
                                Add
                            </Text>
                        </Button>
                    </HStack>
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
