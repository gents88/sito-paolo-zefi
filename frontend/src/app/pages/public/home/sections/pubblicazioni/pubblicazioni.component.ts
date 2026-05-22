import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PublicationsService } from '@core/services/publications.service';

@Component({
  selector: 'app-pubblicazioni',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './pubblicazioni.component.html',
  styleUrls: ['./pubblicazioni.component.scss'],
})
export class PubblicazioniComponent implements OnInit, OnDestroy {
  filter = 'all';
  publications: any[] = [];
  private fallbackList: any[] = [];
  private langSub: Subscription | null = null;

  constructor(private publicationsService: PublicationsService, private translate: TranslateService) {}

  ngOnInit() {
    this.publicationsService.getPublications().subscribe({
      next: (pubs) => (this.publications = pubs),
      error: (err) => console.error('Error loading publications:', err),
    });
    // build fallback immediately and rebuild on language changes
    this.buildLocaleFallback();
    this.langSub = this.translate.onLangChange.subscribe(() => this.buildLocaleFallback());
  }

  // Definitions for fallback publications; localized title/description come dalle risorse i18n
  private publicationDefs = [
    { id: 'p1', icon: 'fa-solid fa-book', type: 'book', year: 2020 },
    { id: 'p2', icon: 'fa-solid fa-scroll', type: 'article', year: 2019 },
    { id: 'p3', icon: 'fa-solid fa-book', type: 'book', year: 2018 },
    { id: 'p4', icon: 'fa-solid fa-file', type: 'research', year: 2017 },
    { id: 'p5', icon: 'fa-solid fa-scroll', type: 'article', year: 2016 },
    { id: 'p6', icon: 'fa-solid fa-book', type: 'book', year: 2015 }
  ];

  get fallbackPublications() {
    return this.fallbackList;
  }

  private buildLocaleFallback(): void {
    const keys: string[] = [];
    this.publicationDefs.forEach(d => {
      keys.push(`sections.pubblicazioni.types.${d.type}`);
      keys.push(`sections.pubblicazioni.items.${d.id}.title`);
      keys.push(`sections.pubblicazioni.items.${d.id}.description`);
    });

    this.translate.get(keys).subscribe(res => {
      this.fallbackList = this.publicationDefs.map(d => ({
        icon: d.icon,
        type: res[`sections.pubblicazioni.types.${d.type}`] || '',
        title: res[`sections.pubblicazioni.items.${d.id}.title`] || '',
        description: res[`sections.pubblicazioni.items.${d.id}.description`] || '',
        year: d.year,
      }));
    });
  }

  ngOnDestroy(): void {
    if (this.langSub) { this.langSub.unsubscribe(); this.langSub = null; }
  }
}
