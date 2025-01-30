export interface ProductVariant {
    curbura?: string; // Curbura produsului (ex: C, D)
    grosime?: string; // Grosimea produsului (ex: 0.07mm, 0.10mm)
    marime?: string; // Mărimea produsului (ex: 8mm, 10mm)
    price?: number; // Prețul variantei
    stock?: number; // Stocul disponibil pentru această variantă
  }
  
  export interface Product {
    name: string; // Numele produsului
    quantity: number; // Cantitatea comandată
    price: number; // Prețul produsului
    productId: string; // ID-ul unic al produsului în baza de date
    variant?: ProductVariant; // Detalii despre variantă, dacă există
  }
  
  export interface BillingAddress {
    companyName?: string; // Numele companiei (pentru persoane juridice)
    cui?: string; // Codul unic de identificare (CUI)
    tradeRegisterNumber?: string; // Număr înregistrare Registrul Comerțului
    companyAddress?: string; // Adresa companiei
    companyCity?: string; // Orașul companiei
    companyCounty?: string; // Județul companiei
    isLegalEntity?: boolean; // Indică dacă adresa este pentru o persoană juridică
  }
  