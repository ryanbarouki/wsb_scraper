import './App.css';
import LineChart from './components/LineChart'
import {useState, useEffect} from 'react'

function App() {
  const [data, setData] = useState([]);
//   const [categories, setCat] = useState([]);

  useEffect(() => {
	async function fetchData() {
		const rawData = await fetch('/getData');
		const jsonData = await rawData.json();
		setData(jsonData.data);
		// setCat(jsonData.x);
	}
	fetchData();
  }, []);
  return (
        <div className="chart">
          <p>
            Wall Street Bets Scraper with React.js!
          </p>
          <LineChart data={data}/>
        </div>
  );
}

export default App;
