export default function Welcome({ currentUser }) {
  return (
    <div className="welcome-page">
      <div className="welcome-hero">
        <h1>Tervetuloa IT-tuen sivulle!</h1>
        <p className="welcome-subtitle">Hei {currentUser}, olemme täällä valmiina auttamaan sinua</p>
      </div>

      <div className="welcome-content">
        <div className="info-card">
          <h2>📋 Uuden tukipyynnön luominen</h2>
          <p>
            Onko sinulla tekninen ongelma? Luo uusi tukipyyntö painamalla
            "Tee tiketti" -nappia sivupalkkista. Kerro meille ongelmastasi ja
            IT-tiimi käsittelee sen mahdollisimman nopeasti.
          </p>
        </div>

        <div className="info-card">
          <h2>📌 Omat tiketit</h2>
          <p>
            Voit seurata kaikkia lähettämiäsi tukipyyntöjä "Omat tiketit"
            -sivulta. Näet kunkin tiketin tilan ja voit seurata sen etenemistä
            reaaliajassa.
          </p>
        </div>

        <div className="info-card">
          <h2>❓ FAQ - Usein kysytyt kysymykset</h2>
          <p>
            Tarvitsetko nopeaa vastausta tavalliseen kysymykseen? Katso FAQ
            -sivu, jossa on ratkaisuja yleisimpiin ongelmiin.
          </p>
        </div>

        <div className="info-card support-hours">
          <h2>🕐 Tukipalvelun aukioloajat</h2>
          <ul>
            <li>Maanantai - Perjantai: 08:00 - 17:00</li>
            <li>Lauantai ja sunnuntai: Suljettu</li>
            <li>Kiireelliset ongelmat: ota yhteyttä puhelimitse</li>
          </ul>
        </div>

        <div className="info-card contact">
          <h2>📞 Ota yhteyttä</h2>
          <p>
            <strong>Puhelinnumero:</strong> +358 (0)1 234 5678<br />
            <strong>Sähköposti:</strong> support@company.fi<br />
            <strong>Chat:</strong> Saatavilla toimistoajat
          </p>
        </div>
      </div>
    </div>
  );
}
