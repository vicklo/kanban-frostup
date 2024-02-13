<template>
  <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Title
      </label>
      <input id="username" v-model="newTask.title" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Username" type="text">
    </div>

    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Description
      </label>
      <input id="username" v-model="newTask.description" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Username" type="text">
    </div>

    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Priority
      </label>
      <select v-model="newTask.priority" class="bg-white w-full p-2 border rounded">
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
    </div>

    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Lane
      </label>
      <input id="username" v-model="newTask.lane" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Username" type="text">
    </div>

    <div class="flex items-center justify-between">
      <button class="bg-blue-500 hover:bg-blue-700 hover:text-white  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" @click="emits('updateTask', newTask)">
        Add
      </button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { ref, Ref } from 'vue';
import { Task } from '../lib/task.ts';

const newTask: Ref<Task> = ref({ id: 0, title: '', description: '', lane: '', priority: '' });

const emits = defineEmits(['updateTask']);
</script>
