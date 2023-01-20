import { createSlice, current, nanoid } from '@reduxjs/toolkit';

const initialState = {
    'column-01': {
        name: 'To do',
        items: [],
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

export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        loadTasks: (state) => {
            const currentState = current(state);

            let localBoard = localStorage.getItem('board');
            localBoard = localBoard ? JSON.parse(localBoard) : {};
            return Object.keys(localBoard).length ? localBoard : currentState;
        },
        addNewTask: (state, { payload }) => {
            const getFirstColumn = Object.values(state)[0];
            const tasks = getFirstColumn.items;
            tasks.push({ id: nanoid(), label: payload });

            state = {
                ...state,
                [Object.keys(state)[0]]: {
                    ...getFirstColumn,
                    items: tasks,
                },
            };

            localStorage.setItem('board', JSON.stringify(state));
        },

        handleOnDragEnd: (state, { payload }) => {
            const status = current(state);

            const { source, destination } = payload;

            if (
                !destination ||
                (destination.droppableId === source.droppableId &&
                    destination.index === source.index)
            ) {
                return status;
            }
            if (source.droppableId !== destination.droppableId) {
                const sourceColumn = status[source.droppableId];
                const destinationColumn = status[destination.droppableId];

                const sourceItems = [...sourceColumn.items];
                const destItems = [...destinationColumn.items];

                const [removedItem] = sourceItems.splice(source.index, 1);
                destItems.splice(destination.index, 0, removedItem);

                const tempState = {
                    ...status,
                    [source.droppableId]: {
                        ...sourceColumn,
                        items: sourceItems,
                    },
                    [destination.droppableId]: {
                        ...destinationColumn,
                        items: destItems,
                    },
                };

                localStorage.setItem('board', JSON.stringify(tempState));
                return tempState;
            }
            const column = status[source.droppableId];

            const copiedItems = [...column.items];

            const [removedItem] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removedItem);

            const tempState = {
                ...status,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems,
                },
            };

            localStorage.setItem('board', JSON.stringify(tempState));
            return tempState;
        },
    },
});

export const { loadTasks, addNewTask, handleOnDragEnd } = taskSlice.actions;

export default taskSlice.reducer;
