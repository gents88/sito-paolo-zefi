import { Injectable } from '@nestjs/common';

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface Story {
  id: number;
  icon: string;
  era: string;
  title: string;
  description: string;
  articleUrl?: string;
  downloadUrl?: string;
  content?: string;
}

export interface Biography {
  portraitUrl: string;
  bioText: string;
  stats: Array<{ label: string; value: string }>;
  timelineItems: TimelineItem[];
}

@Injectable()
export class ContentService {
  private biography: Biography = {
    portraitUrl: '/assets/paulin-zefi-portrait.jpg',
    bioText:
      'Paulin Zefi è uno storico e ricercatore specializzato nella storia medievale albanese, con particolare focus sulla Lega di Alessio e il ruolo di Lezha durante il XV secolo. Ha dedicato la sua vita allo studio e alla preservazione del patrimonio culturale albanese.',
    stats: [
      { label: 'Anni di Ricerca', value: '40+' },
      { label: 'Pubblicazioni', value: '50+' },
      { label: 'Archivi Catalogati', value: '1000+' },
    ],
    timelineItems: [
      {
        year: '1983',
        title: 'Nascita',
        description: 'Paulin Zefi nasce a Lezha',
      },
      {
        year: '1989',
        title: 'Laurea',
        description:
          "Si laurea in Storia Medievale all'Università di Tirana",
      },
      {
        year: '1995',
        title: 'Primi Studi',
        description:
          'Pubblica i primi studi sui manoscritti della Lega di Alessio',
      },
      {
        year: '2005',
        title: 'Ricerca Internazionale',
        description:
          "Inizia la collaborazione con università europee per la ricerca",
      },
      {
        year: '2015',
        title: 'Prima Monografia',
        description:
          'Pubblica la sua prima grande monografia sulla storia di Lezha',
      },
      {
        year: '2024',
        title: 'Eredità Digitale',
        description:
          'Avvia il progetto di archivio digitale del patrimonio albanese',
      },
    ],
  };

  private stories: Story[] = [
    {
      id: 1,
      icon: 'fa-solid fa-fort-awesome',
      era: 'III sec. a.C.',
      title: 'Lissus, la Fortezza Illira',
      description:
        'La città antica fondata dai Greci, fortezza strategica del Mare Adriatico',
    },
    {
      id: 2,
      icon: 'fa-solid fa-chess-rook',
      era: '1393',
      title: 'Il Dominio Veneziano',
      description:
        'Lezha sotto il dominio della Repubblica di Venezia, centro di commercio e potere',
    },
    {
      id: 3,
      icon: 'fa-solid fa-khanda',
      era: '2 Marzo 1444',
      title: 'La Lega di Alessio',
      description:
        "Il patto storico che unì i principi albanesi contro l'Impero Ottomano",
      articleUrl: '/assets/articles/lega-di-alessio.html',
      downloadUrl: '/assets/articles/lega-di-alessio.pdf',
      content: 'Testo completo dell\'articolo sulla Lega di Alessio.'
    },
    {
      id: 4,
      icon: 'fa-solid fa-person-military-pointing',
      era: '1444-1468',
      title: "L'Era di Skanderbeg",
      description:
        'Il periodo di resistenza albanese sotto la guida del Navalier Gjergj Kastrioti',
    },
    {
      id: 5,
      icon: 'fa-solid fa-church',
      era: '1468',
      title: 'Il Sepolcro di Skanderbeg',
      description:
        'Costruzione del Memoriale di San Nicola, luogo di memoria e pellegrinaggio',
    },
    {
      id: 6,
      icon: 'fa-solid fa-book',
      era: 'Oggi',
      title: 'Conservazione della Memoria',
      description:
        'Lezha come patrimonio culturale e centro di studi storici internazionali',
    },
  ];

  async getStory(id: string | number): Promise<Story | null> {
    const found = this.stories.find((s) => String(s.id) === String(id));
    return found ?? null;
  }

  async getAll() {
    return {
      biography: this.biography,
      stories: this.stories,
    };
  }

  async getBiography(): Promise<Biography> {
    return this.biography;
  }

  async getStories(): Promise<Story[]> {
    return this.stories;
  }

  async getTimeline(): Promise<TimelineItem[]> {
    return this.biography.timelineItems;
  }
}
