import React, { useEffect, useState, } from 'react';
import { Button, TextField, createTheme, ThemeProvider } from '@mui/material';
import './App.css';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore/lite';

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
const theme = createTheme({
  palette: {
    anger: createColor('#F40B27'),
    apple: createColor('#5DBA40'),
    steelBlue: createColor('#5C76B7'),
    violet: createColor('#BC00A3'),
  },
});

const firebaseConfig = {
  apiKey: "AIzaSyAPiu4MjFzFUHlRxA2B0ZxGwsnDiLWVoVo",
  authDomain: "shoppinglist-c2ace.firebaseapp.com",
  projectId: "shoppinglist-c2ace",
  storageBucket: "shoppinglist-c2ace.appspot.com",
  messagingSenderId: "770673269640",
  appId: "1:770673269640:web:272c554da9c9d27f4c383d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const[loading, setLoading] = useState(true);
  const[items, setItems] = useState([]);
  const[item, setItem] = useState("");
  const[count, setCount] = useState(1);
  useEffect(()=> {
    const fetchData = async () => {
      const dataCollection = collection(db, 'items');
      const dataSnapshot = await getDocs(dataCollection);
      const items = dataSnapshot.docs.map(doc => {
        return  { 
          name: doc.data().name, 
          count: doc.data().count, 
          id: doc.id 
        };
      });
      setItems(items);
      setLoading(false);
    }
    fetchData();
  },[]);

  const options = []
  for(let i = 1; i < 11; i++){
    options.push(<option value={i}>{i}</option>)
  }

  const addItem = async () => {
    if(item !== ""){
      let newItem =  { name: item, count: count, id: '' };
      let doc = await addDoc(collection(db, 'items'), newItem);
      newItem.id = doc.id;
      setItems( [...items,newItem]);
      setItem("");
      setCount(1);
    }
  }

  const deleteItem = async (item) => {
    deleteDoc(doc(db, "items", item.id));
    let filteredArray = items.filter(collectionItem => collectionItem.id !== item.id);
    setItems(filteredArray); 
  }

  if (loading) return (<p>Loading...</p>);

  const sh_items = items.map( (item, index) => {
    return (
      <div className='item'>
        <p key={index}>{item.name} {item.count}</p>
        <p className='x' onClick={() => deleteItem(item)}>x</p>
      </div>
    );
  });
  
  

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <h1>Shopping list</h1>
        <div className='addItems'>
          <TextField className='text' placeholder='item' onChange={e => setItem(e.target.value)}></TextField>
          <div className='select'>
            <p className='add'>Items</p>
            <select className='select1' value={count} label="Count" onChange={e => setCount(e.target.value)}>
              {options}
            </select>
          </div>
          <Button color="steelBlue" variant='contained' onClick={() => addItem()}>Add</Button>

        </div>
        <div className='items'>
          {sh_items}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
