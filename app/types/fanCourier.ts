// types/fanCourier.ts
export interface ShippingAddress {
    shipping_address: {
      city: string;
      province: string;
      first_name?: string;
      last_name?: string;
      phone?: string;
      email?: string;
      address_1?: string;
      address_2?: string;
      postal_code?: string;
    };
  }
  
  export interface Cart {
    id: string;
    shipping_address: Required<ShippingAddress['shipping_address']>;
  }
  
  export interface ShippingDetails {
    cart: Cart;
  }
  
  export interface TariffResponse {
    status: string;
    tariff: {
      total: number;
      [key: string]: unknown;
    };
  }
  
  export interface AwbResponse {
    status: string;
    awbNumber?: string;
    message?: string;
  }