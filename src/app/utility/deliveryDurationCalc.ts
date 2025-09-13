export const deliveryDurationCalc = (pickedUpTime: string)=>{
    const now = new Date().getTime();
        const pickedUp = new Date(pickedUpTime).getTime();

        const diffMs = now - pickedUp; 
        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return `${hours}h ${minutes}m`
}