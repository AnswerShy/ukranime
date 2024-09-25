import './AnimeCard.css'
import { Link } from "react-router-dom";

const AnimeCard = ({ poster, title, episodes, genres, release }) => {
    const genreEdited = genres.map((e, index) => (
        <p key={index}>{e}</p>
    ))
    const link = `/${process.env.REACT_APP_FRONT_URL}/Anime/${title}`
    console.log(link)
    return (
        <Link 
          to={link} 
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