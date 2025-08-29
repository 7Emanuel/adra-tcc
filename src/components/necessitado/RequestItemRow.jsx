import React from 'react';
import Button from '../Button';

const RequestItemRow = ({ 
  item, 
  onUpdate, 
  onRemove, 
  error,
  className = '' 
}) => {
  const categories = [
    'Alimentos',
    'Roupas',
    'Remédios',
    'Material de Limpeza',
    'Material Escolar',
    'Móveis',
    'Eletrodomésticos',
    'Outros'
  ];

  const handleChange = (field, value) => {
    onUpdate({
      ...item,
      [field]: value
    });
  };

  return (
    <div className={`bg-white border rounded-2xl p-4 space-y-4 ${error ? 'border-red-300' : 'border-gray-200'} ${className}`}>
      {/* Header com botão remover */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">
          Item {item.index ? `#${item.index}` : ''}
        </h4>
        <Button
          variant="secondary"
          size="sm"
          onClick={onRemove}
          className="text-red-600 border-red-300 hover:bg-red-50 px-3 py-1"
          aria-label={`Remover item ${item.name || 'sem nome'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nome do item */}
        <div>
          <label 
            htmlFor={`item-name-${item.id}`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nome do item *
          </label>
          <input
            id={`item-name-${item.id}`}
            type="text"
            value={item.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Ex: Arroz, Feijão, Camiseta..."
            required
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600
              ${error?.name ? 'border-red-500' : 'border-gray-300'}
            `}
            aria-describedby={error?.name ? `item-name-error-${item.id}` : undefined}
            aria-invalid={error?.name ? 'true' : 'false'}
          />
          {error?.name && (
            <p 
              id={`item-name-error-${item.id}`}
              className="text-sm text-red-600 mt-1"
              role="alert"
            >
              {error.name}
            </p>
          )}
        </div>

        {/* Categoria */}
        <div>
          <label 
            htmlFor={`item-category-${item.id}`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Categoria *
          </label>
          <select
            id={`item-category-${item.id}`}
            value={item.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            required
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600
              ${error?.category ? 'border-red-500' : 'border-gray-300'}
            `}
            aria-describedby={error?.category ? `item-category-error-${item.id}` : undefined}
            aria-invalid={error?.category ? 'true' : 'false'}
          >
            <option value="">Selecione uma categoria</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {error?.category && (
            <p 
              id={`item-category-error-${item.id}`}
              className="text-sm text-red-600 mt-1"
              role="alert"
            >
              {error.category}
            </p>
          )}
        </div>

        {/* Quantidade */}
        <div>
          <label 
            htmlFor={`item-quantity-${item.id}`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Quantidade *
          </label>
          <input
            id={`item-quantity-${item.id}`}
            type="number"
            min="1"
            value={item.quantity || ''}
            onChange={(e) => handleChange('quantity', parseInt(e.target.value) || '')}
            placeholder="1"
            required
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600
              ${error?.quantity ? 'border-red-500' : 'border-gray-300'}
            `}
            aria-describedby={error?.quantity ? `item-quantity-error-${item.id}` : undefined}
            aria-invalid={error?.quantity ? 'true' : 'false'}
          />
          {error?.quantity && (
            <p 
              id={`item-quantity-error-${item.id}`}
              className="text-sm text-red-600 mt-1"
              role="alert"
            >
              {error.quantity}
            </p>
          )}
        </div>

        {/* Unidade */}
        <div>
          <label 
            htmlFor={`item-unit-${item.id}`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Unidade
          </label>
          <input
            id={`item-unit-${item.id}`}
            type="text"
            value={item.unit || ''}
            onChange={(e) => handleChange('unit', e.target.value)}
            placeholder="kg, unidades, pacotes..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
      </div>

      {/* Observações */}
      <div>
        <label 
          htmlFor={`item-notes-${item.id}`}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Observações (opcional)
        </label>
        <textarea
          id={`item-notes-${item.id}`}
          value={item.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Especificações, tamanho, marca preferida, etc."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
        />
      </div>
    </div>
  );
};

export default RequestItemRow;
