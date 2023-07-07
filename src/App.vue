<script setup lang="ts">
import { computed, reactive } from 'vue';
import ReferentialStatus from './components/ReferentialStatus.vue';

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
  <header>
    <div class="statusbar">
      <ReferentialStatus></ReferentialStatus>
    </div>
    <h1>promojds</h1>
  </header>

  <div class="filters">
    <div><a @click="filterSwitch">Filters {{ filters.displayed ? "hide" : "collapse" }}</a></div>
    <div style="overflow: hidden;"><Transition name="filters-fade">
      <div v-if="filters.displayed">
        <input v-model="filters.search">
      </div>
    </Transition></div>
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

<style lang="scss" scoped>
// Root
#app > * {
  margin: 1em;
  padding: 1em;
}

// Header
header {
  > h1 {
    text-align: center;
  }

  > #statusbar {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
}

// Table
@mixin table_width($column, $width) {
  table col.#{$column},
  table th.#{$column},
  table td.#{$column} {
    @if $width != 0 {
        width: $width;
    } @else {
        display: none;
    }
  }
}

@include table_width(name, 50%);
@include table_width(new-price, 9%);
@include table_width(location, 23%);
@include table_width(old-price, 9%);
@include table_width(discount, 9%);

@media (width < 900px) {
  @include table_width(name, 59%);
  @include table_width(new-price, 11%);
  @include table_width(location, 30%);
  @include table_width(old-price, 0);
  @include table_width(discount, 0);
}
</style>
