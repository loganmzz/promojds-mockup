import * as model from '@/models/referential';
import { ReferentialService } from '@/services/referential';
import Fuse from 'fuse.js';
import { defineStore } from 'pinia';
import { reactive } from 'vue';

interface State {
    status: string;
    lastUpdate: string|null;
    data: model.Data;
    index: Fuse<model.Item>;
}

const service = new ReferentialService();

export const useReferentialStore = defineStore('referential', {
    state: (): State => ({
        status: 'Unknown',
        lastUpdate: null,
        data: reactive([]),
        index: new Fuse(
          [],
          {
            keys: ['name'],
          }
        ),
    }),
    actions: {
      async load() {
        this.status = 'Loading'
        try {
          const loaded = await service.load();
          this.lastUpdate = loaded.lastUpdate;
          this.data = reactive(loaded.data);
          this.index.setCollection(loaded.data);
          this.status = 'Loaded';
        } catch (e) {
          this.status = 'Error';
          console.log(e);
        }
      }
    }
});
