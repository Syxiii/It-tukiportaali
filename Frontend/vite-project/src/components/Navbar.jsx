import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <div><strong>IT-tukiportaali</strong></div>
      <div>
        <Link to="/">Kirjaudu</Link>
        <Link to="/create">Uusi tiketti</Link>
        <Link to="/tickets">Omat tiketit</Link>
        <Link to="/admin">IT-tuki</Link>
      </div>
    </nav>
  );
}

export default Navbar;
