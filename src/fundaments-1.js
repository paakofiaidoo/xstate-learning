import React from "react";
import "./App.css";
import data from "./data.json";
import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";

const textMachine = Machine({
  id: "clipper",
  initial: "start",
  states: {
    start: {
      always: [{
        target: "clipped",
        cond: "isClipable"
      }, {
        target: "disabled",
      }]
    },
    clipped: {
      onEntry: "clip",
      on: {
        CLIP: { target: "unclipped" },
      },
    },
    unclipped: {
      onEntry: "unclip",
      on: {
        CLIP: { target: "clipped" },
      },
    },
    disabled: {}
  },
},
  {
    guards: {
      isClipable: (context) => context.text.length > 50
    },
    actions: {
      clip: assign((context, event) => {
        return {
          ...context,
          output: context.text.slice(0, 20)
        }
      }),
      unclip: assign((context, event) => {
        return {
          ...context,
          output: context.text
        }
      })
    }
  });


const Card = ({ text }) => {
  const [current, send] = useMachine(textMachine, {
    context: { text, output: text }
  });
  console.log(current);
  let content = current.context.output;
  return (
    <div className="card" >
      <p>{content}</p>
      <button disabled={current.value === "disabled"} style={current.value === "disabled" ? { display: "none" } : null}
        onClick={() => send("CLIP")}>{current.value === "clipped" ? "Read More" : "Read less"}</button>
    </div >
  )
}

function App() {
  return (
    <div className="App">
      {data.map((item, index) => {
        return (
          <Card key={index} text={item} />
        )
      }
      )}
    </div>
  );
}

export default App;
