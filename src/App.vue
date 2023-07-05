<script setup lang="ts">
import { reactive } from 'vue';

const data = reactive([
  {
    id: '001',
    name: 'This is my first entry',
    goodPrice: 95,
    defaultPrice: 100,
  }
])
</script>

<template>
  <section>
  <header>promojds</header>

  <main>
    <table>
      <colgroup>
        <col class="name"/>
        <col class="price"/>
        <col class="price"/>
      </colgroup>
      <thead>
        <tr>
          <th class="name">Name</th>
          <th class="price"><span style="max-width: 80px;">Good price</span></th>
          <th class="price"><span style="max-width: 80px;">Default price</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id">
          <td>{{ item.name }}</td>
          <td class="money"><span style="max-width: 80px;">{{ item.goodPrice }}</span></td>
          <td class="money"><span style="max-width: 80px;">{{ item.defaultPrice }}</span></td>
        </tr>
      </tbody>
    </table>
  </main></section>
</template>

<style scoped>
header, main {
  margin: 2em;
  padding: 2em;
}
header {
  text-align: center;
}
table {
  border-collapse: collapse;
  width: 100%;
}
th, td {
  border: 1px solid black;
  padding: .2em;
}
table col.name,
table th.name,
table td.name {
  min-width: 50%;
}
table col.price,
table th.price,
table td.price  {
  max-width: 100px;
}
td.money {
  text-align: right;
}
td.money::after {
  content: " €";
}
</style>
