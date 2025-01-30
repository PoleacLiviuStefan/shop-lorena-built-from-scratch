"use client";

import { useState, useCallback, useEffect } from "react";
import { CheckCircle, Pencil } from "lucide-react";
import CountySelect from "./CountySelect";
import LocalitySelect from "./LocalitySelect";
import useBasketStore from "@/app/(store)/store";

interface ShippingFields {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  county: string;
  city: string;
  postalCode: string;
}

interface BillingFields {
  isLegalEntity: boolean;
  companyName: string;
  cui: string;
  tradeRegisterNumber: string;
  companyAddress: string;
  companyCity: string;
  companyCounty: string;
  companyPostalCode: string;
  bankName: string;
  iban: string;
}


 


interface AddressesProps {
  isActive: boolean;
  onComplete: () => void;
  showEditButton?: boolean;
  onEdit?: () => void;
}

interface FormState {
  shipping: ShippingFields;
  billing: BillingFields;
}

const Addresses = ({ isActive, onComplete, showEditButton, onEdit }: AddressesProps) => {
  const setShippingAddressInStore = useBasketStore((state) => state.setShippingAddress);
  const setBillingAddressInStore = useBasketStore((state) => state.setBillingAddress);
  const savedAddress = useBasketStore((state) => state.shippingAddress);
  const savedBillingAddress = useBasketStore((state) => state.billingAddress);

  const [isLegalEntity, setIsLegalEntity] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingFields | null>(null);
  const [billingAddress, setBillingAddress] = useState<BillingFields | null>(null);
  const [selectedShippingCounty, setSelectedShippingCounty] = useState("");
  // const [selectedBillingCounty, setSelectedBillingCounty] = useState("");

  const [formData, setFormData] = useState<{
    shipping: ShippingFields;
    billing: BillingFields;
  }>({
    shipping: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      county: "",
      city: "",
      postalCode: "",
    },
    billing: {
      isLegalEntity: false,
      companyName: "",
      cui: "",
      tradeRegisterNumber: "",
      companyAddress: "",
      companyCity: "",
      companyCounty: "",
      companyPostalCode: "",
      bankName: "",
      iban: ""
    }
  });

  useEffect(() => {
    if (savedAddress) {
      setFormData((prev) => ({
        ...prev,
        shipping: {
          firstName: savedAddress.firstName || "",
          lastName: savedAddress.lastName || "",
          email: savedAddress.email || "",
          phone: savedAddress.phone || "",
          address: savedAddress.street || "",
          county: savedAddress.province || "",
          city: savedAddress.city || "",
          postalCode: savedAddress.postalCode || "",
        },
        billing:{
          isLegalEntity: savedBillingAddress?.isLegalEntity || false,
          companyName: savedBillingAddress?.companyName || "",
          cui: savedBillingAddress?.cui || "",
          tradeRegisterNumber: savedBillingAddress?.tradeRegisterNumber || "",
          companyAddress: savedBillingAddress?.companyAddress || "",
          companyCity: savedBillingAddress?.companyCity || "",
          companyCounty: savedBillingAddress?.companyCounty || "",
          companyPostalCode: savedBillingAddress?.companyPostalCode || "",
          bankName: savedBillingAddress?.bankName || "",
          iban: savedBillingAddress?.iban || ""
        } 
      }));

      if (savedBillingAddress?.isLegalEntity) {
        setIsLegalEntity(savedBillingAddress.isLegalEntity);
      }
  
      if (savedAddress.province) {
        setSelectedShippingCounty(savedAddress.province);
        // setSelectedBillingCounty(savedAddress.province);
      }
    }
  }, [savedAddress,savedBillingAddress]);

  const handleChange = useCallback(<T extends keyof FormState>(
    type: T,
    field: keyof FormState[T],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
        ...(field === "county" ? { city: "" } : {}),
      },
    }));
  
    if (field === "county") {
      if (type === "shipping") {
        setSelectedShippingCounty(value);
      } else if (type === "billing") {
        // setSelectedBillingCounty(value);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    setShippingAddress(formData.shipping);
    setBillingAddress(formData.billing);
  
    setShippingAddressInStore({
      firstName: formData.shipping.firstName,
      lastName: formData.shipping.lastName,
      email: formData.shipping.email,
      phone: formData.shipping.phone,
      street: formData.shipping.address,
      city: formData.shipping.city,
      province: formData.shipping.county,
      postalCode: formData.shipping.postalCode,
    });
  
    setBillingAddressInStore({
      isLegalEntity,
      ...(isLegalEntity && formData.billing)
    });
  
    onComplete();
  };

  const renderAddressFields = useCallback(
    ({
      type,
      countyValue,
      disabled = false,
    }: {
      type: "shipping";
      countyValue: string;
      disabled?: boolean;
    }) => (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prenume</label>
            <input
  type="text"
  required
  disabled={disabled}
  value={formData[type].firstName}
  onChange={(e) => handleChange('shipping' as const, 'firstName', e.target.value)}
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
              onChange={(e) => handleChange('shipping' as const, "lastName", e.target.value)}
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
            onChange={(e) => handleChange('shipping' as const, "email", e.target.value)}
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
            onChange={(e) => handleChange('shipping' as const, "phone", e.target.value)}
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
            onChange={(e) => handleChange('shipping' as const, "address", e.target.value)}
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
              onChange={(e) => handleChange('shipping' as const, "county", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="Selectează județul"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Oraș</label>
            <LocalitySelect
              county={countyValue}
              disabled={disabled || !formData[type].county}
              value={formData[type].city}
              onChange={(e) => handleChange('shipping' as const, "city", e.target.value)}
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
            onChange={(e) => handleChange('shipping' as const, "postalCode", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="Cod Poștal"
          />
        </div>

        {isLegalEntity && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Date Facturare Firma</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nume Firmă</label>
              <input
                type="text"
                value={formData.billing.companyName || ""}
                onChange={(e) => handleChange("billing", "companyName", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="Nume Firmă"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CUI</label>
              <input
                type="text"
                value={formData.billing.cui || ""}
                onChange={(e) => handleChange("billing", "cui", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="CUI"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Număr Registrul Comerțului</label>
              <input
                type="text"
                value={formData.billing.tradeRegisterNumber || ""}
                onChange={(e) => handleChange("billing", "tradeRegisterNumber", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="Nr. Reg. Comerț"
              />
            </div>
            <h4 className="text-md font-medium mt-4">Sediu Social</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresă Sediu
            </label>
            <input
              type="text"
              required
              value={formData.billing.companyAddress}
              onChange={(e) =>
                handleChange("billing", "companyAddress", e.target.value)
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Adresă Sediu Social"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Județ</label>
              <CountySelect
                value={formData.billing.companyCounty}
                onChange={(e) => handleChange("billing", "companyCounty", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Selectează județul"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Oraș</label>
              <LocalitySelect
                county={formData.billing.companyCounty}
                value={formData.billing.companyCity}
                onChange={(e) => handleChange("billing", "companyCity", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Selectează orașul"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cod Poștal
            </label>
            <input
              type="text"
              required
              value={formData.billing.companyPostalCode}
              onChange={(e) =>
                handleChange("billing", "companyPostalCode", e.target.value)
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Cod Poștal"
            />
          </div>

          <h4 className="text-md font-medium mt-4">Date Bancare</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Banca
            </label>
            <input
              type="text"
              required
              value={formData.billing.bankName}
              onChange={(e) =>
                handleChange("billing", "bankName", e.target.value)
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Numele Băncii"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IBAN
            </label>
            <input
              type="text"
              required
              value={formData.billing.iban}
              onChange={(e) =>
                handleChange("billing", "iban", e.target.value)
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="RO XX XXXX XXXX XXXX XXXX XXXX"
            />
          </div>
          </div>
          
        )}
      </div>
    ),
    [formData, handleChange, isLegalEntity]
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Adresa de Livrare</h2>
          {!isActive && shippingAddress && <CheckCircle className="h-5 w-5 text-green-500" />}
        </div>
        {showEditButton && !isActive && (
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Editează
          </button>
        )}
      </div>

      {isActive ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isLegalEntity}
                onChange={(e) => setIsLegalEntity(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Persoană Juridică</span>
            </label>
          </div>

          {renderAddressFields({ type: "shipping", countyValue: selectedShippingCounty })}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
          >
            Continuă spre livrare
          </button>
        </form>
      ) : (
        shippingAddress && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Adresa de Livrare</h3>
              <p className="text-gray-600">
                {shippingAddress.firstName} {shippingAddress.lastName}
              </p>
              <p className="text-gray-600">{shippingAddress.address}</p>
              <p className="text-gray-600">
                {shippingAddress.city}, {shippingAddress.county}
              </p>
              <p className="text-gray-600">{shippingAddress.postalCode}</p>

{isLegalEntity && billingAddress && (
  <div className="mt-4">
    <h4 className="font-medium text-gray-900 mb-2">Detalii Firmă</h4>
    <p className="text-gray-600">Nume Firmă: {billingAddress.companyName}</p>
    <p className="text-gray-600">CUI: {billingAddress.cui}</p>
    <p className="text-gray-600">Nr. Reg. Comerț: {billingAddress.tradeRegisterNumber}</p>
    <p className="text-gray-600">Sediu: {billingAddress.companyAddress}</p>
    <p className="text-gray-600">Bancă: {billingAddress.bankName}</p>
    <p className="text-gray-600">IBAN: {billingAddress.iban}</p>
  </div>
)}
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Contact</h3>
              <p className="text-gray-600">{shippingAddress.phone}</p>
              <p className="text-gray-600">{shippingAddress.email}</p>
            </div>
          </div>
        )
      )}

      <div className="mt-8 border-t border-gray-200" />
    </div>
  );
};

export default Addresses;

