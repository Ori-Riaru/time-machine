document.getElementById('return')?.addEventListener('click', () => {
    window.location.href = 'index.html';
});

window.onload = () => {
    let event = JSON.parse(localStorage.getItem('event')!);

    document.getElementById('image')!.style.background = `url(../src-tauri/wallpapers/${event.path})`;
    document.getElementById('eventName')!.innerHTML = event.event;
    document.getElementById('description')!.innerHTML = event.description;
    document.getElementById('time')!.innerHTML = event.time.day + "/" + event.time.month + "/" + event.time.year;
    document.getElementById('location')!.innerHTML = event.location.latitude + ", " + event.location.longitude;
};