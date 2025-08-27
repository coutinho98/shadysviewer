import { useState, useMemo } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import JsonView from '@uiw/react-json-view';
import { monokaiTheme } from '@uiw/react-json-view/monokai';
import './index.css';

function App() {
  const [inputText, setInputText] = useState(
    JSON.stringify(
      {
        inputData: {
          id: "0",
          name: "Shadys",
          version: 1.0,
          attributes: ["age: 26", "height: 160", "location: Bahia"],
          description: "40cm de braço"
        },
      },
      null,
      2
    )
  );

  const [parsedJson, setParsedJson] = useState<object | undefined>(undefined);
  const [errorText, setErrorText] = useState<string | null>(null);

  const counts = useMemo(() => {
    if (inputText.trim() === '') {
      return {
        words: 0,
        lines: 1,
        chars: 0,
        tokens: 0,
        size: 0,
      };
    }

    const words = inputText.split(/\s+/).filter(Boolean).length;
    const lines = inputText.split('\n').length;
    const chars = inputText.length;
    const tokens = words;
    const size = (new TextEncoder().encode(inputText).length / 1024).toFixed(2);

    return { words, lines, chars, tokens, size };
  }, [inputText]);

  useMemo(() => {
    try {
      if (inputText.trim() === '') {
        setParsedJson(undefined);
        setErrorText(null);
        return;
      }
      const parsed = JSON.parse(inputText);
      setParsedJson(parsed);
      setErrorText(null);
    } catch (e) {
      setParsedJson(undefined);
      setErrorText(`Erro ao analisar JSON: ${e instanceof Error ? e.message : 'Formato inválido'}`);
    }
  }, [inputText]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-indigo-700 shadow-lg p-4 flex items-center justify-center text-center">
        <h1 className="text-2xl font-semibold text-white">
          shadys viewer{' '}
          <span className="inline-block  ml-2 rotate-90">:)</span>
        </h1>
      </header>

      <PanelGroup direction="horizontal" className="flex-1 bg-gray-50 overflow-hidden">
        <Panel defaultSize={50} minSize={10} className="flex flex-col">
          <textarea
            className="w-full flex-grow p-4 bg-zinc-800 font-mono text-base text-white resize-none transition duration-200 ease-in-out"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </Panel>

        <PanelResizeHandle className="w-2 bg-zinc-900 cursor-col-resize flex flex-col items-center justify-center">
          <span className="text-gray-400 text-xs select-none"></span>
        </PanelResizeHandle>

        <Panel defaultSize={50} minSize={10} className="flex flex-col">
          <div
            className="w-full h-full p-4 font-mono text-base resize-none outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out rounded-lg overflow-auto whitespace-pre-wrap"
            style={{ backgroundColor: errorText ? '#440a0a' : '#27272a', color: errorText ? '#ffcccc' : 'white' }}
          >
            {errorText ? (
              <pre>
                <code>{errorText}</code>
              </pre>
            ) : (
              <JsonView
                value={parsedJson || {}}
                style={{
                  ...monokaiTheme,
                  backgroundColor: 'transparent',
                  width: '100%',
                  overflowX: 'auto',
                  fontSize: '15px',
                }}
                collapsed={3}
                displayDataTypes={true}
              />
            )}
          </div>
        </Panel>
      </PanelGroup>

      <footer className="bg-zinc-800 text-gray-400 text-center text-sm p-2 flex justify-between items-center px-4">
        <div className="flex space-x-4">
          <span>Words: {counts.words}</span>
          <span>Lines: {counts.lines}</span>
          <span>Chars: {counts.chars}</span>
          <span>Tokens: {counts.tokens}</span>
          <span>Size: {counts.size} KB</span>
        </div>
        <a
          href="https://github.com/coutinho98/shadysviewer"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:underline underline-offset-4"
        >
          by coutinho98
        </a>
      </footer>
    </div>
  );
}

export default App;