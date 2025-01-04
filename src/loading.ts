import { invoke } from "@tauri-apps/api/core";

// Loading.html
const messages = [
  "C:\\> Initializing temporal command prompt...",
  "HIMEM.SYS: Loading time displacement drivers",
  "AUTOEXEC.BAT: Loading temporal environment variables",
  "CONFIG.SYS: Allocating 640K of temporal memory",
  "SYSTEM.INI: Configuring parallel universe settings",
  "C:\\WINDOWS\\SYSTEM32> chkdsk /f /timescope:all",
  "Loading TIMEDRV.SYS.....................OK",
  "Checking temporal partition integrity........",
  "Scanning for cross-dimensional viruses [━━━━━━    ]",
  "TEMPORAL.DLL initialization sequence....COMPLETE",
  "Time bandwidth usage: 45.3%",
  "Chronological fragmentation detected: 23%",
  "[!] CRITICAL: Temporal paradox detected in sector 7G",
  "Error 404: Future not found. Retrying...",
  "Warning: Multiple instances of yourself detected",
  "Error 0x8707: Failed to synchronize parallel timelines",
  "BSOD: TEMPORAL_DRIVER_IRQL_NOT_LESS_OR_EQUAL",
  "Warning: Grandfather paradox prevention enabled",
  "Error: Unable to establish connection with timeline #458",
  "Critical: Temporal memory leak detected",
  "Warning: Butterfly effect cascade detected in sector 3",
  "Error: Failed to load previous save state of universe",
  "Great Scott! Preparing flux capacitor...",
  "Checking for Terminator interference in timeline...",
  "Scanning for Doctor Who's TARDIS signatures...",
  "WARNING: Bill & Ted detected in temporal vicinity",
  "Searching for John Connor across timelines...",
  "Loading Quantum Leap protocols...",
  "Checking if Half-Life 3 exists in target timeline...",
  "WARNING: Detected temporal anomaly in Springfield",
  "Scanning for Skynet activity...",
  "ERROR: Portal gun detected in temporal matrix",
  "Loading RealPlayer (Time Traveler's Edition)...",
  "Updating ICQ status across timelines...",
  "Defragmenting WinZip temporal archives...",
  "Loading QuickTime 4.0 temporal codecs...",
  "Initializing Windows Media Player skin randomizer...",
  "Loading Netscape Navigator quantum tunneling protocols...",
  "Updating Norton AntiVirus temporal definitions...",
  "Scanning AOL Keywords across dimensions...",
  "Loading Macromedia Flash time dilation module...",
  "Initializing mIRC temporal chat protocols...",
  "Recalibrating quantum temporal flux indicators...",
  "Synchronizing tachyon particle emitters...",
  "Initializing chrono-synchronous data buffers...",
  "Calculating probability matrices for butterfly effects...",
  "Optimizing parallel universe cache...",
  "Defragmenting quantum uncertainty fields...",
  "Compressing temporal data streams...",
  "Loading hyperspace bypass protocols...",
  "Initializing temporal encryption algorithms...",
  "Scanning for anomalies in the space-time continuum...",
  "[█████░░░░░] Temporal alignment: 47%",
  "Timeline synchronization: ||||||||░░░░░ 64%",
  "Loading temporal drivers: [===>    ] 35%",
  "Chronological calibration: ▓▓▓▓▓░░░░░ 53%",
  "Time stream integrity: [||||||||  ] 82%",
  "Paradox check: [●●●●○○○] 57%",
  "Timeline verification: [⣾⣽⣻⢿⡿⣟⣯⣷] 89%",
  "Loading time sectors: [□□■■■□□] 60%",
  "Temporal sync status: [▰▰▰▱▱] 66%",
  "Quantum alignment: [⬆⬆⬇⬇⬅➡] 73%",
  "Loading saved game from alternate timeline...",
  "Checking for cheat codes across dimensions...",
  "ERROR: Memory Card from future timeline detected",
  "Loading Sierra Adventure time travel module...",
  "WARNING: Pokemon from future generations detected",
  "Scanning for temporal achievements...",
  "Loading Duke Nukem Forever (Original Timeline)...",
  "ERROR: Contra cheat code temporal paradox detected",
  "WARNING: Sonic is running through multiple timelines",
  "Loading Microsoft Time Travel Pinball...",
];

function getRandomLoadingMessage(): string {
  if (messages.length === 0) {
    return "Loading...";
  }

  let index = Math.floor(Math.random() * messages.length);
  return messages.splice(index, 1)[0];
}

async function setWallpaper(path: string) {
  await invoke("set_wallpaper", { path });
}

async function findEvent(settings: {
  year: string;
  month: string;
  day: string;
  era: string;
  longitude: string;
  latitude: string;
  sqwimble: string;
  deterministic: string;
}): Promise<string> {
  console.log(settings);
  return invoke("find_event", {
    year: settings.year,
    month: settings.month,
    day: settings.day,
    era: settings.era,
    longitude: settings.longitude,
    latitude: settings.latitude,
    sqwimble: settings.sqwimble,
    deterministic: settings.deterministic.toString(),
  });
}

async function loadingComplete(
  eventPromise: Promise<string>,
  wallpaperPromise: Promise<void> | null,
  settings: any
) {
  if (wallpaperPromise !== null) {
    await wallpaperPromise;
  }

  let event_info = await eventPromise;
  localStorage.setItem("event", event_info);


  if (settings.assume === true) {
    await setWallpaper(JSON.parse(event_info).path);  
  }

  window.location.href = "result.html";
}

window.onload = async () => {
  let travel = Math.floor(Math.random() * 3) + 1;

  console.log(travel);


  let settings = JSON.parse(localStorage.getItem("settings")!);

  let wallpaperPromise = null;
  if (settings.assume === true) {
    wallpaperPromise = setWallpaper("travel_" + travel + ".png");
  }

  let eventPromise = findEvent(settings);

  let progress = (<HTMLInputElement>(
    document.getElementById("loading-progress")
  ))!;

  let terminal = document.getElementById("terminal")!;

  if (!progress || !terminal) {
    return;
  }

  terminal.innerHTML += `time-tavel --date ${settings.year}-${settings.month}-${settings.day} --location ${settings.latitude},${settings.longitude} --sqwimble ${settings.sqwimble} --deterministic ${settings.deterministic} --assume ${settings.assume}\n`;

  progress.max = (Math.random() * 250 + 100).toString();

  progress.value = "0";

  let update = setInterval(() => {
    progress.value += 1;

    if (progress.value >= progress.max) {
      clearInterval(update);
      loadingComplete(eventPromise, wallpaperPromise, settings);
    }

    if (Math.random() < 0.2) {
      terminal.innerHTML += getRandomLoadingMessage() + "\n";
      terminal.scrollTop = terminal.scrollHeight;
    }

    terminal.scrollTop = terminal.scrollHeight;
  }, 75);
};
