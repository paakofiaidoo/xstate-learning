import React from "react";
import "./App.css";
import { Machine } from "xstate";
import { useMachine } from "@xstate/react";

const CheckboxMachine = Machine({
  states: {
    checked: {
      on: {
        CHECK: { target: "unchecked" },
      }
    },
    unchecked: {
      on: {
        CHECK: { target: "checked" },
      }
    },
  },
  initial: "unchecked",
});

function App() {
  const [current, send] = useMachine(CheckboxMachine);
  console.log(current.value);
  return (
    <div className="App">
      <p>Checkbox</p>
      <input type="checkbox"
        checked={current.value === "checked"}
        onChange={() => {
          console.log("click");
          send("CHECK")
        }}
      />
    </div>
  );
}

export default App;