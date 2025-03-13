// class places with marker :
// methods:
//  show all, clear all, this.foreach((obj)=>{add listener...})

// Clear marker
//  marker: {marker, infoCard, marker}[]
export const clear = (markers: any[]) => {
  markers.forEach((obj: any) => {
    if (obj.marker && obj.infoCard && obj.clickListener) {
      google.maps.event.removeListener(obj.clickListener);
      obj.infoCard.close();
      obj.marker.setMap(null);
    }
  });
};

export const getLocation = (setLocation: Function) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }
};
