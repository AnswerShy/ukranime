import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './index.css';

import Layout from './components/Layout';
import NoPage from './pages/NoPage';

import Home from './pages/Home';
import Anime from './pages/AnimePage';
import AnimeList from './pages/AnimeList';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path={`${process.env.REACT_APP_FRONT_URL}/`} element={<Layout/>}>
          <Route index path={`${process.env.REACT_APP_FRONT_URL}/`} element={<Home />} /> {/* Home page */}
          <Route path={`${process.env.REACT_APP_FRONT_URL}/List`} element={<AnimeList />}/> {/* Anime list page */}
          <Route path={`${process.env.REACT_APP_FRONT_URL}/Anime/:title`} element={<Anime />} /> {/* Anime page */}
      </Route>
      <Route path="*" element={<NoPage />}/>  {/* Not found page */}
    </Routes>
  </BrowserRouter>
);
