export function formatCurrency(
    amount: number,
    currencyCode: string ="lei"
) : string {
    try{
        return new Intl.NumberFormat("ro-RO", {
        style: "currency",
        currency: currencyCode.toUpperCase()
    }).format(amount);
} catch(error){
    console.log("Invalid currency code: ", currencyCode,error);
    return `${currencyCode.toUpperCase()} ${amount.toFixed(2)}`;
}
}