<script setup lang="ts">
import { Ref, ref } from 'vue';
import { io } from 'socket.io-client';

const socket = io('localhost:3000'); 

socket.on('onconnect', (data) => {
  items.value = data;
  items.value.forEach(x =>
  {
    if(!lanes.value.includes(x.lane))
    {
      lanes.value.push(x.lane);
    }
  })
});

socket.on('update', (data) => {
  let added = false;
  const newList:task[] = [];
  const newlanes: string[]= [];
  items.value.forEach(t => {
    if(t.id === data.id)
    {
      t = data;
      added = true
    }
    if(!newlanes.includes(t.lane))
    {
      newlanes.push(t.lane);
    }
    newList.push(t)
  });
  if(!added)
  {
    newList.push(data)
    if(!newlanes.includes(data.lane))
    {
      newlanes.push(data.lane);
    }
  }
  items.value = newList;
  lanes.value = newlanes;
});

function updateTask(task:task)
{
  socket.emit('update', task);
}


interface task {
  id: number;
  title: string;
  priority: string;
  description: string;
  lane: string;
}
const items: Ref<task[]> = ref(
  [
])
const lanes: Ref<string[]> = ref([])
const newTask: Ref<task> = ref({id:0,title:"",description:"",lane:"",priority:""})


items.value.forEach(x =>
{
  if(!lanes.value.includes(x.lane))
  {
    lanes.value.push(x.lane);
  }
})
function startDrag(evt:any, item:task) {
      evt.dataTransfer.dropEffect = 'move'
      evt.dataTransfer.effectAllowed = 'move'
      evt.dataTransfer.setData('item', JSON.stringify(item))
}
function onDrop(evt, laneIndex: number) {
      const lane:string = lanes.value[laneIndex]
      const draggedTask: task = JSON.parse(evt.dataTransfer.getData('item'))
      draggedTask.lane = lane;
      updateTask(draggedTask);
}

</script>

<template>
<div class="flex">
  <div class="w-full max-w-xs m-2 p-4 min-w-80">
  <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Title
      </label>
      <input v-model="newTask.title" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username">
    </div>

    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Description
      </label>
      <input v-model="newTask.description" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username">
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
      <input v-model="newTask.lane" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username">
    </div>

    <div class="flex items-center justify-between">
      <button @click="updateTask(newTask)" class="bg-blue-500 hover:bg-blue-700 hover:text-white  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
        Add
      </button>
    </div>
  </form>
</div>
  <div v-for="(item, index) in lanes" :key="index" class="p-4 m-2">
    <div  class="bg-slate-500 text-white p-2 min-w-32 rounded"> 
      {{ item }}
    </div>
    <div class="grid grid-rows-2  min-h-80 bg-slate-50" @drop="onDrop($event, index)"   @dragover.prevent @dragenter.prevent> 
      <div
        v-for="(task, index) in items" :key="index"
        v-show="item === task.lane"
        class="drag-el p-2 m-2 rounded bg-slate-200 min-w-40" 
        draggable="true" @dragstart="startDrag($event, task)">
        <div class="px-6 py-4 text-left">
            <p class="font-bold text-xl mb-2 text-base">{{ task.title }}</p>
            <p class="text-gray-700 text-base">
              {{ task.description }}
            </p>
          </div>
          <div class="px-6 pt-4 pb-2 ">
            <span class="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{{ task.priority }}</span>
          </div>
      </div>
    </div>
  </div>
</div>

</template>

<style scoped>


</style>
