import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { VehicleRequest, RequestStatus, RequestType } from '../types';
import { AlertCircle, CheckCircle, Clock, TrendingUp, Car, Users } from 'lucide-react';

interface DashboardProps {
  requests: VehicleRequest[];
  aiAnalysis: string;
  onGenerateAnalysis: () => void;
  isAnalyzing: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ requests, aiAnalysis, onGenerateAnalysis, isAnalyzing }) => {
  
  const stats = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === RequestStatus.PENDING).length,
      confirmed: requests.filter(r => r.status === RequestStatus.CONFIRMED).length,
      completed: requests.filter(r => r.status === RequestStatus.COMPLETED).length,
      transfers: requests.filter(r => r.requestType === RequestType.TRANSFER).length,
      rentals: requests.filter(r => r.requestType === RequestType.RENTAL).length,
    };
  }, [requests]);

  const chartData = useMemo(() => {
    return [
      { name: 'Pendentes', value: stats.pending, color: '#f59e0b' },
      { name: 'Confirmados', value: stats.confirmed, color: '#3b82f6' },
      { name: 'Concluídos', value: stats.completed, color: '#22c55e' },
    ];
  }, [stats]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
          <div className="p-3 bg-blue-50 rounded-full mr-4">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Pedidos</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.total}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
          <div className="p-3 bg-yellow-50 rounded-full mr-4">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Pendentes</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.pending}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
          <div className="p-3 bg-purple-50 rounded-full mr-4">
            <Car className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Alugueres</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.rentals}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
          <div className="p-3 bg-green-50 rounded-full mr-4">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Transfers</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.transfers}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Estado dos Pedidos</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Section */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl shadow-lg text-white">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-400" />
              Análise Inteligente
            </h3>
            <button 
              onClick={onGenerateAnalysis}
              disabled={isAnalyzing}
              className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition disabled:opacity-50"
            >
              {isAnalyzing ? 'Analisando...' : 'Atualizar'}
            </button>
          </div>
          <div className="prose prose-invert prose-sm max-h-60 overflow-y-auto custom-scrollbar">
            {aiAnalysis ? (
              <div className="whitespace-pre-line text-slate-300">{aiAnalysis}</div>
            ) : (
              <p className="text-slate-400 italic">Clique em atualizar para receber insights sobre a frota e pedidos pendentes.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;