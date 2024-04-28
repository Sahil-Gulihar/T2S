import { useRef, useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState<string>("");
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [audioKey, setAudioKey] = useState<number>(0);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const convertTextToSpeech = async () => {
    try {
      const response = await fetch("https://t2s-server.onrender.com/t2s", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        setAudioSrc(audioUrl);
        setAudioKey((prevKey) => prevKey + 1);

        if (audioPlayerRef.current) {
          audioPlayerRef.current.pause();
          audioPlayerRef.current.load();
        }
      } else {
        throw new Error("Failed to convert text to speech");
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <h1>Text to Speech</h1>
      <textarea
        id="textInput"
        rows={4}
        cols={50}
        placeholder="Enter text here..."
        value={text}
        onChange={handleTextChange}
      ></textarea>
      <br />
      <button onClick={convertTextToSpeech}>Convert to Speech</button>
      <br />
      {audioSrc && (
        <audio
          controls
          key={audioKey}
          ref={(audio) => (audioPlayerRef.current = audio)}
          id="audioPlayer"
        >
          <source src={audioSrc} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
      <div style={{ color: "#666" }}>
        <a
          href="https://github.com/Sahil-Gulihar"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#666",
            textDecoration: "none",
            transition: "color 0.3s, font-size 0.3s",
          }}
          onMouseOver={(e) => {
            const target = e.target as HTMLElement;
            target.style.color = "#fff";
            target.style.fontSize = "1.1em";
          }}
          onMouseOut={(e) => {
            const target = e.target as HTMLElement;
            target.style.color = "#666";
            target.style.fontSize = "1em";
          }}
        >
          GitHub
        </a>{" "}
        |{" "}
        <a
          href="https://www.linkedin.com/in/sahil-gulihar-130573249/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#666",
            textDecoration: "none",
            transition: "color 0.3s, font-size 0.3s",
          }}
          onMouseOver={(e) => {
            const target = e.target as HTMLElement;
            target.style.color = "#fff";
            target.style.fontSize = "1.1em";
          }}
          onMouseOut={(e) => {
            const target = e.target as HTMLElement;
            target.style.color = "#666";
            target.style.fontSize = "1em";
          }}
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
}

export default App;
