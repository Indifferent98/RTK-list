import { Login } from "features/Auth/Login";
import { TodolistsList } from "features/TodolistsList/ui/TodolistsList";
import React from "react";
import { Routes, Route, Link } from "react-router-dom";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={"/"} element={<TodolistsList />} />
      <Route path={"/login"} element={<Login />} />
      <Route
        path={"*"}
        element={
          <>
            <h1>404: PAGE NOT FOUND </h1>
            <Link to={"/"}>go to main page</Link>
          </>
        }
      />
    </Routes>
  );
};
