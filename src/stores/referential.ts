import * as model from '@/models/referential';
import { ReferentialService } from '@/services/referential';
import { defineStore } from 'pinia';
import { reactive } from 'vue';

interface State {
    status: string;
    lastUpdate: string|null;
    data: model.Data;
}

const service = new ReferentialService();

export const useReferentialStore = defineStore('referential', {
    state: (): State => ({
        status: 'Unknown',
        lastUpdate: null,
        data: reactive([]),
    }),
    actions: {
      async load() {
        this.status = 'Loading'
        try {
          const loaded = await service.load();
          this.lastUpdate = loaded.lastUpdate;
          this.data = reactive(loaded.data);
          this.status = 'Loaded';
        } catch (e) {
          this.status = 'Error';
          console.log(e);
        }
      }
    }
});
