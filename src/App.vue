<script setup lang="ts">
import { computed, reactive } from 'vue';

const data = reactive([
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
          <th class="new-price">New price</th>
          <th class="location">Location</th>
          <th class="old-price">Old price</th>
          <th class="discount">Discount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filtered" :key="item.id">
          <td class="name">{{ item.name }}</td>
          <td class="new-price money">{{ numeric(item.newPrice) }}</td>
          <td class="location"><div>{{ item.location }}</div></td>
          <td class="old-price money">{{ numeric(item.oldPrice) }}</td>
          <td class="discount percentage">{{ numeric(ratio(item.newPrice, item.oldPrice)) }}</td>
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
td {
  vertical-align: top;
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
  width: 50%;
}
table col.new-price,
table th.new-price,
table td.new-price  {
  width: 9%;
}
table col.location,
table th.location,
table td.location  {
  width: 23%;
}
table col.old-price,
table th.old-price,
table td.old-price  {
  width: 9%;
}
table col.discount,
table th.discount,
table td.discount  {
  width: 9%;
}

@media (width < 900px) {
  table col.name,
  table th.name,
  table td.name {
    width: 59%;
  }
  table col.new-price,
  table th.new-price,
  table td.new-price  {
    width: 11%;
  }
  table col.location,
  table th.location,
  table td.location  {
    width: 30%;
  }
  table col.old-price,
  table th.old-price,
  table td.old-price  {
    display: none;
  }
  table col.discount,
  table th.discount,
  table td.discount  {
    display: none;
  }
}
</style>
