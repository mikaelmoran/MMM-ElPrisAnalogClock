/* global Module, Log */

Module.register("MMM-ElPrisAnalogClock", {
  getStyles() {
    return ["MMM-ElPrisAnalogClock.css"];
  },

  defaults: {
    updateInterval: 60000,
    apiEndpoint:    "https://www.elprisetjustnu.se/api/v1/prices/",
    region:         "SE4",
    clockSize:      300,
    ringThickness:  20
  },

  start() {
    Log.info("Startar MMM-ElPrisAnalogClock…");
    this.elprisData  = [];
    this.currentTime = new Date();
    this.getData();
    setInterval(() => {
      this.currentTime = new Date();
      this.updateDom();
    }, 1000);
    setInterval(() => this.getData(), this.config.updateInterval);
  },

  getData() {
    this.sendSocketNotification("GET_ELPRIS", {
      apiEndpoint: this.config.apiEndpoint,
      region:      this.config.region
    });
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "ELPRIS_RESULT") {
      this.elprisData = payload;
      this.updateDom();
    }
  },

  getDom() {
    const cfg = this.config;
    const now = this.currentTime;

    const wrapper = document.createElement("div");
    wrapper.className = "elpris-container";
    wrapper.style.width  = cfg.clockSize + "px";
    wrapper.style.height = cfg.clockSize + "px";
    wrapper.style.position = "relative";

    const ring = document.createElement("div");
    ring.className = "gradient-ring";
    Object.assign(ring.style, {
      width:        "100%",
      height:       "100%",
      borderRadius: "50%",
      boxSizing:    "border-box",
      padding:      cfg.ringThickness + "px",
      position:     "absolute",
      top:          "0",
      left:         "0"
    });

    const priser = this.elprisData
      .slice(0,24)
      .map(d => d.SEK_per_kWh)
      .filter(p => typeof p === "number");
    const total = priser.reduce((sum,p) => sum + p, 0);
    const avg   = priser.length ? total / priser.length : 0;

    const sections = [];
    for (let i = 0; i < 24; i++) {
      const p = (this.elprisData[i]||{}).SEK_per_kWh || 0;
      let color;
      if (p <= avg * 0.6)         color = "#008800";
      else if (p <= avg * 0.9)    color = "#00cc00";
      else if (p <  avg * 1.15)   color = "#ffff00";
      else if (p <  avg * 1.4)    color = "#ff7700";
      else                         color = "#dd0000";
      const startDeg = i * 15;
      const endDeg   = startDeg + 15;
      sections.push(`${color} ${startDeg}deg ${endDeg}deg`);
    }
    ring.style.background = `conic-gradient(${sections.join(",")})`;
    wrapper.appendChild(ring);

    const face = document.createElement("div");
    face.className = "clock-face";
    Object.assign(face.style, {
      width:        "100%",
      height:       "100%",
      borderRadius: "50%",
      background:   "rgba(255,255,255,0.9)",
      position:     "relative",
      display:      "flex",
      alignItems:   "center",
      justifyContent: "center"
    });
    ring.appendChild(face);

    const numRad = (cfg.clockSize/2 - cfg.ringThickness) - 20;
    for (let i = 0; i < 24; i++) {
      const num = document.createElement("div");
      num.className = "clock-number";
      num.innerText = i;
      Object.assign(num.style, {
        position: "absolute",
        left:     "50%",
        top:      "50%",
        transform:
          `rotate(${i*15}deg)
           translate(0, -${numRad}px)
           rotate(${-i*15}deg)
           translate(-50%, -50%)`
      });
      face.appendChild(num);
    }

    const outerR     = cfg.clockSize / 2;
    const markerRadius = outerR - cfg.ringThickness / 2;
    const angle = (now.getHours() * 15) - 90;

    const marker = document.createElement("div");
    marker.className = "hour-marker";
    Object.assign(marker.style, {
      position:     "absolute",
      top:          "50%",
      left:         "50%",
      width:        `${cfg.ringThickness}px`,
      height:       `${cfg.ringThickness}px`,
      marginLeft:   `-${cfg.ringThickness/2}px`,
      marginTop:    `-${cfg.ringThickness/2}px`,
      borderRadius: "50%",
      background:   "#000",
      transform:    `rotate(${angle}deg) translateX(${markerRadius}px)`,
      transformOrigin: "0% 50%",
      animation:    "blink 1s infinite"
    });
    wrapper.appendChild(marker);

    const priceNow = ((this.elprisData[now.getHours()]||{}).SEK_per_kWh || 0).toFixed(2);
    const info = document.createElement("div");
    info.className = "price-text";
    info.innerHTML =
      `Pris nu:<br>${priceNow} kr/kWh<br>` +
      `Snitt:<br>${avg.toFixed(2)} kr/kWh`;
    face.appendChild(info);

    return wrapper;
  }
});
