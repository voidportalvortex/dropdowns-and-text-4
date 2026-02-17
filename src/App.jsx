import { useState, useEffect } from 'react'
import fairyLight from './assets/fairyNormal.gif'
import fairyDark from './assets/dark.gif'
import './App.css'

function TextInput({ text, setText }) {
  const handleChange = (event) => {
    setText(event.target.value);
  }
  return (
    <div>
      <input type = "text" value = {text} onChange = {handleChange}
            className = "text-input"/>
    </div>
  )
}

function CheckBoxes({ check, setCheck }) {
  const handleChange = (event) => {
    setCheck(event.target.checked);
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
  const handleChange = (option) => {
    setSelectedOption(option.value);
    setIndex(option.idx);
    //console.log(index);
    //console.log(option);
  }
  const options = [
    { value: 'weather', label: 'weather', idx: 0 },
    { value: 'stock', label: 'stocks', idx: 1 },
    { value: 'gambling', label: 'gambling', idx: 2 },
  ];

  return(
    <div className = "dropdown">
      <div onClick = {() => setOpen(!open)}>
        i am a fairy of {selectedOption} <span> {open ? '▲' : '▼'} </span>
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

function IndexToAPI({ lat, setLat, long, setLong, index, stock, setStock, slug, setSlug }) {
  //console.log(index);
  if (index === 1){
    return (
      <div>
        <p>whats the stock symbol?</p>
        <TextInput text = {stock} setText = {setStock} id = "symbol" />
      </div>
    )
  }else if(index === 2){
    return (
      <div>
        <p>whats the slug (this is complex dw)?</p>
        <TextInput text = {slug} setText = {setSlug} id = "slug" />
      </div>
    )
  }else if(index === 0){
    return(
      <div>
        <p> whats the latitude for ur location?</p>
        <TextInput text = {lat} setText = {setLat} id = "latitude" />
        <p> whats the longitude for ur location?</p>
        <TextInput text = {long} setText = {setLong} id = "longitude" />
      </div>
    )
  }
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
  const [stock, setStock] = useState('AAPL');
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
      setMessage(`as a fairy i can tell u the weather and its ${data.current.temperature_2m} degrees fahrenheit but lowkirk it feels like ${data.current.apparent_temperature} degrees fahrenheit`);
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('u dont got wifi beta', error);
    }
  }
  async function getStock(signal) {
    try{
      const key = import.meta.env.VITE_STOCK_API_KEY;
      const stock1 = stock;
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${stock1}&token=${key}`,
        { signal }
      )
      const data = await response.json();
      //console.log(data);
      setMessage(`as a fairy i can tell u the stock price of ${stock} and its currently ${data.c} dollars with a growth of ${data.dp}% since yesterday`)
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('u dont got wifi beta', error);
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
      const probability = Math.round(data[0].lastTradePrice * 100);
      setMessage(`as a fairy i can tell u polymarket goons think for the question "${data[0].question}" there is a ${probability}% chance of it happening`)
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('u dont got wifi beta', error);
    }
  }

  useEffect(() => {
     const controller = new AbortController();
     const timer = setTimeout(() => {
       if (index === 0) {
         getWeather(controller.signal);
       } else if (index === 1) {
         getStock(controller.signal);
       } else if (index === 2) {
         getGambling(controller.signal);
       }
    }, 750);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [lat, long, index, stock, slug]);

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
      </div>
      <div className = "box">
        <p> whats her name? </p>
        <TextInput text={text} setText={setText} id = "name" />
        <p> how old is she? </p>
        <TextInput text={age} setText={setAge} id = "age" />
        <p> what does she work as </p>
        <TextInput text={work} setText={setWork} id = "work" />
        <div className = "vertical">
          <div className = "check-container">
            <p> is she broke?</p>
            <CheckBoxes check={broke} setCheck={setBroke} id = "broke" />
          </div>
          <div className = "check-container">
            <p> is she dark?</p>
            <CheckBoxes check={dark} setCheck={setDark} id = "dark" />
          </div>
        </div>
        <br />
        <DropdownComplex index={index} setIndex={setIndex} id = "apis" />
        <IndexToAPI lat={lat} setLat={setLat} long={long} setLong={setLong} index={index} stock={stock} setStock={setStock} slug={slug} setSlug={setSlug} />
      </div>
    </div>
  )
}

export default App
