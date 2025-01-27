import { Product } from "@/sanity.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PaymentMethod = "card" | "manual" | null;

export interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface BillingAddress {
  isLegalEntity: boolean;
  companyName?: string;
  cui?: string;
  tradeRegisterNumber?: string;
  companyAddress?: string;
  companyCity?: string;
  companyCounty?: string;
  companyPostalCode?: string;
  bankName?: string;
  iban?: string;
}

export type CheckoutStep = "address" | "shipping" | "payment" | "review";

export interface BasketItem {
  product: Product;
  quantity: number;
  variant?: {
    curbura: string;
    grosime: string;
    marime: string;
    price: number;
    stock: number;
  };
}

interface OrderSummary {
  subtotal: number;
  shipping: number;
  total: number;
}

interface BasketState {
  userId: string | null;
  items: BasketItem[];
  shippingAddress: Address | null;
  billingAddress: BillingAddress | null;
  paymentMethod: PaymentMethod;
  isProcessing: boolean;
  error: string | null;
  currentStep: CheckoutStep;
  shippingCost: number | null;
  promoCode: string | null;
  promoDiscount: number;

  setPromoCode: (code: string | null, discount: number) => void;
  setShippingCost: (cost: number) => void;
  setCheckoutStep: (step: CheckoutStep) => void;
  
  // User Management
  setUserId: (id: string) => void;
  clearUserId: () => void;

  // Basket Management
  addItem: (product: Product, variant?: BasketItem['variant']) => void;
  removeItem: (productId: string, variant?: BasketItem['variant']) => void;
  updateQuantity: (productId: string, quantity: number, variant?: BasketItem['variant']) => void;
  clearBasket: () => void;

  // Item Queries
  getTotalPrice: () => number;
  getItemCount: (productId: string) => number;
  getGroupedItems: () => BasketItem[];
  getOrderSummary: () => OrderSummary;

  // Shipping & Payment
  setShippingAddress: (address: Address) => void;
  setBillingAddress: (address: BillingAddress) => void;
  getShippingAddress: () => Address | null;
  getBillingAddress: () => BillingAddress | null;
  setPaymentMethod: (method: PaymentMethod) => void;
  getPaymentMethod: () => PaymentMethod;

  // Order Processing
  setProcessing: (status: boolean) => void;
  setError: (error: string | null) => void;
}

