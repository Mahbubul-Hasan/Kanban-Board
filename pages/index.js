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
/* eslint-enable */

// eslint-disable-next-line import/extensions
const ColumnComponent = dynamic(() => import('@/components/ColumnComponent'), { ssr: false });

const tasks = [
    { id: 1, label: 'Task 01' },
    { id: 2, label: 'Task 02' },
    { id: 3, label: 'Task 03' },
];
const columns = {
    'column-1': {
        name: 'To do',
        items: tasks,
    },
    'column-2': {
        name: 'In Progress',
        items: [],
    },
    'column-3': {
        name: 'Done',
        items: [],
    },
};

export default function Home() {
    const [status, setStatus] = useState(columns);

    const onDragEnd = (result) => true;

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

                <DragDropContext onDragEnd={onDragEnd}>
                    <Box pt="6">
                        <SimpleGrid columns="3" spacing={10}>
                            {Object?.entries(status)?.map(([columnId, column]) => (
                                <Box
                                    border="1px solid black"
                                    key={columnId}
                                    minH="500"
                                    maxH="500"
                                    overflow="auto"
                                >
                                    <Text
                                        bg="tomato"
                                        fontSize="2xl"
                                        fontWeight="bold"
                                        align="center"
                                        p="2"
                                    >
                                        {column?.name}
                                    </Text>

                                    <ColumnComponent columnId={columnId} column={column} />
                                </Box>
                            ))}
                        </SimpleGrid>
                    </Box>
                </DragDropContext>
            </Container>
        </>
    );
}
