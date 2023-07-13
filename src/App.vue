<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import ReferentialStatus from '@/components/ReferentialStatus.vue';
import { useReferentialStore } from '@/stores/referential';

const referential = useReferentialStore();
// const data = recomputed(() => referential.data);
const filtered = computed(() => {
  return filters.search ? referential.index.search(filters.search).map(entry => entry.item)
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
          <td class="name"><a @click="findSimilar(item.name)">🔎</a> {{ item.name }}</td>
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

  > .statusbar {
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
