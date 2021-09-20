export default function(num){
    const currency=new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(num)
    return currency;
}