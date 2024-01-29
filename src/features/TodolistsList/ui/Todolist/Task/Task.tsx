import React, { ChangeEvent, useCallback } from "react";
import { Checkbox, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { TaskType } from "features/TodolistsList/api/todolistsApi";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { TaskStatuses } from "common/enum";
import { useActions } from "common/hooks";
import { tasksThunks } from "features/TodolistsList/model/tasks/tasksSlice";

type Props = {
  task: TaskType;
  todolistId: string;
};
export const Task = React.memo(({ task, todolistId }: Props) => {
  const { removeTaskTC, updateTaskTC } = useActions(tasksThunks);

  const removeTask = () => removeTaskTC({ taskId: task.id, todolistId });

  const updateTaskStatus = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let newIsDoneValue = e.currentTarget.checked;
      updateTaskTC({
        taskId: task.id,
        model: { status: newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New },
        todolistId,
      });
    },
    [task.id, todolistId],
  );

  const changeTaskTitle = useCallback(
    (newValue: string) => {
      updateTaskTC({ taskId: task.id, model: { title: newValue }, todolistId });
    },
    [task.id, todolistId],
  );

  return (
    <div key={task.id} className={task.status === TaskStatuses.Completed ? "is-done" : ""}>
      <Checkbox checked={task.status === TaskStatuses.Completed} color="primary" onChange={updateTaskStatus} />

      <EditableSpan value={task.title} onChange={changeTaskTitle} />
      <IconButton onClick={removeTask}>
        <Delete />
      </IconButton>
    </div>
  );
});
