import { defineStore } from 'pinia';
import { reactive } from 'vue';

type InData = {
  articles: {
    id: string,
    titre: string,
    oldPrice: string,
    newPrice: string,
    oldPriceNumeric: number,
    newPriceNumeric: number,
    isInStock: boolean,
    isNew: boolean,
    url: string,
    dateCreation: {
      date: string,
      timezone_type: number,
      timezone: string,
    },
    dateMAJ: any,
    reduction: number,
    boutique: {
      nom: string,
    },
    categorie: {
      nom: string,
    },
    isInStockNumeric: number,
  }[],
};
type Data = {id: string, name: string, location: string, newPrice: number, oldPrice: number}[];

function mapData(input: InData): Data {
  const data: Data = [];
  for (const article of input.articles) {
    data.push({
      id: article.id,
      name: article.titre,
      location: article.boutique.nom,
      newPrice: article.newPriceNumeric,
      oldPrice: article.oldPriceNumeric,
    });
  }
  return data;
}

interface State {
    status: string;
    lastUpdate: string|null;
    data: Data;
}

export const useReferentialStore = defineStore('referential', {
    state: (): State => ({
        status: 'Unknown',
        lastUpdate: null,
        data: reactive([]),
    }),
    actions: {
      async load() {
        if (this.lastUpdate === null) {
          this.lastUpdate = localStorage.getItem('CACHE_LAST_UPDATE');
        }
        console.log(`load > loading ${this.status} | ${this.lastUpdate}`);
        this.status = 'Loading';
        let response = await fetch('data/index.json');
        if (!response.ok) {
          this.status = `Error (index: ${response.status} ${response.statusText})`;
          return;
        }
        const index: {last: string} = await response.json();
        this.status = `Loading (index: ${index.last})`;
        response = await fetch(`data/${index.last}/index.json`);
        if (!response.ok) {
          this.status = `Error (data/index: ${response.status} ${response.statusText})`;
          return;
        }
        const dataIndex: {date: string} = await response.json();
        if (this.lastUpdate !== null && this.lastUpdate >= dataIndex.date) {
          if (this.data.length === 0) {
            const cache = localStorage.getItem('CACHE_DATA');
            if (cache) {
              console.log(`load > restore cache (${this.lastUpdate})`);
              this.data = JSON.parse(cache);
            }
          }
          if (this.data.length > 0) {
            console.log(`load > up-to-date (${this.lastUpdate})`);
            this.status = `Loaded (uptodate)`;
            return;
          }
        }
        console.log(`load > fetch ${index.last} | ${dataIndex.date}`);
        response = await fetch(`data/${index.last}/data.json`);
        if (!response.ok) {
          this.status = `Error (data/data: ${response.status} ${response.statusText})`;
          return;
        }
        const data: InData = await response.json();
        this.data = reactive(mapData(data));
        console.log(`Counts: ${this.data.length}`);
        this.status = `Loaded (${this.data.length})`;
        this.lastUpdate = dataIndex.date;
        localStorage.setItem('CACHE_DATA', JSON.stringify(this.data));
        localStorage.setItem('CACHE_LAST_UPDATE', this.lastUpdate);
      }
    }
});
