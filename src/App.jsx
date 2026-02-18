import { useState, useEffect } from 'react'
import fairyLight from './assets/fairyNormal.gif'
import fairyDark from './assets/dark.gif'
import bgMusic from './assets/78-Sun Room (Alone with Relaxing Tea).mp3'
import apiMagic from './assets/yoba.wav'
import typing from './assets/dialogueCharacter.wav'
import './App.css'

function TextInput({ text, setText, aud }) {
  const handleChange = (event) => {
    setText(event.target.value);
    if(aud){
      aud.currentTime = 0;
      aud.play();
    }
  }
  return (
    <div>
      <input type = "text" value = {text} onChange = {handleChange}
            className = "text-input"/>
    </div>
  )
}

function CheckBoxes({ check, setCheck, aud }) {
  const handleChange = (event) => {
    setCheck(event.target.checked);
    if(aud){
      aud.play();
    }
  }
  return(
    <div>
      <input type = "checkbox" checked = {check} onChange = {handleChange}
            className = "checkbox" />
    </div>
  )
}

function DropdownComplex({index, setIndex}) {
  const [selectedOption, setSelectedOption] = useState('weather');
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('weather');
  const handleChange = (option) => {
    setSelectedOption(option.value);
    setIndex(option.idx);
    setName(option.label);
    //console.log(index);
    //console.log(option);
  }
  const options = [
    { value: 'weather', label: 'weather', idx: 0 },
    { value: 'city', label: 'pokemon', idx: 1 },
    { value: 'gambling', label: 'gambling', idx: 2 },
  ];

  return(
    <div className = "dropdown">
      <div onClick = {() => setOpen(!open)}>
        i am a fairy of {name} <span> {open ? '▲' : '▼'} </span>
        <p style = {{fontSize: '6px'}}>(this is a dropdown menu btw)</p>
      </div>
      <br />
      {open && (
        <div className = "menu">
          {options.map((option) => (
            <div key={option.label} onClick={() => handleChange(option)}>
              <input type = "checkbox" checked = {option.value === selectedOption} readOnly />
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Eggs({text}){
  if (text === 'claire' || text === 'Claire'){
    return (<p> blud is cute </p>)
  }
  return null;  
}

function IndexToAPI({ lat, setLat, long, setLong, index, city, setCity, slug, setSlug, aud }) {
  //console.log(index);
  if (index === 1){
    return (
      <div>
        <p>whats the pokemon?</p>
        <TextInput text = {city} setText = {setCity} id = "city" aud = {aud} />
      </div>
    )
  }else if(index === 2){
    return (
      <div>
        <p>whats the slug (this is complex dw)?</p>
        <TextInput text = {slug} setText = {setSlug} id = "slug" aud = {aud} />
      </div>
    )
  }else if(index === 0){
    return(
      <div>
        <p> whats the latitude for ur location?</p>
        <TextInput text = {lat} setText = {setLat} id = "latitude" aud = {aud} />
        <p> whats the longitude for ur location?</p>
        <TextInput text = {long} setText = {setLong} id = "longitude" aud = {aud} />
      </div>
    )
  }
}

function Background({ music, musicLoaded, setMusicLoaded }) {
  useEffect(() => {
    if (music && !musicLoaded) {
      music.loop = true;
      music.volume = 0.5;
      music.play();
      setMusicLoaded(true);
    }
  }, [music, musicLoaded, setMusicLoaded]);
  
  return null; // This component doesn't render anything
}

function App() {
  const [text, setText] = useState('local fairy');
  const [age, setAge] = useState('18');
  const [work, setWork] = useState('fairy idk');
  const [broke, setBroke] = useState(true);
  const [dark, setDark] = useState(false);
  const [index, setIndex] = useState(0);
  const [lat, setLat] = useState('40.425869');
  const [long, setLong] = useState('-86.908066');
  const [city, setCity] = useState('dragonite');
  const [slug, setSlug] = useState('will-gavin-newsom-win-the-2028-democratic-presidential-nomination-568');
  const ageNumber = Number(age);
  const hasValidAge = Number.isFinite(ageNumber);
  const era = hasValidAge
    ? (ageNumber > 2026 ? ' BC' : ' AD')
    : ', i was never born in the first place <3';
  const birthYear = Math.abs(hasValidAge ? 2026 - ageNumber : '???');
  const moneyMessage = broke ? 'lowkey i need money pleas give me some' : 'im not poor im ballin trust';
  const image = dark ? fairyDark : fairyLight;

  const workMessage = work ? `i work as a ${work}` : 'i dont have a job :( im unemployed';
  const nepoBaby = !work && !(broke) ? 'so therefore im a nepo baby' : null;

  const [bgm, setBgm] = useState(null);
  const [typingAudio, setTypingAudio] = useState(null);
  const [apiAudio, setApiAudio] = useState(null);
  const [musicLoaded, setMusicLoaded] = useState(false);

  useEffect(() => {
    const bgmInstance = new Audio(bgMusic);
    const typingInstance = new Audio(typing);
    const apiInstance = new Audio(apiMagic);
    setBgm(bgmInstance);
    setTypingAudio(typingInstance);
    setApiAudio(apiInstance);
  }, [])
    

  useEffect(() => {
    if (dark === true) {
      document.documentElement.style.setProperty('--background-color', '#41394d');
      //console.log('dark mode enabled');
    } else {
      document.documentElement.style.setProperty('--background-color', '#584c6c');
      //console.log('light mode activated');
    }
    //console.log(dark);
  }, [dark]);

  //console.log(text, age, era);

  const [message, setMessage] = useState('');
  async function getWeather(signal) {
    try{
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,apparent_temperature&temperature_unit=fahrenheit`,
        { signal }
      )
      const data = await response.json();
      //console.log(data);
      //console.log(data.current.apparent_temperature);
      //console.log(data.current.temperature_2m);
      apiAudio.play();
      setMessage(`as a fairy i can tell u the weather and its ${data.current.temperature_2m} degrees fahrenheit but lowkirk it feels like ${data.current.apparent_temperature} degrees fahrenheit`);
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('u dont got wifi beta', error);
    }
  }
  async function getGas(signal) {
    try{
      const city1 = city;
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${city1}`
      )
      const data = await response.json();
      console.log(data);
      apiAudio.play();
      setMessage(`as a fairy i can tell u about ${city} the ${data.types[0].type.name} type and it has the ability ${data.abilities[0].ability.name}; it has ${data.stats[0].base_stat} hp and ${data.stats[1].base_stat} attack`);
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('u dont got wifi beta', error);
      setMessage(`${city} is not a pokemon lil bro`);
    }
  }
  async function getGambling(signal) {
    try{
      const slug1 = slug;
      const url = `https://gamma-api.polymarket.com/markets?slug=${slug1}`;
      const safeURL = encodeURI(url);
      const response = await fetch('https://corsproxy.io/?' + safeURL, { signal });
      const data = await response.json();
      //console.log(data);
      //console.log(data[0]);
      //console.log(data[0].lastTradePrice);
      apiAudio.play();
      const probability = Math.round(data[0].lastTradePrice * 100);
      setMessage(`as a fairy i can tell u polymarket goons think for the question "${data[0].question}" there is a ${probability}% chance of it happening`)
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('u dont got wifi beta', error);
      setMessage(`polymarket is too complicated to work to find ${slug}`);
    }
  }

  useEffect(() => {
     const controller = new AbortController();
     const timer = setTimeout(() => {
       if (index === 0) {
         getWeather(controller.signal);
       } else if (index === 1) {
         getGas(controller.signal);
       } else if (index === 2) {
         getGambling(controller.signal);
       }
    }, 350);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [lat, long, index, city, slug]);

  return (
    <div className="flex-container">
      <div className = "box">
        <h1> Dropdowns and Text </h1>
        <p> alright chat tdy we going to be figuring out how to do text and dropdowns in React </p>
        <p> ooh also APIs too</p>
        <p> lets start with a fairy i literally dont know what this is but i found her so</p>
        <img src={image} alt="Fairy" />
        <p> hello i am {text}</p>
        <p> i was born in {birthYear}{era}</p>
        <p> {workMessage} </p>
        <p> {moneyMessage} </p>
        <p> {nepoBaby} </p>
        <p> {message} </p>
        <Background music = {bgm} musicLoaded = {musicLoaded} setMusicLoaded = {setMusicLoaded} />
      </div>
      <div className = "box">
        <p> whats her name? </p>
        <TextInput text={text} setText={setText} id = "name" aud = {typingAudio} />
        <Eggs text={text} />
        <p> how old is she? </p>
        <TextInput text={age} setText={setAge} id = "age" aud = {typingAudio} />
        <p> what does she work as </p>
        <TextInput text={work} setText={setWork} id = "work" aud = {typingAudio} />
        <div className = "vertical">
          <div className = "check-container">
            <p> is she broke?</p>
            <CheckBoxes check={broke} setCheck={setBroke} id = "broke" aud = {typingAudio} />
          </div>
          <div className = "check-container">
            <p> is she dark?</p>
            <CheckBoxes check={dark} setCheck={setDark} id = "dark" aud = {typingAudio} />
          </div>
        </div>
        <br />
        <DropdownComplex index={index} setIndex={setIndex} id = "apis" />
        <IndexToAPI lat={lat} setLat={setLat} long={long} setLong={setLong} index={index} city={city} setCity={setCity} slug={slug} setSlug={setSlug} aud = {typingAudio} />
      </div>
    </div>
  )
}

export default App
