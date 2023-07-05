<script setup lang="ts">
import { computed, reactive } from 'vue';

const data = reactive([
  {
    id: '001',
    name: 'This is my first entry',
    location: 'Philibert',
    goodPrice: 95,
    defaultPrice: 100,
  },
  {
    id: '002',
    name: 'Another entry',
    location: 'Philibert',
    goodPrice: 88.2,
    defaultPrice: 106.7,
  },
  {
    id: '003',
    name: 'Another provider',
    location: 'La Bonne Grosse Caverne',
    goodPrice: 10.09,
    defaultPrice: 15,
  },
]);
const filtered = computed(() => {
  return filters.search ? data.filter(item => item.name.toLocaleLowerCase().includes(filters.search.toLocaleLowerCase()))
                        : data;
});

const filters = reactive({
  displayed: false,
  search: '',
});
function filterSwitch() {
  filters.displayed = !filters.displayed;
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
</script>

<template>
  <section>
  <header>promojds</header>

  <div class="filters">
    <div @click="filterSwitch">Filters <span>{{ filters.displayed ? "hide" : "collapse" }}</span></div>
    <div v-if="filters.displayed">
      <input v-model="filters.search">
    </div>
  </div>

  <main>
    <table>
      <thead>
        <tr>
          <th class="name">Name</th>
          <th class="price">Good price</th>
          <th class="location">Location</th>
          <th class="price optional">Default price</th>
          <th class="discount optional">Discount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filtered" :key="item.id">
          <td class="name">{{ item.name }}</td>
          <td class="price money">{{ numeric(item.goodPrice) }}</td>
          <td class="location">{{ item.location }}</td>
          <td class="price money optional">{{ numeric(item.defaultPrice) }}</td>
          <td class="discount percentage optional">{{ numeric(ratio(item.goodPrice, item.defaultPrice)) }}</td>
        </tr>
      </tbody>
    </table>
  </main></section>
</template>

<style scoped>
#app > * {
  margin: 1em;
  padding: 1em;
}
header {
  text-align: center;
  font-size: 2em;
}
table {
  border-collapse: collapse;
  width: 100%;
}
tr {
  max-height: 1.2em;
}
th, td {
  border: 1px solid lightgray;
  padding: .2em;
}
tbody tr:nth-child(odd) {
  background-color: lightblue;
}

td.money,
td.percentage {
  text-align: right;
}
td.money::after {
  content: " €";
}
td.percentage::after {
  content: " %";
}


table col.name,
table th.name,
table td.name {
  width: 60%;
}
table col.price,
table th.price,
table td.price  {
  width: 10%;
  min-width: 5em;
}
table col.location,
table th.location,
table td.location  {
  width: 10%;
  min-width: 5em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
table col.discount,
table th.discount,
table td.discount  {
  width: 15%;
  min-width: 5em;
}

@media (width < 900px) {
  table col.optional,
  table th.optional,
  table td.optional  {
    display: none;
  }
}
</style>