const useBasketStore = create<BasketState>()(
  persist(
    (set, get) => ({
      // Initial State
      userId: null,
      items: [],
      shippingAddress: null,
      billingAddress: null,
      paymentMethod: null,
      isProcessing: false,
      error: null,
      currentStep: "address",
      shippingCost: null,
      promoCode: null,
      promoDiscount: 0,

      setPromoCode: (code, discount) =>
        set({
          promoCode: code,
          promoDiscount: discount,
        }),

      setShippingCost: (cost) => set({ shippingCost: cost }),
      
      setCheckoutStep: (step) => set({ currentStep: step }),

      // User Management
      setUserId: (id) => set({ userId: id }),
      clearUserId: () =>
        set({
          userId: null,
          items: [],
          shippingAddress: null,
          billingAddress: null,
          paymentMethod: null,
        }),

      // Basket Management
      addItem: (product, variant, quantity = 1) =>
        set((state) => {
          const isSameVariant = (variant1: any, variant2: any) => {
            if (!variant1 && !variant2) return true;
            if (!variant1 || !variant2) return false;
            return (
              variant1.curbura === variant2.curbura &&
              variant1.grosime === variant2.grosime &&
              variant1.marime === variant2.marime
            );
          };
      
          const existingItem = state.items.find(
            (item) =>
              item.product._id === product._id &&
              isSameVariant(item.variant, variant)
          );
      
          const availableStock = variant?.stock ?? product.stock;
          const currentQuantity = existingItem ? existingItem.quantity : 0;
          const newQuantity = currentQuantity + quantity;  // Modificat aici
      
          if (newQuantity > availableStock) {
            set({ error: "Cantitatea solicitată depășește stocul disponibil" });
            return state;
          }
      
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product._id === product._id &&
                isSameVariant(item.variant, variant)
                  ? { ...item, quantity: newQuantity }
                  : item
              ),
              error: null,
            };
          }
      
          return {
            items: [
              ...state.items,
              {
                product,
                variant: variant
                  ? {
                      curbura: variant.curbura,
                      grosime: variant.grosime,
                      marime: variant.marime,
                      price: variant.price,
                      stock: variant.stock,
                    }
                  : undefined,
                quantity,  // Modificat aici
              },
            ],
            error: null,
          };
        }),

      removeItem: (productId, variant) =>
        set((state) => {
          const isSameVariant = (variant1: any, variant2: any) => {
            if (!variant1 && !variant2) return true;
            if (!variant1 || !variant2) return false;
            return (
              variant1.curbura === variant2.curbura &&
              variant1.grosime === variant2.grosime &&
              variant1.marime === variant2.marime
            );
          };

          return {
            items: state.items.filter(
              (item) =>
                !(
                  item.product._id === productId &&
                  isSameVariant(item.variant, variant)
                )
            ),
            error: null,
          };
        }),

      updateQuantity: (productId, quantity, variant) =>
        set((state) => {
          const isSameVariant = (variant1: any, variant2: any) => {
            if (!variant1 && !variant2) return true;
            if (!variant1 || !variant2) return false;
            return (
              variant1.curbura === variant2.curbura &&
              variant1.grosime === variant2.grosime &&
              variant1.marime === variant2.marime
            );
          };

          const targetItem = state.items.find(
            (item) =>
              item.product._id === productId &&
              isSameVariant(item.variant, variant)
          );

          if (targetItem) {
            const availableStock = targetItem.variant?.stock ?? targetItem.product.stock;
            
            if (quantity > availableStock) {
              set({ error: "Cantitatea solicitată depășește stocul disponibil" });
              return state;
            }
          }

          return {
            items: state.items
              .map((item) =>
                item.product._id === productId &&
                isSameVariant(item.variant, variant)
                  ? { ...item, quantity: Math.max(0, quantity) }
                  : item
              )
              .filter((item) => item.quantity > 0),
            error: null,
          };
        }),

      clearBasket: () => set({ items: [], error: null }),

      // Item Queries
      getTotalPrice: () => {
        const items = get().items;
        const subtotal = items.reduce(
          (total, item) =>
            total +
            (item.variant?.price ?? item.product.price ?? 0) * item.quantity,
          0
        );
        const shippingCost = get().shippingCost ?? 0;
        const promoDiscount = get().promoDiscount;
        return subtotal + shippingCost - promoDiscount;
      },

      getItemCount: (productId) => {
        const items = get().items.filter((item) => item.product._id === productId);
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getGroupedItems: () => get().items,

      getOrderSummary: () => {
        const items = get().items;
        const subtotal = items.reduce(
          (total, item) =>
            total +
            (item.variant?.price ?? item.product.price ?? 0) * item.quantity,
          0
        );
        const shipping = get().shippingCost ?? 0;
        const promoDiscount = get().promoDiscount;
        return {
          subtotal,
          shipping,
          total: subtotal + shipping - promoDiscount,
        };
      },

      // Shipping & Payment
      setShippingAddress: (address) =>
        set({
          shippingAddress: {
            firstName: address.firstName,
            lastName: address.lastName,
            email: address.email,
            phone: address.phone,
            street: address.street,
            city: address.city,
            province: address.province,
            postalCode: address.postalCode,
          },
          error: null,
        }),

      setBillingAddress: (address) =>
        set({
          billingAddress: {
            isLegalEntity: address.isLegalEntity,
            ...(address.isLegalEntity && {
              companyName: address.companyName,
              cui: address.cui,
              tradeRegisterNumber: address.tradeRegisterNumber,
              companyAddress: address.companyAddress,
              companyCity: address.companyCity,
              companyCounty: address.companyCounty,
              companyPostalCode: address.companyPostalCode,
              bankName: address.bankName,
              iban: address.iban,
            }),
          },
          error: null,
        }),

      getShippingAddress: () => get().shippingAddress,
      getBillingAddress: () => get().billingAddress,

      setPaymentMethod: (method) =>
        set({
          paymentMethod: method,
          error: null,
        }),

      getPaymentMethod: () => get().paymentMethod,

      // Order Processing
      setProcessing: (status) => set({ isProcessing: status }),
      setError: (error) => set({ error }),
    }),
    {
      name: "basket-storage",
      partialize: (state) => ({
        items: state.items,
        shippingAddress: state.shippingAddress,
        billingAddress: state.billingAddress,
        paymentMethod: state.paymentMethod,
        userId: state.userId,
        currentStep: state.currentStep,
        shippingCost: state.shippingCost,
        promoCode: state.promoCode,
        promoDiscount: state.promoDiscount,
      }),
    }
  )
);

export default useBasketStore;