import { useState, useMemo } from "react";
import "./App.css";

const sentences = [
  "Some feelings don’t fade\njust because time moves on.",
  "On New Year’s night,\nI spoke honestly,\nfrom where I stood.",
  "You were honest too,\nabout where your heart was.",
  "This isn’t me asking again.",
  "It’s just me saying —\nI’m still here.",
  "If you ever feel like talking,\nyou know where to find me."
];

const emojis = ["🤍", "😊", "😶", "🥺", "🌙", "✨", "💭"];

function App() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [hearts, setHearts] = useState([]);
  const [stage, setStage] = useState("story");
  const [selected, setSelected] = useState([]);
  const [pressed, setPressed] = useState(false);

  // ❤️ 40 hearts around ALL sides
  const frameHearts = useMemo(() => {
    return Array.from({ length: 40 }).map(() => {
      const side = Math.floor(Math.random() * 4); // 0 top, 1 right, 2 bottom, 3 left

      let top = "0%";
      let left = "0%";

      if (side === 0) {
        // top
        top = `${Math.random() * 12}%`;
        left = `${Math.random() * 90}%`;
      } else if (side === 1) {
        // right
        top = `${Math.random() * 90}%`;
        left = `${88 + Math.random() * 8}%`;
      } else if (side === 2) {
        // bottom
        top = `${88 + Math.random() * 8}%`;
        left = `${Math.random() * 90}%`;
      } else {
        // left
        top = `${Math.random() * 90}%`;
        left = `${Math.random() * 12}%`;
      }

      return {
        top,
        left,
        rotate: `${-30 + Math.random() * 60}deg`,
        opacity: 0.25 + Math.random() * 0.25,
        size: 0.55 + Math.random() * 0.5 + "rem",
        driftX: -8 + Math.random() * 16,
        driftY: -8 + Math.random() * 16
      };
    });
  }, []);

  const nextSentence = () => {
    if (index >= sentences.length - 1) {
      setStage("emoji");
      return;
    }

    setPressed(true);
    setTimeout(() => setPressed(false), 260);

    const newHearts = Array.from({ length: 7 }).map(() => ({
      id: Math.random(),
      x: -36 + Math.random() * 72,
      y: -110
    }));

    setHearts([]);
    requestAnimationFrame(() => setHearts(newHearts));
    setTimeout(() => setHearts([]), 4600);

    setVisible(false);
    setTimeout(() => {
      setIndex((prev) => prev + 1);
      setVisible(true);
    }, 1600);
  };

  const toggleEmoji = (e) => {
    setSelected((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]
    );
  };

  const sendToWhatsApp = () => {
    const msg = encodeURIComponent(selected.join(""));
    window.location.href = `https://wa.me/9562786493?text=${msg}`;
  };

  return (
    <div className="container">
      <div className="glass-card">
        {/* ❤️ hearts on all sides */}
        {frameHearts.map((h, i) => (
          <span
            key={i}
            className="frame-heart"
            style={{
              top: h.top,
              left: h.left,
              transform: `translate(${h.driftX}px, ${h.driftY}px) rotate(${h.rotate})`,
              opacity: h.opacity,
              fontSize: h.size
            }}
          >
            ♡
          </span>
        ))}

        {stage === "story" && (
          <>
            <div className="content-area">
              <p className={`text ${visible ? "show" : ""}`}>
                {sentences[index].split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            </div>

            <div className="heart-area">
              <div className="button-wrapper">
                {hearts.map((h) => (
                  <span
                    key={h.id}
                    className="floating-heart"
                    style={{
                      "--x": `${h.x}px`,
                      "--y": `${h.y}px`
                    }}
                  >
                    ♡
                  </span>
                ))}

                <button
                  className={`love-btn ${pressed ? "pressed" : ""}`}
                  onClick={nextSentence}
                >
                  ♡
                </button>
              </div>
            </div>
          </>
        )}

        {stage === "emoji" && (
          <div className="emoji-section">
            <div className="emoji-grid">
              {emojis.map((e) => (
                <button
                  key={e}
                  className={`emoji-btn ${selected.includes(e) ? "active" : ""}`}
                  onClick={() => toggleEmoji(e)}
                >
                  {e}
                </button>
              ))}
            </div>

            <button
              className="send-btn"
              disabled={selected.length === 0}
              onClick={sendToWhatsApp}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;