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
    data: Data;
}

export const useReferentialStore = defineStore('referential', {
    state: (): State => ({
        status: 'Unknown',
        data: reactive([]),
    }),
    actions: {
      async load() {
        console.log(`load > current: ${this.status}`);
        console.log(`load > loading`);
        this.status = 'Loading';
        const response = await fetch('data.json');
        if (!response.ok) {
          this.status = `Error (${response.status} ${response.statusText})`;
        } else {
          const data: InData = await response.json();
          this.data = reactive(mapData(data));
          console.log(`Counts: ${this.data.length}`);
          this.status = `Loaded (${this.data.length})`;
        }
      }
    }
});
