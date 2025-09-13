import axios from "axios";
import { Types } from "mongoose";

export interface IAllDeliveryAgent{
  _id: Types.ObjectId;
  name: String;
  phone: String;
  currentLocation: { latitude: number; longitude: number; }
}

export async function getETA(pickupLat: number, pickupLng: number, allAvailableDeliveryAgent: IAllDeliveryAgent[]) {

  let min_eta = Infinity
  let selectedDeliveryAgent = null
  let durationAndDistance = {
    duration: 0,
    distance: 0
  }
  let displayDuration: number;
  let durationUnit: string;
  let displayDistance: number;
  let distanceUnit: string;

  for(let i = 0; i < allAvailableDeliveryAgent.length; i++){

    let riderLat = allAvailableDeliveryAgent[i].currentLocation.latitude
    let riderLng = allAvailableDeliveryAgent[i].currentLocation.longitude

    console.log(riderLat, riderLng)

    const url = `http://router.project-osrm.org/route/v1/driving/${riderLng},${riderLat};${pickupLng},${pickupLat}?overview=false`;
    
    try {
      const res = await axios.get(url);
      console.log("duration", res.data.routes[0].duration/60)
      console.log("distance", res.data.routes[0].distance)

      if(min_eta > res.data.routes[0].duration){
        min_eta = res.data.routes[0].duration
        selectedDeliveryAgent = allAvailableDeliveryAgent[i]
        durationAndDistance = {
          duration: res.data.routes[0].duration,
          distance: res.data.routes[0].distance
        }
      }

    } catch (err) {
      console.error("OSRM error:", err);
      continue
    }
  }

  const durationSec = durationAndDistance.duration;
  const distanceMeters = durationAndDistance.distance;

  if (durationSec >= 3600) {
    displayDuration = durationSec / 3600;
    durationUnit = "h";
  } else {
    displayDuration = durationSec / 60;
    durationUnit = "min";
  }
  
  if (distanceMeters >= 1000) {
    displayDistance = distanceMeters / 1000;
    distanceUnit = "km";
  } else {
    displayDistance = distanceMeters;
    distanceUnit = "m";
  }
  
  displayDuration = parseFloat(displayDuration.toFixed(2));
  displayDistance = parseFloat(displayDistance.toFixed(2));
  
  return {
    selectedDeliveryAgent,
    duration: displayDuration,
    durationUnit,
    distance: displayDistance,
    distanceUnit
  };
}
