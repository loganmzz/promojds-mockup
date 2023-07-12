import * as model from '@/models/referential';

class ReferentialCache {
    getLastUpdate(): string|null {
        return localStorage.getItem('CACHE_LAST_UPDATE');
    }
    setLastUpdate(lastUpdate: string) {
        return localStorage.setItem('CACHE_LAST_UPDATE', lastUpdate);
    }

    getData(): model.Data|null {
        const raw = localStorage.getItem('CACHE_DATA');
        if (raw === null) return null;
        return JSON.parse(raw);
    }
    setData(data: model.Data) {
        localStorage.setItem('CACHE_DATA', JSON.stringify(data));
    }
}

export class ReferentialError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class ReferentialService {
    readonly cache = new ReferentialCache();

    async readJson(context: string, response: Response): Promise<any> {
        if (!response.ok) {
            const content = await response.text();
            const additionalData = content ? `\n${content}` : '';
            throw new ReferentialError(`${context} (${response.status} ${response.statusText})${additionalData}`);
        }
        return await response.json();
    }

    async load(): Promise<{lastUpdate: string, data: model.Data}> {
        let lastUpdate = this.cache.getLastUpdate();
        console.log(`ReferentialService.load: cache.lastUpdate=${lastUpdate}`);

        const urlParams = new URLSearchParams(document.location.search);
        let rootIndex: model.InRootIndex;
        const urlLastVersion = urlParams.get('v');
        console.log(`ReferentialService.load: urlParams.v=${urlLastVersion}`);
        if (urlLastVersion) {
            rootIndex = {
                last: urlLastVersion,
            };
        } else {
            const getRootIndex = await fetch('data/index.json');
            rootIndex = await this.readJson('Unable to get referential root index', getRootIndex);
        }
        console.log(`ReferentialService.load: rootIndex.last: ${rootIndex.last}`);

        const getDataIndex = await fetch(`data/${rootIndex.last}/index.json`);
        const dataIndex: model.InDataIndex = await this.readJson(`Unable to get referential ${rootIndex.last} data index`, getDataIndex);
        console.log(`ReferentialService.load: dataIndex.date: ${dataIndex.date}`);

        let data: model.Data = [];
        if (lastUpdate === dataIndex.date) {
            console.log(`ReferentialService.load: load cached data`);
            data = this.cache.getData() || data;
        } else {
            lastUpdate = dataIndex.date;
        }
        if (data.length == 0) {
            console.log(`ReferentialService.load: load data from referential ${rootIndex.last}`);
            const getData = await fetch(`data/${rootIndex.last}/data.json`);
            const inData = await this.readJson(`Unable to get referential ${rootIndex.last} index`, getData);
            data = model.mapData(inData);
            this.cache.setData(data);
        }
        this.cache.setLastUpdate(lastUpdate);

        return {
            lastUpdate,
            data,
        };
    }
}