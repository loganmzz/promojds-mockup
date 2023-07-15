<script setup lang="ts">
import ReferentialStatus from '@/components/ReferentialStatus.vue';
import { useReferentialStore } from '@/stores/referential';
import { computed, onMounted, reactive, ref, type UnwrapNestedRefs } from 'vue';
import { AgGridVue } from "ag-grid-vue3";  // the AG Grid Vue Component

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { storeToRefs } from 'pinia';
import {
  type AbstractColDef,
  type AgGridEvent,
  type DataTypeDefinition,
  type FirstDataRenderedEvent,
  type GridSizeChangedEvent,
  type ICellRendererComp,
  type ICellRendererParams,
} from 'ag-grid-community';

class ItemNameCellRenderer implements ICellRendererComp {
  readonly gui: HTMLElement = document.createElement("span");

  init(params: ICellRendererParams) {
    this.refresh(params);
  }
  getGui(): HTMLElement {
    return this.gui;
  }
  destroy() {

  }
  refresh(params: ICellRendererParams): boolean {
    this.gui.innerHTML = `<a @click="findSimilar(item.name)">🔎</a>${params.value}`;
    const actionLink = this.gui.querySelector('a');
    actionLink?.addEventListener('click', () => findSimilar(params.value));
    return true;
  }
}

const columnDefs: UnwrapNestedRefs<{value: AbstractColDef[]}> = reactive({
  value: [
    {
      headerName: 'Article',
      field: 'name',
      width: 500,
      wrapText: true,
      autoHeight: true,
      cellRenderer: ItemNameCellRenderer,
    },
    {
      headerName: 'Prix',
      field: 'newPrice',
      cellDataType: 'money',
      width: 91,
      suppressSizeToFit: true,
      type: 'numericColumn',
      headerClass: '',
    },
    {
      headerName: '',
      field: 'oldPrice',
      cellDataType: 'money',
      width: 91,
      suppressSizeToFit: true,
    },
    {
      headerName: 'Boutique',
      field: 'location',
      width: 140,
    },
    {
      colId: 'discount',
      headerName: 'Réduction',
      valueGetter: (params: any) => ratio(params.data.newPrice, params.data.oldPrice),
      cellDataType: 'percentage',
      width: 119,
      suppressSizeToFit: true,
    },
  ]
});

const dataTypeDefinitions: {[cellDataType: string]: DataTypeDefinition<any>;} = {
  money: {
    baseDataType: 'number',
    extendsDataType: 'number',
    valueFormatter: (params: any) => `${numeric(params.value)} €`,
  },
  percentage: {
    baseDataType: 'number',
    extendsDataType: 'number',
    valueFormatter: (params: any) => `${numeric(params.value)} %`,
  },
}

const defaultColDef = {
  sortable: true,
};

const referential = useReferentialStore();
const { data } = storeToRefs(referential);
const filtered = computed(() => {
  return filters.search
    ? referential.index
        .search(filters.search)
        .filter(entry => (entry.score ?? 0) < 0.3)
        .map(entry => entry.item)
    : referential.data;
});

const filters = reactive({
  displayed: false,
  search: '',
});
function filterSwitch() {
  filters.displayed = !filters.displayed;
}
function findSimilar(content: string) {
  filters.displayed = true;
  filters.search = content;
}
function clearSearchFilter() {
  filters.search = '';
}

function fit(event: AgGridEvent) {
  setTimeout(() => {
    // console.log('fit');
    event.api.sizeColumnsToFit();
    // event.columnApi.getAllDisplayedColumns().forEach(c => {
    //   console.log(`${c.getColId()}.width=${c.getActualWidth()}`);
    // });
  });
}
function onFirstDataRendered(event: FirstDataRenderedEvent) {
  fit(event);
}

function gridSizeChanged(event: GridSizeChangedEvent) {
  // console.log('clientWidth:', event.clientWidth);
  const small = event.clientWidth < 950;
  event.columnApi.setColumnsVisible(['oldPrice', 'discount'], !small);
  fit(event);
}

function ratio(updated: number, base: number): number {
  return (base - updated) * 100 / base;
}

function numeric(value: number): string {
  let result = `${value}`;
  const dotLocation = result.indexOf('.');
  if (dotLocation < 0) {
    result = `${result}.00`;
  } else if (dotLocation == result.length - 2) {
    result = `${result}0`;
  } else {
    result = result.slice(0, dotLocation+3);
  }
  return result;
}

onMounted(() => {
  referential.load();
});
</script>

<template>
  <header>
    <div class="filler"></div>
    <h1>promojds</h1>
    <div class="statusbar">
      <ReferentialStatus></ReferentialStatus>
    </div>
  </header>
  <main>
    <div class="filters">
      <div><a @click="filterSwitch">Filters {{ filters.displayed ? "hide" : "collapse" }}</a></div>
      <div style="overflow: hidden;"><Transition name="filters-fade">
        <div v-if="filters.displayed">
          <input v-model="filters.search"><a @click="clearSearchFilter">❌</a>
        </div>
      </Transition></div>
    </div>
    <div class="gridcontainer">
    <ag-grid-vue
        class="ag-theme-alpine fullheight"
        :dataTypeDefinitions="dataTypeDefinitions"
        :defaultColDef="defaultColDef"
        :columnDefs="columnDefs.value"
        :rowData="filtered"
        @firstDataRendered="onFirstDataRendered"
        @gridSizeChanged="gridSizeChanged"
    >
    </ag-grid-vue>
  </div>
  </main>
</template>

<style lang="scss">
.ag-cell-value[col-id="oldPrice"] {
  text-decoration: line-through;
  color: #dc2f2f;
}
</style>

<style lang="scss" scoped>
// Header
header {
  display: flex;
  flex-grow: 1;
  justify-content: space-between;

  > h1 {
    text-align: center;
  }

  > .statusbar {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
}

// Main
main {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
}
.gridcontainer {
  flex: 1 1 auto;
}
.fullheight {
  height: 100%;
}
</style>
