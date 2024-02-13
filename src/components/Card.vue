<template>
  <div class="drag-el p-2 m-2 rounded bg-slate-200 min-w-40">
    <div class="px-6 py-4 text-left">
      <p class="font-bold text-xl mb-2">{{ task.title }}</p>
      <p class="text-gray-700 text-base">
        {{ task.description }}
      </p>
    </div>
    <div class="px-6 pt-4 pb-2 ">
      <span
        class="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{{ task.priority
        }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Task } from '../lib/task.ts';
import { PropType } from 'vue';

defineProps({
  task: {
    type: Object as PropType<Task>,
    required: true,
  },
});
</script>
