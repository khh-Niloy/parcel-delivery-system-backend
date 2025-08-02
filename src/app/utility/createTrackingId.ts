export const createTrackingId = ()=>{
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const randomNumber = Math.floor(10000 + Math.random() * 90000);

    return `TRK-${year}${month}${day}-${randomNumber}`
}