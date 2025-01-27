// components/AddressFields.tsx
import { memo } from 'react';
import CountySelect from "./CountySelect";
import LocalitySelect from "./LocalitySelect";

interface AddressFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  county: string;
  city: string;
  postalCode: string;
}

interface AddressFieldsProps {
  type: 'shipping' | 'billing';
  countyValue: string;
  disabled?: boolean;
  formData: {
    shipping: AddressFormData;
    billing: AddressFormData;
  };
  onFieldChange: (type: 'shipping' | 'billing', field: keyof AddressFormData, value: string) => void;
}

const AddressFields = ({ type, countyValue, disabled = false, formData, onFieldChange }: AddressFieldsProps) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Prenume</label>
        <input
          type="text"
          required
          disabled={disabled}
          value={formData[type].firstName}
          onChange={(e) => onFieldChange(type, 'firstName', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="Prenume"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nume</label>
        <input
          type="text"
          required
          disabled={disabled}
          value={formData[type].lastName}
          onChange={(e) => onFieldChange(type, 'lastName', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="Nume"
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <input
        type="email"
        required
        disabled={disabled}
        value={formData[type].email}
        onChange={(e) => onFieldChange(type, 'email', e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        placeholder="Email"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
      <input
        type="tel"
        required
        disabled={disabled}
        value={formData[type].phone}
        onChange={(e) => onFieldChange(type, 'phone', e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        placeholder="Telefon"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Adresă</label>
      <input
        type="text"
        required
        disabled={disabled}
        value={formData[type].address}
        onChange={(e) => onFieldChange(type, 'address', e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        placeholder="Adresă completă"
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Județ</label>
        <CountySelect
          value={formData[type].county}
          disabled={disabled}
          onChange={(e) => onFieldChange(type, 'county', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="Selectează județul"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Oraș</label>
        <LocalitySelect
          county={countyValue}
          disabled={disabled}
          value={formData[type].city}
          onChange={(e) => onFieldChange(type, 'city', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="Selectează orașul"
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Cod Poștal</label>
      <input
        type="text"
        required
        disabled={disabled}
        value={formData[type].postalCode}
        onChange={(e) => onFieldChange(type, 'postalCode', e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        placeholder="Cod Poștal"
      />
    </div>
  </>
);

export default memo(AddressFields);