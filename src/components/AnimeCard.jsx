import './AnimeCard.css'
import { Link } from "react-router-dom";

const AnimeCard = ({ poster, title, episodes, genres, release }) => {
    const genreEdited = genres.map((e, index) => (
        <p key={index}>{e}</p>
    )) 
    return (
        <Link 
          to={`/Anime/${title}`} 
          id={title} 
          className="displayInfo" 
          style={{ backgroundImage: `url(${poster})` }}
        >
          <div className="info">
            
            <p className="episodes">Episodes: {episodes}</p>
            <p className="genres">Genres: {genreEdited}</p>
            <p className="release">Release date: {release}</p>
          </div>
          <div className="title-card">{title}</div>
        </Link>
    )
}

export default AnimeCard