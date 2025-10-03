import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import { createPickupSchedule } from '../../services/ScheduleService';
import { MapPin, Clock, Phone, Mail, CheckCircle2, AlertCircle, LocateFixed } from 'lucide-react';

const schema = z.object({
  nome: z.string().min(3, 'Informe seu nome completo'),
  telefone: z.string().min(8, 'Informe um telefone válido'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  endereco: z.string().min(5, 'Informe o endereço para coleta'),
  complemento: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  disponibilidade: z.string().min(5, 'Descreva seus dias/horários livres'),
  itens: z.string().optional(),
  observacoes: z.string().optional(),
  unidadePreferida: z.string().optional(),
});

function loadPrefill() {
  try {
    const raw = localStorage.getItem('adra_pickup_prefill');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function savePrefill(data) {
  try {
    localStorage.setItem('adra_pickup_prefill', JSON.stringify(data));
  } catch {}
}

export default function SchedulePickupModal({ isOpen, onClose }) {
  const origin = (() => {
    try {
      const raw = localStorage.getItem('adra_origin');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const prefill = loadPrefill();

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: prefill?.nome || '',
      telefone: prefill?.telefone || '',
      email: prefill?.email || '',
      endereco: prefill?.endereco || (origin?.type === 'manual' ? origin.text : ''),
      complemento: prefill?.complemento || '',
      cidade: prefill?.cidade || '',
      estado: prefill?.estado || '',
      cep: prefill?.cep || '',
      disponibilidade: prefill?.disponibilidade || '',
      itens: prefill?.itens || '',
      observacoes: prefill?.observacoes || '',
      unidadePreferida: prefill?.unidadePreferida || '',
    }
  });

  const [status, setStatus] = useState('idle'); // idle | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const values = watch();

  useEffect(() => {
    // salvar prefill a cada mudança (leve, localStorage)
    savePrefill(values);
  }, [values]);

  useEffect(() => {
    if (!isOpen) return;
    // Reset with latest prefill when opened
    reset({
      nome: prefill?.nome || '',
      telefone: prefill?.telefone || '',
      email: prefill?.email || '',
      endereco: prefill?.endereco || (origin?.type === 'manual' ? origin.text : ''),
      complemento: prefill?.complemento || '',
      cidade: prefill?.cidade || '',
      estado: prefill?.estado || '',
      cep: prefill?.cep || '',
      disponibilidade: prefill?.disponibilidade || '',
      itens: prefill?.itens || '',
      observacoes: prefill?.observacoes || '',
      unidadePreferida: prefill?.unidadePreferida || '',
    });
    setStatus('idle');
    setErrorMsg('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  async function reverseGeocode(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error('Falha ao buscar endereço');
    const data = await res.json();
    return data?.display_name || `${lat}, ${lon}`;
  }

  const handleUseMyLocation = async () => {
    // Usa origem manual salva se houver; senão tenta GPS e reverse geocode
    try {
      if (origin?.type === 'manual' && origin?.text) {
        reset({ ...values, endereco: origin.text });
        return;
      }
      if (!navigator.geolocation) {
        throw new Error('Seu navegador não suporta geolocalização');
      }
      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 });
      }).then(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const addr = await reverseGeocode(latitude, longitude);
          reset({ ...values, endereco: addr });
        } catch {
          reset({ ...values, endereco: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` });
        }
      });
    } catch (e) {
      setStatus('error');
      setErrorMsg(e.message || 'Não foi possível obter sua localização.');
    }
  };

  const onSubmit = async (formValues) => {
    savePrefill(formValues);
    setStatus('idle');
    setErrorMsg('');
    try {
      const payload = {
        ...formValues,
        origem: origin || null,
      };
      await createPickupSchedule(payload);
      setStatus('success');
    } catch (e) {
      setStatus('error');
      setErrorMsg(e.message || 'Erro ao enviar seu agendamento.');
    }
  };

  const availabilityChips = useMemo(() => (
    [
      'Seg–Sex', 'Sábado', 'Domingo', 'Manhã', 'Tarde', 'Noite',
    ]
  ), []);

  const addAvailability = (text) => {
    const curr = values.disponibilidade || '';
    if (!curr.includes(text)) {
      reset({ ...values, disponibilidade: (curr ? curr + '; ' : '') + text });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={status === 'success' ? 'Pedido enviado 🎉' : 'Agendar Coleta'}
      primaryAction={status === 'success' 
        ? { label: 'Fechar', onClick: onClose }
        : { label: isSubmitting ? 'Enviando…' : 'Enviar pedido', onClick: handleSubmit(onSubmit), disabled: isSubmitting }
      }
      secondaryAction={status === 'success' ? null : { label: 'Cancelar', onClick: onClose, disabled: isSubmitting }}
    >
      {status === 'success' ? (
        <div className="text-center">
          <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <p className="text-gray-700">Recebemos seu pedido de coleta. Em breve entraremos em contato para combinar os detalhes.</p>
        </div>
      ) : (
        <>
          {/* Origem e ação rápida */}
          <div className="mb-4 p-3 rounded-lg border bg-gray-50 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-green-700 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-800">
                Origem atual: {origin?.type === 'manual' && origin?.text ? origin.text : origin?.coords ? `${origin.coords[0].toFixed(5)}, ${origin.coords[1].toFixed(5)}` : 'não definida'}
              </p>
              <div className="mt-2 flex gap-2">
                <Button variant="secondary" onClick={handleUseMyLocation}>
                  <LocateFixed className="w-4 h-4 mr-1" /> Usar minha localização
                </Button>
              </div>
            </div>
          </div>

          {status === 'error' && (
            <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-800 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 mt-0.5" />
              <p className="text-sm">{errorMsg}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Dados de contato */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" /> Seus dados
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600">Nome completo</label>
                  <input className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" {...register('nome')} />
                  {errors.nome && <p className="text-red-600 text-xs mt-1">{errors.nome.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">Telefone</label>
                  <input className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" {...register('telefone')} />
                  {errors.telefone && <p className="text-red-600 text-xs mt-1">{errors.telefone.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-600">E-mail (opcional)</label>
                  <input className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" {...register('email')} />
                  {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" /> Endereço para coleta
              </h3>
              <input className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" {...register('endereco')} placeholder="Rua, número, bairro, cidade - UF" />
              {errors.endereco && <p className="text-red-600 text-xs mt-1">{errors.endereco.message}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                <input className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500" {...register('complemento')} placeholder="Complemento" />
                <input className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500" {...register('cidade')} placeholder="Cidade" />
                <div className="grid grid-cols-2 gap-2">
                  <input className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500" {...register('estado')} placeholder="UF" />
                  <input className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500" {...register('cep')} placeholder="CEP" />
                </div>
              </div>
            </div>

            {/* Disponibilidade */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" /> Quando podemos passar?
              </h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {availabilityChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    className="px-2 py-1 text-xs rounded-full bg-gray-100 hover:bg-gray-200"
                    onClick={() => addAvailability(chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <textarea className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" rows={2} placeholder="Ex.: Seg–Sex após 18h, Sáb até 12h" {...register('disponibilidade')} />
              {errors.disponibilidade && <p className="text-red-600 text-xs mt-1">{errors.disponibilidade.message}</p>}
            </div>

            {/* Itens e observações */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600">Itens para coleta (opcional)</label>
                <textarea className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500" rows={2} placeholder="Breve descrição dos itens, volumes, etc." {...register('itens')} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">Observações (opcional)</label>
                <textarea className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500" rows={2} {...register('observacoes')} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600">Unidade preferida (opcional)</label>
              <input className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500" {...register('unidadePreferida')} placeholder="Se já souber qual unidade prefere" />
            </div>

            {/* Submit as hidden button so Enter works */}
            <button type="submit" className="hidden" />
          </form>
        </>
      )}
    </Modal>
  );
}
