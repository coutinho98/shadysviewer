import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import './index.css';

function App() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">

      <header className="bg-indigo-700 shadow-lg p-4 flex items-center justify-center text-center">
        <h1 className="text-2xl font-semibold text-white">shadys viewer <h2 className='inline-block  ml-2 rotate-90'>:)</h2></h1>
      </header>


      <PanelGroup direction="horizontal" className="flex-1 bg-gray-50 overflow-hidden">
        <Panel defaultSize={50} minSize={10} className='flex flex-col'>
          <textarea
            className="w-full flex-grow p-4 bg-zinc-800 font-mono text-base text-white resize-none transition duration-200 ease-in-out"
          >
            {JSON.stringify({
              inputData: {
                id: "item-001",
                name: "Produto X",
                version: 1.0,
                attributes: ["size: M", "color: blue", "material: cotton"],
                description: "testando"
              },
              source: "manual_paste"
            }, null, 2)}
          </textarea>
        </Panel>

        <PanelResizeHandle className="w-2 bg-zinc-900 cursor-col-resize flex flex-col items-center justify-center">
          <span className="text-gray-400 text-xs select-none"></span>
        </PanelResizeHandle>

        <Panel defaultSize={50} minSize={10} className="flex flex-col">
          <pre
            className="w-full h-full p-4 bg-zinc-800 font-mono text-base text-white resize-none outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out rounded-lg overflow-auto whitespace-pre-wrap" // Adicionado outline-none
          >
            <code>
              {JSON.stringify({
                formattedOutput: {
                  status: "success",
                  timestamp: "2025-07-30T00:00:00Z",
                  processedData: {
                    type: "json",
                    contentLength: 250,
                    structure: "nested"
                  },
                  notes: "Este é o campo de saída formatada. Arraste a barra central para redimensionar os painéis!"
                },
                detailedLog: [
                  "Parsing started...",
                  "Validation successful.",
                  "Formatting applied.",
                  "Displaying result."
                ]
              }, null, 2)}
            </code>
          </pre>
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default App;