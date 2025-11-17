import React, { Fragment } from "react";
import ReactDOM from "react-dom/client";
import { Partidas } from "./components/Partidas"; //cambiar a componente principal


export function App() {
  return (
    <Fragment>
      <Partidas />
    </Fragment>
  );
}