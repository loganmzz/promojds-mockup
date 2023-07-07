import { ref, computed, reactive } from 'vue';
import { defineStore } from 'pinia';

interface State {
    status: string;
    data: {id: string, name: string, location: string, newPrice: number, oldPrice: number}[];
}

export const referentialStore = defineStore('referential', {
    state: (): State => ({
        status: 'Unknown',
        data: [
            {
              id: '001',
              name: 'This is my first entry',
              location: 'Philibert',
              newPrice: 95,
              oldPrice: 100,
            },
            {
              id: '002',
              name: 'Another entry',
              location: 'Philibert',
              newPrice: 88.2,
              oldPrice: 106.7,
            },
            {
              id: '003',
              name: 'Another provider',
              location: 'La Bonne Grosse Caverne',
              newPrice: 10.09,
              oldPrice: 15,
            },
        ],
    }),
});
