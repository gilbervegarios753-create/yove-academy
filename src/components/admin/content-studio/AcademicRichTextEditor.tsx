import React, { useState } from 'react';
import { Bold, Italic, List, ListOrdered, Code, FileText, AlertTriangle, CheckSquare, Image as ImageIcon, Link as LinkIcon, Heading1, Heading2, Table, Layers, Sparkles } from 'lucide-react';

interface AcademicRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onOpenAiAssistant?: () => void;
}

export const AcademicRichTextEditor: React.FC<AcademicRichTextEditorProps> = ({
  value,
  onChange,
  onOpenAiAssistant
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const insertSnippet = (template: string) => {
    onChange((value || '') + '\n' + template + '\n');
  };

  return (
    <div className="bg-[#0f172a] border border-cyan-500/30 rounded-2xl overflow-hidden flex flex-col">
      {/* Editor Toolbar */}
      <div className="bg-[#1e293b]/90 border-b border-cyan-500/20 p-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => insertSnippet('### 📌 Título de la Seccion')}
          className="p-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded-lg text-xs flex items-center gap-1 transition"
          title="Encabezado H3"
        >
          <Heading1 className="w-4 h-4" /> Título
        </button>

        <button
          type="button"
          onClick={() => insertSnippet('#### 🔹 Subtítulo Técnico')}
          className="p-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded-lg text-xs flex items-center gap-1 transition"
          title="Subtítulo H4"
        >
          <Heading2 className="w-4 h-4" /> Subtítulo
        </button>

        <div className="h-4 w-[1px] bg-slate-700 mx-1" />

        <button
          type="button"
          onClick={() => insertSnippet('> **NOTA TÉCNICA:** Explicación conceptual importante sobre el funcionamiento del sistema.')}
          className="p-2 text-cyan-400 hover:bg-cyan-950/40 rounded-lg text-xs flex items-center gap-1 border border-cyan-500/30 transition"
          title="Nota Destacada"
        >
          <FileText className="w-4 h-4" /> Nota
        </button>

        <button
          type="button"
          onClick={() => insertSnippet('> ⚠️ **ADVERTENCIA DE SEGURIDAD:** Asegúrese de desenergizar el circuito HV (Alta Tensión) antes de manipular conectores.')}
          className="p-2 text-amber-400 hover:bg-amber-950/40 rounded-lg text-xs flex items-center gap-1 border border-amber-500/30 transition"
          title="Advertencia de Seguridad"
        >
          <AlertTriangle className="w-4 h-4" /> Advertencia
        </button>

        <button
          type="button"
          onClick={() => insertSnippet('#### 🛠️ **Procedimiento de Medición Paso a Paso:**\n1. Conectar punta lógica o multímetro True-RMS.\n2. Girar interruptor a posición ON (Key ON / Engine OFF).\n3. Verificar voltaje de referencia de 5.0V ±0.1V en Pin A.')}
          className="p-2 text-emerald-400 hover:bg-emerald-950/40 rounded-lg text-xs flex items-center gap-1 border border-emerald-500/30 transition"
          title="Procedimiento Guiado"
        >
          <ListOrdered className="w-4 h-4" /> Procedimiento
        </button>

        <button
          type="button"
          onClick={() => insertSnippet('- [ ] Verificación visual de arnés y conector\n- [ ] Medición de resistencia de bobina (R = 12.5 Ω ±0.5 Ω)\n- [ ] Inspección de caída de tensión en masa de ECU')}
          className="p-2 text-indigo-400 hover:bg-indigo-950/40 rounded-lg text-xs flex items-center gap-1 border border-indigo-500/30 transition"
          title="Checklist de Taller"
        >
          <CheckSquare className="w-4 h-4" /> Checklist
        </button>

        <button
          type="button"
          onClick={() => insertSnippet('```typescript\n// Fórmula de ley de Ohm\nconst V = 12.0; // Voltios\nconst R = 4.0;  // Ohmios\nconst I = V / R; // Amperios (3.0 A)\n```')}
          className="p-2 text-purple-400 hover:bg-purple-950/40 rounded-lg text-xs flex items-center gap-1 border border-purple-500/30 transition"
          title="Bloque de Código / Fórmula"
        >
          <Code className="w-4 h-4" /> Código/Fórmula
        </button>

        <div className="ml-auto flex items-center gap-2">
          {onOpenAiAssistant && (
            <button
              type="button"
              onClick={onOpenAiAssistant}
              className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-900/40 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" /> YOVE AI Draft
            </button>
          )}

          <div className="bg-slate-900 p-1 rounded-lg flex border border-slate-700">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1 text-xs rounded-md font-medium transition ${activeTab === 'editor' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 text-xs rounded-md font-medium transition ${activeTab === 'preview' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Vista Previa
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'editor' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escriba aquí el contenido didáctico técnico de la lección (soporta Markdown, notas, avisos, código, tablas y checklists)..."
          className="w-full h-80 p-4 bg-[#0a0e27] text-slate-200 font-mono text-sm border-none focus:ring-2 focus:ring-cyan-500/50 resize-y outline-none leading-relaxed"
        />
      ) : (
        <div className="w-full h-80 p-6 bg-[#090d24] text-slate-200 overflow-y-auto space-y-4 prose prose-invert prose-cyan max-w-none">
          {value ? (
            <div className="whitespace-pre-line text-sm leading-relaxed">
              {value}
            </div>
          ) : (
            <p className="text-slate-500 italic text-sm text-center py-12">
              Sin contenido para previsualizar.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
