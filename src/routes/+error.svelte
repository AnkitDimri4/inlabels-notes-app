<script lang="ts">
  const { error, status } = $props<{
    error: Error & { frame?: string; stack?: string };
    status: number;
  }>();
</script>

<svelte:head>
  <title>{status === 404 ? 'Page Not Found' : 'Something went wrong'} • InLabels Notes</title>
</svelte:head>

<main class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
  <div class="max-w-lg w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/40 dark:border-slate-700">
    <div class="text-center mb-6">
      <div class="text-6xl mb-4">
        {#if status === 404}
          🧭
        {:else}
          ⚠️
        {/if}
      </div>
      <h1 class="text-3xl font-bold mb-2">
        {status === 404 ? 'Page not found' : 'Something went wrong'}
      </h1>
      <p class="text-gray-600 dark:text-gray-300">
        {#if status === 404}
          The page you are looking for does not exist.
        {:else}
          {error?.message ?? 'Unexpected error occurred.'}
        {/if}
      </p>
    </div>

    <div class="flex flex-col sm:flex-row justify-center gap-3 mt-6">
      <a
        href="/"
        class="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 text-center"
      >
        Go back home
      </a>
      <a
        href="https://github.com/AnkitDimri4/inlabels-notes-app"
        target="_blank"
        rel="noreferrer"
        class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 text-center"
      >
        View repo
      </a>
    </div>
  </div>
</main>
