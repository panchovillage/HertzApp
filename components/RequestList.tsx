import React, { useState, useMemo } from 'react';
import { VehicleRequest, RequestStatus, RequestType } from '../types';
import { STATUS_COLORS } from '../constants';
import { Search, FileText, Trash2, Edit, Printer, Filter } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface RequestListProps {
  requests: VehicleRequest[];
  onEdit: (req: VehicleRequest) => void;
  onDelete: (id: string) => void;
}

const RequestList: React.FC<RequestListProps> = ({ requests, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [driverFilter, setDriverFilter] = useState<string>('ALL');

  // Extract unique drivers for the filter dropdown
  const uniqueDrivers = useMemo(() => {
    return Array.from(new Set(requests.map(r => r.assignedDriver).filter(Boolean))) as string[];
  }, [requests]);

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.operatorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || req.requestType === typeFilter;
    const matchesDriver = driverFilter === 'ALL' || req.assignedDriver === driverFilter;

    return matchesSearch && matchesStatus && matchesType && matchesDriver;
  });

  const handlePrintPDF = (req: VehicleRequest) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(14, 165, 233); // Brand color
    doc.text("Resumo do Pedido", 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`ID: ${req.id}`, 20, 30);
    doc.text(`Data Emissão: ${new Date().toLocaleDateString()}`, 20, 35);
    doc.text(`Operador: ${req.operatorName}`, 20, 40);

    // Details Content
    doc.setFontSize(12);
    doc.setTextColor(0);
    
    const details = [
      ['Cliente', req.clientName],
      ['Contacto', req.clientContact],
      ['Tipo', req.requestType],
      ['Levantamento', `${req.pickupLocation} em ${new Date(req.pickupDate).toLocaleString()}`],
      ['Devolução', `${req.dropoffLocation} em ${new Date(req.returnDate).toLocaleString()}`],
      ['Viatura', req.vehicleGroup + (req.assignedVehiclePlate ? ` (${req.assignedVehiclePlate})` : '')],
      ['Motorista', req.assignedDriver || 'N/A'],
      ['Estado', req.status],
      ['Notas', req.notes || '-']
    ];

    autoTable(doc, {
      startY: 50,
      head: [['Campo', 'Detalhe']],
      body: details,
      theme: 'grid',
      headStyles: { fillColor: [14, 165, 233] },
      styles: { fontSize: 11, cellPadding: 4 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } }
    });

    // Signature Area
    const finalY = (doc as any).lastAutoTable.finalY + 40;
    doc.line(20, finalY, 90, finalY);
    doc.text("Assinatura Cliente", 20, finalY + 5);

    doc.line(120, finalY, 190, finalY);
    doc.text("Assinatura Empresa", 120, finalY + 5);

    doc.save(`Pedido_${req.id}.pdf`);
  };

  const exportToCSV = () => {
    const headers = ["ID", "Cliente", "Tipo", "De", "Para", "Data Início", "Data Fim", "Viatura", "Motorista", "Estado", "Operador"];
    const rows = filteredRequests.map(req => [
      req.id,
      req.clientName,
      req.requestType,
      req.pickupLocation,
      req.dropoffLocation,
      req.pickupDate,
      req.returnDate,
      req.vehicleGroup,
      req.assignedDriver || '',
      req.status,
      req.operatorName
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "base_dados_frota.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col xl:flex-row justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        
        {/* Search */}
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 flex-1 min-w-[250px]">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Pesquisar por cliente, ID, operador..." 
            className="bg-transparent outline-none w-full text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters Wrapper */}
        <div className="flex flex-wrap gap-2 items-center">
          
          {/* Status Filter */}
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-sm rounded-lg pl-3 pr-8 py-2 outline-none focus:border-brand-500 hover:bg-slate-50 transition cursor-pointer"
            >
              <option value="ALL">Todos os Estados</option>
              {Object.values(RequestStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <Filter className="w-3 h-3 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Type Filter */}
          <div className="relative">
             <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-sm rounded-lg pl-3 pr-8 py-2 outline-none focus:border-brand-500 hover:bg-slate-50 transition cursor-pointer"
            >
              <option value="ALL">Todos os Tipos</option>
              {Object.values(RequestType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <Filter className="w-3 h-3 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Driver Filter */}
          <div className="relative">
             <select 
              value={driverFilter}
              onChange={(e) => setDriverFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-sm rounded-lg pl-3 pr-8 py-2 outline-none focus:border-brand-500 hover:bg-slate-50 transition cursor-pointer max-w-[160px] truncate"
            >
              <option value="ALL">Todos Motoristas</option>
              {uniqueDrivers.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <Filter className="w-3 h-3 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Export Button */}
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition ml-auto sm:ml-2"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Excel</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">ID / Data</th>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Serviço</th>
                <th className="px-6 py-3">Viatura / Motorista</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    Nenhum pedido encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div>{req.id}</div>
                      <div className="text-xs text-slate-400 font-normal">{new Date(req.pickupDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{req.clientName}</div>
                      <div className="text-xs text-slate-500">{req.operatorName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{req.requestType}</span>
                        <span className="text-xs text-slate-500">{req.pickupLocation} → {req.dropoffLocation}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="text-slate-700">{req.vehicleGroup}</div>
                       {req.assignedDriver && (
                         <div className="text-xs text-brand-600 flex items-center gap-1 mt-1">
                           <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                           {req.assignedDriver}
                         </div>
                       )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[req.status]}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                         <button 
                           onClick={() => handlePrintPDF(req)}
                           title="Imprimir / PDF"
                           className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition"
                         >
                           <Printer className="w-4 h-4" />
                         </button>
                         <button 
                           onClick={() => onEdit(req)}
                           title="Editar"
                           className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                         >
                           <Edit className="w-4 h-4" />
                         </button>
                         <button 
                           onClick={() => onDelete(req.id)}
                           title="Eliminar"
                           className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RequestList;