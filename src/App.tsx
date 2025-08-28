import { useState, useMemo } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import JsonView from '@uiw/react-json-view';
import { vscodeTheme  } from '@uiw/react-json-view/vscode';
import './index.css';

const MAX_SIZE_MB = 1; 
const MAX_CHAR_COUNT = MAX_SIZE_MB * 1024 * 1024;

function App() {
  const [inputText, setInputText] = useState(
    JSON.stringify(
      {
        "entity": {
          "name": "Darth Vader",
          "id": "sith-lord-001",
          "classification": "Sith Lord",
          "status": "Active Duty",
          "affiliation": "Galactic Empire",
          "biographical_data": {
            "birth_name": "Anakin Skywalker",
            "homeworld": "Tatooine",
            "known_associates": [
              "Emperor Palpatine",
              "Grand Moff Tarkin",
              "The Inquisitors"
            ],
            "family": {
              "father": "The Force",
              "mother": "Shmi Skywalker",
              "children": [
                "Luke Skywalker",
                "Leia Organa"
              ]
            }
          },
          "physical_attributes": {
            "height": "2.02 meters",
            "armor_system": {
              "type": "Life-support suit",
              "components": [
                "Helmet with integrated voice modulator",
                "Chest plate with life-support controls",
                "Reinforced durasteel plating"
              ],
              "function": "Maintains life support for extensive injuries, provides psychological intimidation."
            },
            "cybernetic_enhancements": [
              "Prosthetic limbs",
              "Respiratory system"
            ]
          },
          "abilities_and_equipment": {
            "force_abilities": [
              {
                "ability": "Force Choke",
                "power_level": "High"
              },
              {
                "ability": "Telekinesis",
                "power_level": "Master"
              },
              {
                "ability": "Force Lightning Resistance",
                "power_level": "Variable"
              }
            ],
            "weapon": {
              "name": "Lightsaber",
              "crystal_color": "Red",
              "hilt_design": "Custom"
            },
            "starship": "TIE Advanced x1"
          },
          "psychological_profile": {
            "personality_traits": [
              "Intimidating",
              "Cunning",
              "Ruthless"
            ],
            "major_weakness": "Conflict between light and dark side of the Force, compassion for his son."
          }
        }
      }
    )
  );

  const [parsedJson, setParsedJson] = useState<object | undefined>(undefined);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isLargeJson, setIsLargeJson] = useState<boolean>(false);

  const counts = useMemo(() => {
    if (inputText.trim() === '') {
      return {
        words: 0,
        lines: 1,
        chars: 0,
        tokens: 0,
        size: '0.00'
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
    if (inputText.length > MAX_CHAR_COUNT) {
      setIsLargeJson(true);
      setErrorText(`JSON muito grande (${counts.size} KB). O visualizador pode ter problemas de desempenho.`);
      setParsedJson(undefined);
      return;
    } else {
      setIsLargeJson(false);
    }

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
  }, [inputText, counts.size]);

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
            ) : isLargeJson ? (
              <pre className="text-yellow-300">
                <code>O arquivo JSON é muito grande para ser visualizado de forma otimizada. A performance pode ser afetada.</code>
              </pre>
            ) : (
              <JsonView
                value={parsedJson || {}}
                style={{
                  ...vscodeTheme,
                  backgroundColor: 'transparent',
                  width: '100%',
                  overflowX: 'auto',
                  fontSize: '15px',
                }}
                collapsed={5}
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
          href="https://coutinho98.github.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/60 italic transition duration-400 ease-in-out underline-transition"
        >
          by coutinho98
        </a>
      </footer>
    </div>
  );
}

export default App;