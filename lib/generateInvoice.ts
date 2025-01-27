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
}

export async function generateInvoice(
  orderNumber: string,
  items: InvoiceItem[],
  billingDetails?: BillingDetails,
  isCompany: boolean = false
) {
  const invoice = {
    companyVatCode: process.env.SMARTBILL_VAT_CODE,
    client: {
      name: isCompany ? billingDetails?.companyName : "Persoană Fizică",
      country: "Romania",
      vatCode: isCompany ? billingDetails?.cui || "" : "",
      regCom: isCompany ? billingDetails?.tradeRegisterNumber || "" : "",
      address: billingDetails?.companyAddress || "",
      city: billingDetails?.companyCity || "",
      county: billingDetails?.companyCounty || "",
      isTaxPayer: false,
      saveToDb: false
    },
    seriesName: process.env.SMARTBILL_SERIES_NAME,
    // number: orderNumber,
    isDraft:false,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    deliveryDate: new Date().toISOString().split('T')[0],
    precision: 2,
    products: items.map(item => ({
      name: item.productName,
      quantity: item.quantity,
      price: item.price,
      taxName: "Redusa",
      currency: "RON",
      taxPercentage: 19,
      measuringUnitName: "buc",   
      isTaxIncluded: true,
      saveToDb: false,
      isService:false
    })),
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
