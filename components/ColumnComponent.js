import { Box, Text, VStack } from '@chakra-ui/react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

export default function ColumnComponent({ columnId, column }) {
    return (
        <Box border="1px solid black" minH="500" maxH="500" overflow="auto">
            <Text bg="tomato" fontSize="2xl" fontWeight="bold" align="center" p="2">
                {column?.name}
            </Text>
            <Droppable droppableId={columnId}>
                {(droppableProvided, droppableSnapshot) => (
                    <Box ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
                        <VStack spacing="4" align="stretch" p="4">
                            {column?.items?.map((item, index) => (
                                <Draggable key={item?.id} draggableId={item?.id} index={index}>
                                    {(draggableProvided, draggableSnapshot) => (
                                        <Box
                                            bg="blackAlpha.200"
                                            color="blackAlpha.600"
                                            fontSize="lg"
                                            fontWeight="semibold"
                                            align="center"
                                            p="2"
                                            border="1px solid black"
                                            ref={draggableProvided.innerRef}
                                            {...draggableProvided.draggableProps}
                                            {...draggableProvided.dragHandleProps}
                                        >
                                            <Text>{item?.label}</Text>
                                        </Box>
                                    )}
                                </Draggable>
                            ))}
                        </VStack>
                        {droppableProvided.placeholder}
                    </Box>
                )}
            </Droppable>
        </Box>
    );
}
