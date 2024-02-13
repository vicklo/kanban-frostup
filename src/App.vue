<template>
  <div class="flex">
    <div class="w-full max-w-xs m-2 p-4 min-w-80">
      <Form @updateTask="updateTask($event)" />
    </div>
    <div v-for="(item, index) in lanes" :key="index" class="p-4 m-2">
      <div class="bg-slate-500 text-white p-2 min-w-32 rounded">
        {{ item }}
      </div>
      <div class="grid grid-rows-2  min-h-80 bg-slate-50" @drop="onDrop($event, index)" @dragover.prevent
           @dragenter.prevent>
        <Card
          v-for="(task, index) in items" v-show="item === task.lane"
          :key="index"
          :task="task"
          draggable="true"
          @dragstart="startDrag($event, task)" />
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { Ref, ref } from 'vue';
import { io } from 'socket.io-client';
import { Task } from './lib/task.ts';
import Form from './components/Form.vue';
import Card from './components/Card.vue';

const socket = io('localhost:3000');

/*
De logica voor startDrag/onDrop ziet er netjes uit.
Het is duidelijk wat er gebeurt en het is makkelijk te begrijpen.

Wat ik wel heb moeten doen is dit component opdelen in meerdere componenten. (Form en Card)
Dit is omdat het component anders te groot wordt en het moeilijk wordt om te begrijpen wat er gebeurt.

Daarnaast zie ik ook dat de "lanes" verdwijnen. Meestal worden de lanes vooraf gedefinieerd en niet dynamisch aangepast. Bijvoorbeeld "Todo", "In progress", "Done".
Dit mistte ook in de opdracht, dus niet perse een "minpunt".

Er gebeurd ook veel magie met de state. Ik zie dat de state wordt aangepast in de socket.on('update') functie. Dit is niet heel duidelijk en kan voor verwarring zorgen.

Een structuur als deze zou je applicatie een stuk duidelijker maken:
Je hoeft dan niet te zoeken waar de state wordt aangepast en je weet precies waar je moet zijn om de state aan te passen.
Enige nadeel van dit is dat je niet heel makkelijk "Lanes" kan toevoegen. Maar dit is meestal ook niet nodig aangezien je dit vooraf meestal doet.
{
  lanes: [
    {
      name: 'Todo',
      tasks: [
        {
          id: 1,
          name: 'Task 1',
        },
      ],
    },
    {
      name: 'In progress',
      tasks: [
        {
          id: 2,
          name: 'Task 2',
        },
      ],
    },
  ],
}

Voorbeeld DB model: (dit is wel een stuk complexer)
Organization -> Projects -> Lanes -> Tasks

model Organization {
  name: string;
  projects: Project[];
}

model Project {
  name: string;
  lanes: Lane[];
}

model Lane {
  name: string;
  tasks: Task[];
}

model Task {
  name: string;
  description: string;
  lane: Lane;
  assignee?: User;
}

model User {
  name: string;
  tasks: Task[];
}
 */

socket.on('onconnect', (data) => {
  items.value = data;
  items.value.forEach(x => {
    if (!lanes.value.includes(x.lane)) {
      lanes.value.push(x.lane);
    }
  });
});

socket.on('update', (data) => {
  let added = false;
  const newList: Task[] = [];
  const newlanes: string[] = [];
  items.value.forEach(t => {
    if (t.id === data.id) {
      t = data;
      added = true;
    }
    if (!newlanes.includes(t.lane)) {
      newlanes.push(t.lane);
    }
    newList.push(t);
  });
  if (!added) {
    newList.push(data);
    if (!newlanes.includes(data.lane)) {
      newlanes.push(data.lane);
    }
  }
  items.value = newList;
  lanes.value = newlanes;
});

function updateTask(task: Task) {
  socket.emit('update', task);
}

const items: Ref<Task[]> = ref(
  []);
const lanes: Ref<string[]> = ref([]);

items.value.forEach(x => {
  if (!lanes.value.includes(x.lane)) {
    lanes.value.push(x.lane);
  }
});

function startDrag(evt: any, item: Task) {
  evt.dataTransfer.dropEffect = 'move';
  evt.dataTransfer.effectAllowed = 'move';
  evt.dataTransfer.setData('item', JSON.stringify(item));
}

function onDrop(evt: any, laneIndex: number) {
  const lane: string = lanes.value[laneIndex];
  const draggedTask: Task = JSON.parse(evt.dataTransfer.getData('item'));
  draggedTask.lane = lane;
  updateTask(draggedTask);
}

</script>
