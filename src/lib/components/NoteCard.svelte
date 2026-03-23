<script lang="ts">
  import type { Note } from '$lib/types';

  const { note, onEdit, onDelete } = $props<{
    note: Note;
    onEdit: (note: Note) => void;
    onDelete: (note: Note) => void;
  }>();
</script>

<div class="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col">
  <div class="flex justify-between items-start gap-2 mb-3">
    <h3 class="text-2xl font-bold text-gray-900 dark:text-white truncate">
      {note.title}
    </h3>
    <div class="flex gap-2">
      <button
        class="text-xs px-2 py-1 rounded bg-amber-100 text-amber-800 hover:bg-amber-200"
        onclick={() => onEdit(note)}
      >
        Edit
      </button>
      <button
        class="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
        onclick={() => onDelete(note)}
      >
        Delete
      </button>
    </div>
  </div>
  <p class="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3 flex-1">
    {note.content}
  </p>
  <small class="text-gray-400 mt-4 block">
    {new Date(note.createdAt).toLocaleString()}
  </small>
</div>

<style>
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-clamp: 3; 
  }
</style>
