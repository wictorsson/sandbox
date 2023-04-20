import * as Tone from "tone";
import { useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";

import TextUpdaterNode from "./textUpdaterNode.js";

import "./text-updater-node.css";

const proOptions = { hideAttribution: true };

const rfStyle = {
  backgroundColor: "grey",
};

const initialNodes = [
  {
    id: "node-1",
    type: "input",
    position: { x: 150, y: 0 },
    data: { label: "Audio out" },
    style: { width: 100, height: 100 }, // add this line
  },
  {
    id: "node-2",
    type: "output",
    targetPosition: "bottom",
    position: { x: 0, y: 200 },
    data: { label: "node 2" },
  },
  {
    id: "node-3",
    type: "output",
    targetPosition: "top",
    position: { x: 200, y: 200 },
    data: { label: "node 3" },
  },
];
// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const nodeTypes = { textUpdater: TextUpdaterNode };

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const [osc, setOsc] = useState();

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (connection) => {
      const synth = new Tone.Synth().toDestination();

      if (connection.target === "node-3") {
        const source = new Tone.Oscillator().toDestination();
      } else {
        setOsc(null);
        synth.triggerAttackRelease("C4", "4n");
      }
      console.log("New connection:", connection);
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  return (
    <div style={{ height: 800 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        style={rfStyle}
        proOptions={proOptions}
      />
    </div>
  );
}

export default Flow;
