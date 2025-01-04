window.onload = () => {
    let settings = JSON.parse(localStorage.getItem('settings')!);
    let event = JSON.parse(localStorage.getItem('event')!);
    
    if (settings && event) {
        (<HTMLInputElement>document.getElementById('year')!).value = event.time.year;
        (<HTMLInputElement>document.getElementById('month')!).value = event.time.month;
        (<HTMLInputElement>document.getElementById('day')!).value = event.time.day;
        (<HTMLInputElement>document.getElementById('era')!).value = event.time.era;
        (<HTMLInputElement>document.getElementById('sqwimble')!).value = settings.sqwimble;
        (<HTMLInputElement>document.getElementById('latitude')!).value = event.location.latitude;
        (<HTMLInputElement>document.getElementById('longitude')!).value = event.location.longitude;
        (<HTMLInputElement>document.getElementById('deterministic')!).checked = settings.deterministic;
        (<HTMLInputElement>document.getElementById('assume')!).checked = settings.assume;
    };
};

document.getElementById('start')?.addEventListener('click', () => {
    let settings = {
      year: (<HTMLInputElement> document.getElementById('year'))?.value,
      month: (<HTMLInputElement> document.getElementById('month'))?.value,
      day: (<HTMLInputElement> document.getElementById('day'))?.value,
      era: (<HTMLInputElement> document.getElementById('era'))?.value,
      sqwimble: (<HTMLInputElement> document.getElementById('sqwimble'))?.value,
      longitude: (<HTMLInputElement> document.getElementById('longitude'))?.value,
      latitude: (<HTMLInputElement> document.getElementById('latitude'))?.value,
      deterministic: (<HTMLInputElement> document.getElementById('deterministic'))?.checked,
      assume: (<HTMLInputElement> document.getElementById('assume'))?.checked,
    };
  
    localStorage.setItem('settings', JSON.stringify(settings));
    
    window.location.href = 'loading.html';
  });
  
  