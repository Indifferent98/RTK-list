import React, { ChangeEvent, useCallback } from "react";
import { Checkbox, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { TaskType } from "features/TodolistsList/api/todolistsApi";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { TaskStatuses } from "common/enum";
import { useActions } from "common/hooks";
import { tasksThunks } from "features/TodolistsList/model/tasks/tasksSlice";

type TaskPropsType = {
  task: TaskType;
  todolistId: string;
};
export const Task = React.memo((props: TaskPropsType) => {
  const { removeTaskTC, updateTaskTC } = useActions(tasksThunks);

  const onClickHandler = () => removeTaskTC({ taskId: props.task.id, todolistId: props.todolistId });

  const onChangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let newIsDoneValue = e.currentTarget.checked;
      updateTaskTC({
        taskId: props.task.id,
        model: { status: newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New },
        todolistId: props.todolistId,
      });
    },
    [props.task.id, props.todolistId],
  );

  const onTitleChangeHandler = useCallback(
    (newValue: string) => {
      updateTaskTC({ taskId: props.task.id, model: { title: newValue }, todolistId: props.todolistId });
    },
    [props.task.id, props.todolistId],
  );

  return (
    <div key={props.task.id} className={props.task.status === TaskStatuses.Completed ? "is-done" : ""}>
      <Checkbox checked={props.task.status === TaskStatuses.Completed} color="primary" onChange={onChangeHandler} />

      <EditableSpan value={props.task.title} onChange={onTitleChangeHandler} />
      <IconButton onClick={onClickHandler}>
        <Delete />
      </IconButton>
    </div>
  );
});
