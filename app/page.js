'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';

export default function FormularioParcelas() {
  const [idCliente, setIdCliente] = useState('');
  const [nrContrato, setNrContrato] = useState('');
  const [descontoAtivo, setDescontoAtivo] = useState(false);
  const [novoValor, setNovoValor] = useState('');
  const [parcelas, setParcelas] = useState([
    { id: 1, parcela: '', acao: 'CANCELAR' }
  ]);

  const acoes = ['CANCELAR', 'AJUSTAR', 'BAIXA', 'AJ + CANC'];

  const adicionarLinha = () => {
    setParcelas([
      ...parcelas,
      { id: Date.now(), parcela: '', acao: 'CANCELAR' }
    ]);
  };

  const removerLinha = (id) => {
    if (parcelas.length > 1) {
      setParcelas(parcelas.filter(p => p.id !== id));
    }
  };

  const atualizarParcela = (id, campo, valor) => {
    setParcelas(parcelas.map(p => 
      p.id === id ? { ...p, [campo]: valor } : p
    ));
  };

  const formatarMoeda = (valor) => {
    const numero = valor.replace(/\D/g, '');
    const valorFormatado = (Number(numero) / 100).toFixed(2);
    return valorFormatado.replace('.', ',');
  };

  const handleMoedaChange = (e) => {
    const valor = e.target.value;
    setNovoValor(formatarMoeda(valor));
  };

  const gerarExcel = () => {
    if (!idCliente || !nrContrato) {
      alert('Por favor, preencha ID Cliente e Nr Contrato');
      return;
    }

    if (parcelas.some(p => !p.parcela)) {
      alert('Por favor, preencha todos os números de parcela');
      return;
    }

    if (descontoAtivo && !novoValor) {
      alert('Por favor, preencha o Novo Valor do desconto');
      return;
    }

    const dados = [];

    if (descontoAtivo) {
      dados.push({
        'ID Cliente': parseInt(idCliente),
        'Nr Contrato': parseInt(nrContrato),
        'Parcela': 0,
        'Ação': 'DESCONTO',
        'Novo Valor': novoValor.replace(',', '.')
      });
    }

    parcelas.forEach(p => {
      dados.push({
        'ID Cliente': parseInt(idCliente),
        'Nr Contrato': parseInt(nrContrato),
        'Parcela': parseInt(p.parcela),
        'Ação': p.acao,
        'Novo Valor': ''
      });
    });

    const ws = XLSX.utils.json_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Parcelas');

    XLSX.writeFile(wb, `parcelas_${idCliente}_${nrContrato}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Gestão de Parcelas
        </h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Cliente *
            </label>
            <input
              type="number"
              value={idCliente}
              onChange={(e) => setIdCliente(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite o ID do cliente"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nr Contrato *
            </label>
            <input
              type="number"
              value={nrContrato}
              onChange={(e) => setNrContrato(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite o número do contrato"
            />
          </div>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={descontoAtivo}
              onChange={(e) => setDescontoAtivo(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="ml-3 text-sm font-medium text-gray-700">
              Desconto na parcela?
            </span>
          </label>

          {descontoAtivo && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Novo Valor *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-gray-500">R$</span>
                <input
                  type="text"
                  value={novoValor}
                  onChange={handleMoedaChange}
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0,00"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Parcelas</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border">
                    Parcela *
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border">
                    Ação *
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border w-20">
                    Remover
                  </th>
                </tr>
              </thead>
              <tbody>
                {parcelas.map((parcela) => (
                  <tr key={parcela.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border">
                      <input
                        type="number"
                        value={parcela.parcela}
                        onChange={(e) => atualizarParcela(parcela.id, 'parcela', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nº da parcela"
                      />
                    </td>
                    <td className="px-4 py-3 border">
                      <select
                        value={parcela.acao}
                        onChange={(e) => atualizarParcela(parcela.id, 'acao', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {acoes.map((acao) => (
                          <option key={acao} value={acao}>
                            {acao}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 border text-center">
                      <button
                        onClick={() => removerLinha(parcela.id)}
                        disabled={parcelas.length === 1}
                        className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={adicionarLinha}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ➕ Adicionar Linha
          </button>
        </div>

        <button
          onClick={gerarExcel}
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-lg"
        >
          Gerar Excel
        </button>
      </div>
    </div>
  );
}
