// QULO5 RADIO PLAYER – v1.0
// Stream: Radiojar (dk8hw12e7wcwv/master)
// Features: Now Playing + CC License / Source + AI Tag Detection + Responsive Design

document.addEventListener("DOMContentLoaded", async function () {
  const container = document.getElementById("qulo5-player-container");

  // --- PLAYER STYLES ---
  const style = document.createElement("style");
  style.innerHTML = `
    #qulo5-player {
      max-width: 360px;
      margin: 20px auto;
      background: rgba(15, 15, 15, 0.85);
      color: #f6e6b4;
      font-family: "Inter", sans-serif;
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
      text-align: center;
    }
    #qulo5-player h2 {
      font-size: 1.2rem;
      margin-bottom: 8px;
      color: #fff5d0;
    }
    #qulo5-player p {
      margin: 4px 0;
      font-size: 0.95rem;
    }
    #qulo5-player audio {
      width: 100%;
      margin-top: 10px;
      outline: none;
      border-radius: 8px;
    }
    .meta {
      margin-top: 8px;
      font-size: 0.85rem;
      color: #c9b574;
    }
    @media (max-width: 480px) {
      #qulo5-player {
        width: 90%;
        padding: 16px;
      }
      #qulo5-player h2 {
        font-size: 1rem;
      }
      #qulo5-player p {
        font-size: 0.85rem;
      }
    }
  `;
  document.head.appendChild(style);

  // --- CREATE PLAYER UI ---
  const player = document.createElement("div");
  player.id = "qulo5-player";
  player.innerHTML = `
    <h2>QuLo5 Radio</h2>
    <p id="track-title">Loading current track...</p>
    <p id="track-artist"></p>
    <p class="meta" id="track-meta"></p>
    <audio id="audio" controls autoplay>
      <source src="https://stream.radiojar.com/dk8hw12e7wcwv/master" type="audio/mpeg">
    </audio>
  `;
  container.appendChild(player);

  const titleEl = document.getElementById("track-title");
  const artistEl = document.getElementById("track-artist");
  const metaEl = document.getElementById("track-meta");

  // --- FETCH NOW PLAYING INFO ---
  async function updateNowPlaying() {
    try {
      const res = await fetch("https://api.radiojar.com/v2/stations/dk8hw12e7wcwv/now_playing/");
      const data = await res.json();

      if (data && data.title) {
        const title = data.title || "Unknown Title";
        const artist = data.artist || "Unknown Artist";
        titleEl.textContent = title;
        artistEl.textContent = artist;

        // Detect tags (CC license, AI, Source)
        const tags = data.tags ? data.tags.join(", ").toLowerCase() : "";
        let metaText = "";

        if (tags.includes("cc by") || tags.includes("cc-by")) {
          metaText += "License: CC BY";
        } else if (tags.includes("cc0")) {
          metaText += "License: CC0";
        }

        if (tags.includes("fma")) {
          metaText += metaText ? " | Source: FMA" : "Source: FMA";
        } else if (tags.includes("ccmixter")) {
          metaText += metaText ? " | Source: ccMixter" : "Source: ccMixter";
        } else if (tags.includes("jamendo")) {
          metaText += metaText ? " | Source: Jamendo" : "Source: Jamendo";
        }

        if (tags.includes("ai") || tags.includes("ai-generated")) {
          metaText += metaText ? " | AI-generated" : "AI-generated";
        }

        metaEl.textContent = metaText || "";
      } else {
        titleEl.textContent = "Currently offline";
        artistEl.textContent = "";
        metaEl.textContent = "";
      }
    } catch (err) {
      titleEl.textContent = "Unable to load track info";
      artistEl.textContent = "";
      metaEl.textContent = "";
    }
  }

  updateNowPlaying();
  setInterval(updateNowPlaying, 20000); // refresh every 20s
});
