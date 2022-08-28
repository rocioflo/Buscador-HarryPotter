//styles
import '../styles/App.scss';

//components
import callToApi from '../services/api';
import CharactersList from './CharactersList';
import Filters from './Filters';
import CharacterDetail from './CharacterDetail';

//hooks etc.
import { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  pathname,
  matchPath,
  useLocation,
} from 'react-router-dom';

function App() {
  const [characterData, setCharacterData] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    species: '',
    gender: 'male',
    house: 'Gryffindor',
    status: '',
  });
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    callToApi().then((data) => {
      setCharacterData(data);
      setFilteredList(data);
      setIsLoading(false);
    });
  }, []);

  //Filters

  const handleFilters = (ev) => {
    ev.preventDefault();
    console.log(ev.target.value);
    console.log(ev.target.id);

    const id = ev.target.id;
    const value = ev.target.value;
    const newFilters = {
      ...filters,
      [id]: value,
    };

    const filteredData = characterData.filter((character) => {
      return (
        character.name.toLowerCase().includes(newFilters.name.toLowerCase()) &&
        character.house === newFilters.house &&
        character.gender === newFilters.gender
      );
    });

    setFilters({ ...filters, [id]: value });
    setFilteredList(filteredData);
  };

  //Characters in detail

  const { pathname } = useLocation();
  const routeData = matchPath('/CharacterDetail/:id', pathname);
  const characterFound = routeData !== null ? routeData.params.id : null;

  return (
    <div className="App">
      <header>
        <h1>Lalala</h1>
      </header>
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Filters handleFilters={handleFilters} filters={filters} />
                <CharactersList
                  filteredList={filteredList}
                  isLoading={isLoading}
                />
              </>
            }
          />
          <Route
            path={`/CharacterDetail/${characterFound}`}
            element={
              <CharacterDetail
                filteredList={filteredList}
                characterFound={characterFound}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
