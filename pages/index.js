import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import Card from '../components/card'

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [result, setResult] = useState();
  const [imageUrl, setImageUrl] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          animal: animalInput,
          color: colorInput,
          useStableDiffusion: true
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setResult(data.result);
      setImageUrl(data.imageUrl);
      setAnimalInput("");
      setColorInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }
  
  async function onRequestNewImage(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardInfo: result,
          color: colorInput,
          useStableDiffusion: true
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setImageUrl(data.imageUrl);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Card Generator</title>
        <link rel="icon" href="/dog.png" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,1,0" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Choose a card type</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter a card type (Artifact, Creature, Instant, Sorcery etc.)"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input
            type="text"
            name="color"
            placeholder="Color (optional)"
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
          />
          <input type="submit" value="Generate a Card" />
          <input type="button" value="Request New Image" onClick={onRequestNewImage} />
        </form>
        <Card result={result} imageUrl={imageUrl} />
      </main>
    </div>
  );
}
