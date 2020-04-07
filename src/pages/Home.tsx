import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

export const Home: React.FC = function Home() {
  return (
    <div>
      <section className="welcome">
        <article className="welcome__text">
          <p>
            Ordsky.no er et verktøy for å lage en enkel ordsky fra tekst.
            Ordskyen gir større vekt til ord som fremkommer oftere i teksten.
          </p>
          <p>
            Ordskyen er perfekt å bruke til presentasjoner laget i for eksempel
            word eller powerpoint.
          </p>
        </article>
      </section>
      <section className="flex-container">
        <Link to="/ordsky" className="button">
          Lag en ordsky
        </Link>
      </section>
    </div>
  );
};
