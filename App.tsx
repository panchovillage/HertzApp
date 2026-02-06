import React, { useState, useEffect } from 'react';
import { LayoutDashboard, PlusCircle, List, Settings, Car } from 'lucide-react';
import Dashboard from './components/Dashboard';
import RequestForm from './components/RequestForm';
import RequestList from './components/RequestList';
import { VehicleRequest } from './types';
import { INITIAL_REQUESTS } from './constants';
import { analyzeOperations } from './services/geminiService';

type View = 'dashboard' | 'create' | 'list';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  
  // Initialize state from Local Storage with Error Handling
  const [requests, setRequests] = useState<VehicleRequest[]>(() => {
    try {
      const saved = localStorage.getItem('fleet_requests');
      return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
    } catch (error) {
      console.error("Erro ao carregar dados do Local Storage:", error);
      return INITIAL_REQUESTS;
    }
  });
  
  const [editingRequest, setEditingRequest] = useState<VehicleRequest | undefined>(undefined);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Persist to Local Storage whenever requests change
  useEffect(() => {
    try {
      localStorage.setItem('fleet_requests', JSON.stringify(requests));
    } catch (error) {
      console.error("Erro ao salvar dados no Local Storage:", error);
    }
  }, [requests]);

  const handleCreateOrUpdate = (data: Omit<VehicleRequest, 'id' | 'createdAt'>) => {
    if (editingRequest) {
      setRequests(prev => prev.map(req => 
        req.id === editingRequest.id ? { ...req, ...data } : req
      ));
      setEditingRequest(undefined);
    } else {
      const newRequest: VehicleRequest = {
        id: `REQ-${String(requests.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString(),
        ...data
      };
      setRequests(prev => [newRequest, ...prev]);
    }
    setCurrentView('list');
  };

  const handleEdit = (req: VehicleRequest) => {
    setEditingRequest(req);
    setCurrentView('create');
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem a certeza que pretende eliminar este registo?")) {
      setRequests(prev => prev.filter(req => req.id !== id));
    }
  };

  const handleGenerateAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await analyzeOperations(requests);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-brand-600 text-white p-2 rounded-lg">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-tight">Frota & Transfer</h1>
              <p className="text-xs text-slate-500">Gestor Operacional</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition ${currentView === 'dashboard' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          
          <button 
            onClick={() => { setEditingRequest(undefined); setCurrentView('create'); }}
            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition ${currentView === 'create' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <PlusCircle className="w-5 h-5" />
            Novo Pedido
          </button>
          
          <button 
            onClick={() => setCurrentView('list')}
            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition ${currentView === 'list' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <List className="w-5 h-5" />
            Base de Dados
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
           <div className="bg-slate-50 p-3 rounded-lg">
             <p className="text-xs text-slate-500 font-medium mb-1">Operador Atual</p>
             <p className="text-sm font-bold text-slate-800">Admin Sistema</p>
           </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-slate-200 z-20 flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 text-white p-1.5 rounded">
              <Car className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-800">FrotaApp</span>
          </div>
          <button onClick={() => setCurrentView(currentView === 'dashboard' ? 'list' : 'dashboard')}>
             <List className="w-6 h-6 text-slate-600" />
          </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 pt-20 md:pt-6 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {currentView === 'dashboard' && 'Visão Geral'}
              {currentView === 'create' && 'Gestão de Pedidos'}
              {currentView === 'list' && 'Base de Dados'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {new Date().toLocaleDateString('pt-PT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </header>

        {currentView === 'dashboard' && (
          <Dashboard 
            requests={requests} 
            aiAnalysis={aiAnalysis} 
            onGenerateAnalysis={handleGenerateAnalysis}
            isAnalyzing={isAnalyzing}
          />
        )}
        
        {currentView === 'create' && (
          <RequestForm 
            initialData={editingRequest}
            onSubmit={handleCreateOrUpdate}
            onCancel={() => { setEditingRequest(undefined); setCurrentView('list'); }}
          />
        )}
        
        {currentView === 'list' && (
          <RequestList 
            requests={requests}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
}

export default App;