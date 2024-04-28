import { useRef, useState } from 'react'
import './App.css'

function App() {
  const [text, setText] = useState<string>("");
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [audioKey, setAudioKey] = useState<number>(0); // Unique key
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
        setAudioKey((prevKey) => prevKey + 1); // Update key to force re-render

        if (audioPlayerRef.current) {
          audioPlayerRef.current.pause();
          audioPlayerRef.current.load(); // Reload the audio element to ensure it plays the new source
        }
      } else {
        throw new Error("Failed to convert text to speech");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  return (
    <div>
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <audio
            controls
            key={audioKey}
            ref={(audio) => (audioPlayerRef.current = audio)}
            id="audioPlayer"
            style={{ marginRight: '10px' }}
          >
            <source src={audioSrc} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <a
            href={audioSrc}
            download="audio.mp3"
            style={{
              display: 'block',
              margin: '0 auto',
              padding: '0.5rem 1rem', // Reduced padding
              fontSize: '0.9rem', // Reduced font size
              backgroundColor: '#ff6347',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ff7f50';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ff6347';
            }}
          >
            Download
          </a>
        </div>
      )}
    </div>
  );
}

export default App;