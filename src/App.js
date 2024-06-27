import logo from './logo.svg';
import './App.css';
import {useEffect} from 'React'       
function App() {  
  useEffect(() => {
    console.log('hello useeffect');   
  }, []);             
  return (
    <div className="App">
     hello demo
    </div>
  );
}

export default App;
