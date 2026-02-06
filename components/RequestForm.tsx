import React, { useState } from 'react';
import { RequestStatus, RequestType, VehicleRequest } from '../types';
import { Save, X } from 'lucide-react';

interface RequestFormProps {
  initialData?: VehicleRequest;
  onSubmit: (data: Omit<VehicleRequest, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const RequestForm: React.FC<RequestFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<VehicleRequest>>(initialData || {
    status: RequestStatus.PENDING,
    requestType: RequestType.RENTAL,
    pickupDate: new Date().toISOString().slice(0, 16),
    returnDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!formData.clientName || !formData.pickupLocation) {
      alert("Por favor preencha os campos obrigatórios.");
      return;
    }
    onSubmit(formData as Omit<VehicleRequest, 'id' | 'createdAt'>);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? (value ? parseFloat(value) : undefined) : value 
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-800">
          {initialData ? 'Editar Pedido' : 'Novo Registo'}
        </h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section: Operador & Tipo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Operador (Responsável)</label>
            <input 
              required
              type="text" 
              name="operatorName"
              value={formData.operatorName || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
              placeholder="Seu nome"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Serviço</label>
            <select 
              name="requestType"
              value={formData.requestType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            >
              <option value={RequestType.RENTAL}>Aluguer (Sem Condutor)</option>
              <option value={RequestType.TRANSFER}>Transfer (Com Condutor)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
            <select 
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            >
              {Object.values(RequestStatus).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Section: Cliente */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Dados do Cliente</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome / Empresa</label>
              <input 
                required
                type="text"
                name="clientName"
                value={formData.clientName || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contacto / Email</label>
              <input 
                required
                type="text"
                name="clientContact"
                value={formData.clientContact || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Custo Estimado (€)</label>
              <input 
                type="number"
                name="estimatedCost"
                value={formData.estimatedCost || ''}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Section: Viagem e Viatura */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Local de Levantamento / Origem</label>
            <input 
              required
              type="text"
              name="pickupLocation"
              value={formData.pickupLocation || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Local de Devolução / Destino</label>
            <input 
              required
              type="text"
              name="dropoffLocation"
              value={formData.dropoffLocation || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-brand-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Data/Hora Início</label>
            <input 
              required
              type="datetime-local"
              name="pickupDate"
              value={formData.pickupDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Data/Hora Fim</label>
            <input 
              required
              type="datetime-local"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Section: Atribuição */}
        <div className="bg-brand-50 p-4 rounded-lg border border-brand-100">
           <h3 className="text-sm font-semibold text-brand-700 uppercase tracking-wider mb-3">Logística</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-1">Grupo Viatura</label>
                <input 
                  type="text"
                  name="vehicleGroup"
                  value={formData.vehicleGroup || ''}
                  onChange={handleChange}
                  placeholder="Ex: Grupo C, Van 9L"
                  className="w-full px-3 py-2 border border-brand-200 rounded-lg outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-1">Matrícula (Opcional)</label>
                <input 
                  type="text"
                  name="assignedVehiclePlate"
                  value={formData.assignedVehiclePlate || ''}
                  onChange={handleChange}
                  placeholder="XX-XX-XX"
                  className="w-full px-3 py-2 border border-brand-200 rounded-lg outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-1">Motorista (Se aplicável)</label>
                <input 
                  type="text"
                  name="assignedDriver"
                  value={formData.assignedDriver || ''}
                  onChange={handleChange}
                  disabled={formData.requestType === RequestType.RENTAL}
                  placeholder={formData.requestType === RequestType.RENTAL ? 'N/A' : 'Nome do Motorista'}
                  className={`w-full px-3 py-2 border border-brand-200 rounded-lg outline-none focus:border-brand-500 ${formData.requestType === RequestType.RENTAL ? 'bg-gray-100 text-gray-400' : ''}`}
                />
              </div>
           </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notas Adicionais</label>
            <textarea 
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-brand-500"
            />
        </div>

        <div className="flex justify-end pt-4 gap-3">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="px-6 py-2 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 shadow-sm flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" />
            Salvar Pedido
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestForm;