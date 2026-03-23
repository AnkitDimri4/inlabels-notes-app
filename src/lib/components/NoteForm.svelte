<script lang="ts">
  const {
    idPrefix = 'note',
    initialTitle = '',
    initialContent = '',
    submitting = false,
    submitLabel = 'Create Note',
    onSubmit
  } = $props<{
    idPrefix?: string;
    initialTitle?: string;
    initialContent?: string;
    submitting?: boolean;
    submitLabel?: string;
    onSubmit: (data: { title: string; content: string }) => void;
  }>();

  let title = $state('');
  let content = $state('');

  $effect(() => {
    title = initialTitle;
    content = initialContent;
  });

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSubmit({ title: title.trim(), content: content.trim() });

    // Clear only for create mode (no initial values)
    if (!initialTitle && !initialContent) {
      title = '';
      content = '';
    }
  }
</script>

<div class="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6">
  <h2 class="text-2xl font-semibold mb-4">{submitLabel}</h2>
  <form class="space-y-4" onsubmit={handleSubmit}>
    <div>
      <label class="block text-sm font-medium mb-1" for={`${idPrefix}-title`}>Title</label>
      <input
        id={`${idPrefix}-title`}
        class="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-slate-900"
        bind:value={title}
        maxlength={100}
        required
      />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1" for={`${idPrefix}-content`}>Content</label>
      <textarea
        id={`${idPrefix}-content`}
        class="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-slate-900"
        rows="3"
        bind:value={content}
        maxlength={1000}
        required
      ></textarea>
    </div>
    <button
      type="submit"
      class="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
      disabled={submitting}
    >
      {submitting ? 'Saving...' : submitLabel}
    </button>
  </form>
</div>
