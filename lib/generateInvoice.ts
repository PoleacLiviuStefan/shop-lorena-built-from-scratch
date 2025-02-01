interface InvoiceItem {
  productName: string;
  quantity: number;
  price: number;
 }
 
 interface BillingDetails {
  companyName?: string;
  cui?: string;
  tradeRegisterNumber?: string;
  companyAddress?: string;
  companyCity?: string;
  companyCounty?: string;
  bankName?: string;
  iban?: string;
 }
 
 interface CustomerDetails {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  county: string;
 }
 
 export async function generateInvoice(
  orderNumber: string,
  items: InvoiceItem[],
  billingDetails?: BillingDetails,
  isCompany: boolean = false,
  customerDetails?: CustomerDetails,
  shippingCost: number = 0,
  discountPercentage: number = 0
 ) {
  // Calculăm subtotalul înainte de discount
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
 
  // Creem array-ul complet de produse
  const allProducts = [
    ...items.map(item => ({
      name: item.productName,
      quantity: item.quantity,
      price: item.price,
      taxName: "Redusa",
      currency: "RON",
      taxPercentage: 19,
      measuringUnitName: "buc",
      isTaxIncluded: true,
      saveToDb: false,
      isService: false
    }))
  ];
 
  // Adăugăm costul de livrare doar dacă există și e mai mare ca 0
  if (shippingCost > 0) {
    allProducts.push({
      name: "Cost Livrare",
      quantity: 1,
      price: shippingCost,
      taxName: "Redusa",
      currency: "RON",
      taxPercentage: 19,
      measuringUnitName: "buc",
      isTaxIncluded: true,
      saveToDb: false,
      isService: true
    });
  }
 
  // Adăugăm discountul doar dacă există și e mai mare ca 0
  if (discountPercentage > 0) {
    const discountAmount = (subtotal * discountPercentage) / 100;
    allProducts.push({
      name: `Discount ${discountPercentage}%`,
      quantity: 1,
      price: -discountAmount, // preț negativ pentru discount
      taxName: "Redusa",
      currency: "RON",
      taxPercentage: 19,
      measuringUnitName: "buc",
      isTaxIncluded: true,
      saveToDb: false,
      isService: true
    });
  }
 
  const invoice = {
    companyVatCode: process.env.SMARTBILL_VAT_CODE,
    client: {
      name: isCompany 
        ? billingDetails?.companyName 
        : customerDetails 
          ? `${customerDetails.firstName} ${customerDetails.lastName}`
          : "Persoană Fizică",
      country: "Romania",
      vatCode: isCompany ? billingDetails?.cui || "" : "",
      regCom: isCompany ? billingDetails?.tradeRegisterNumber || "" : "",
      address: isCompany 
        ? billingDetails?.companyAddress 
        : customerDetails?.address || "",
      city: isCompany 
        ? billingDetails?.companyCity 
        : customerDetails?.city || "",
      county: isCompany 
        ? billingDetails?.companyCounty 
        : customerDetails?.county || "",
      isTaxPayer: false,
      saveToDb: false
    },
    seriesName: process.env.SMARTBILL_SERIES_NAME,
    isDraft: false,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    deliveryDate: new Date().toISOString().split('T')[0],
    precision: 2,
    products: allProducts,
    // Adăugăm detaliile bancare doar pentru companii
    mentionsData: isCompany && billingDetails?.bankName && billingDetails?.iban ? {
      mentions: [
        {
          name: "Detalii Bancare",
          value: `Banca: ${billingDetails.bankName}, IBAN: ${billingDetails.iban}`
        }
      ]
    } : undefined
  };
 
  try {
    const response = await fetch('https://ws.smartbill.ro/SBORO/api/invoice', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.SMARTBILL_USERNAME}:${process.env.SMARTBILL_API_TOKEN}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoice),
    });
 
    if (!response.ok) {
      const errorData = await response.text();
      console.error('SmartBill error:', errorData);
      throw new Error(`Failed to generate invoice: ${errorData}`);
    }
 
    return await response.json();
  } catch (error) {
    console.error('Error details:', error);
    throw error;
  }
 }