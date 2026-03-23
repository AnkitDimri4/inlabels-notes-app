<script lang="ts">
	import { onMount } from 'svelte';
	import type { Note } from '$lib/types';
	import { fetchNotes, createNote, updateNote, deleteNote } from '$lib/api/notes';
	import NoteForm from '$lib/components/NoteForm.svelte';
	import NoteCard from '$lib/components/NoteCard.svelte';

	let notes = $state<Note[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	let creating = $state(false);
	let editingNote = $state<Note | null>(null);
	let savingEdit = $state(false);

	let showDeleteModal = $state(false);
	let noteToDelete = $state<Note | null>(null);

	let lastDeletedNote = $state<Note | null>(null);
	let lastDeletedTimeout: ReturnType<typeof setTimeout> | null = null;

	// Search + sort + pagination
	let search = $state('');
	let debouncedSearch = $state('');
	let sortBy = $state<'createdAt' | 'title' | 'id'>('createdAt');
	let sortOrder = $state<'asc' | 'desc'>('desc');
	let page = $state(1);
	const limit = 20;
	let hasMore = $state(true);
	let loadingMore = $state(false);

	let searchTimeout: ReturnType<typeof setTimeout> | null = null;

	// Online/offline state
	let online = $state(typeof navigator !== 'undefined' ? navigator.onLine : true);

	function updateOnlineStatus() {
		online = navigator.onLine;
	}

	// Keyboard shortcuts: Alt+N, Esc
	function handleKeydown(event: KeyboardEvent) {
		// Alt+N => focus create form title
		if (event.altKey && event.key.toLowerCase() === 'n') {
			event.preventDefault();
			const input = document.getElementById('create-title') as HTMLInputElement | null;
			if (input) {
				input.focus();
			}
		}

		// Esc => close edit or delete modals
		if (event.key === 'Escape') {
			if (editingNote) {
				editingNote = null;
			} else if (showDeleteModal) {
				showDeleteModal = false;
				noteToDelete = null;
			}
		}
	}

	// Helper: build query URL for MockAPI
	function buildQueryUrl(pageNum: number) {
		const base = import.meta.env.VITE_API_BASE_URL;
		const params = new URLSearchParams();
		params.set('page', pageNum.toString());
		params.set('limit', limit.toString());
		params.set('sortBy', sortBy);
		params.set('order', sortOrder);
		if (debouncedSearch.trim()) {
			params.set('search', debouncedSearch.trim());
		}
		return `${base}?${params.toString()}`;
	}

	async function loadNotes(initial = false) {
		if (initial) {
			loading = true;
			page = 1;
			hasMore = true;
		} else {
			loadingMore = true;
		}

		try {
			const url = buildQueryUrl(initial ? 1 : page + 1);
			const res = await fetch(url);
			if (!res.ok) throw new Error('Failed to fetch notes');
			const data: Note[] = await res.json();

			if (initial) {
				notes = data;
				page = 1;
			} else {
				notes = [...notes, ...data];
				page = page + 1;
			}

			hasMore = data.length === limit;
			error = null;
		} catch (err) {
			console.error(err);
			error = 'Failed to load notes';
		} finally {
			loading = false;
			loadingMore = false;
		}
	}

	onMount(() => {
		loadNotes(true);

		window.addEventListener('online', updateOnlineStatus);
		window.addEventListener('offline', updateOnlineStatus);

		return () => {
			window.removeEventListener('online', updateOnlineStatus);
			window.removeEventListener('offline', updateOnlineStatus);
		};
	});

	// Debounce search
	function handleSearchInput(value: string) {
		search = value;
		if (searchTimeout) clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			debouncedSearch = search;
			loadNotes(true);
		}, 400);
	}

	function handleSortChange(field: 'createdAt' | 'title' | 'id') {
		sortBy = field;
		loadNotes(true);
	}

	function toggleSortOrder() {
		sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		loadNotes(true);
	}

	async function handleCreate(data: { title: string; content: string }) {
		if (!online) {
			alert('You are offline. Please reconnect to create notes.');
			return;
		}
		creating = true;
		try {
			const newNote = await createNote(data);
			notes = [newNote, ...notes];
		} catch (err) {
			console.error(err);
			alert('Failed to create note');
		} finally {
			creating = false;
		}
	}

	function handleEditClick(note: Note) {
		editingNote = note;
	}

	async function handleEditSave(data: { title: string; content: string }) {
		if (!online) {
			alert('You are offline. Please reconnect to edit notes.');
			return;
		}
		if (!editingNote) return;
		savingEdit = true;
		const id = editingNote.id;

		const prevNotes = notes;
		notes = notes.map((n) => (n.id === id ? { ...n, ...data } : n));

		try {
			const updated = await updateNote(id, data);
			notes = notes.map((n) => (n.id === id ? updated : n));
			editingNote = null;
		} catch (err) {
			console.error(err);
			alert('Failed to update note');
			notes = prevNotes;
		} finally {
			savingEdit = false;
		}
	}

	function requestDelete(note: Note) {
		showDeleteModal = true;
		noteToDelete = note;
	}

	async function confirmDelete() {
		if (!online) {
			alert('You are offline. Please reconnect to delete notes.');
			return;
		}
		if (!noteToDelete) return;
		const note = noteToDelete;
		const id = note.id;

		showDeleteModal = false;
		noteToDelete = null;

		const prevNotes = notes;
		notes = notes.filter((n) => n.id !== id);
		lastDeletedNote = note;

		if (lastDeletedTimeout) clearTimeout(lastDeletedTimeout);

		lastDeletedTimeout = setTimeout(async () => {
			if (!lastDeletedNote || lastDeletedNote.id !== id) return;
			try {
				await deleteNote(id);
				lastDeletedNote = null;
			} catch (err) {
				console.error(err);
				alert('Failed to delete note on server');
				notes = prevNotes;
				lastDeletedNote = null;
			}
		}, 10000);
	}

	function cancelDelete() {
		showDeleteModal = false;
		noteToDelete = null;
	}

	function undoDelete() {
		if (!lastDeletedNote) return;
		notes = [lastDeletedNote, ...notes];
		lastDeletedNote = null;
		if (lastDeletedTimeout) clearTimeout(lastDeletedTimeout);
		lastDeletedTimeout = null;
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<svelte:head>
	<title>InLabels Notes</title>
</svelte:head>

<main
	class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 md:p-10"
>
	<div class="max-w-6xl mx-auto">
		<!-- Top bar: title + dark toggle + online badge + search/sort -->
		<div class="flex flex-col md:flex-row md:items-center gap-4 mb-6">
			<div class="flex items-center justify-between md:justify-start w-full md:w-auto gap-3">
				<h1
					class="text-3xl md:text-4xl font-black bg-gradient-to-r from-indigo-800 via-purple-800 to-pink-800 bg-clip-text text-transparent"
				>
					InLabels Notes
				</h1>
				<button
					onclick={() => document.documentElement.classList.toggle('dark')}
					class="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center"
					title="Toggle Dark Mode"
				>
					<!-- Moon icon in light mode -->
					<span class="block dark:hidden">🌙</span>
					<!-- Sun icon in dark mode -->
					<span class="hidden dark:block">☀️</span>
				</button>
				<span
					class="hidden sm:inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium
                 {online
						? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
						: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200'}"
				>
					<span class="h-2 w-2 rounded-full {online ? 'bg-emerald-500' : 'bg-rose-500'}"></span>
					{online ? 'Online' : 'Offline'}
				</span>
			</div>

			<div class="flex-1 flex flex-col md:flex-row gap-3 md:justify-end">
				<!-- Search -->
				<input
					class="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-slate-900"
					placeholder="Search by title..."
					value={search}
					oninput={(e) => handleSearchInput((e.target as HTMLInputElement).value)}
				/>

				<!-- Sort -->
				<div class="flex gap-2">
					<select
						class="rounded-lg border border-gray-300 dark:border-gray-700 px-8 py-2 bg-gray-50 dark:bg-slate-900"
						bind:value={sortBy}
						onchange={(e) =>
							handleSortChange(
								(e.target as HTMLSelectElement).value as 'createdAt' | 'title' | 'id'
							)}
					>
						<option value="createdAt">Created At</option>
						<option value="title">Title</option>
						<option value="id">ID</option>
					</select>
					<button
						class="rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-slate-900"
						onclick={toggleSortOrder}
						title="Toggle sort order"
					>
						{sortOrder === 'asc' ? '▲' : '▼'}
					</button>
				</div>
			</div>
		</div>

		<!-- Mobile online badge -->
		<div class="sm:hidden mb-4">
			<span
				class="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium
               {online
					? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
					: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200'}"
			>
				<span class="h-2 w-2 rounded-full {online ? 'bg-emerald-500' : 'bg-rose-500'}"></span>
				{online ? 'Online' : 'Offline'}
			</span>
		</div>

		<!-- Create Note -->
		<div class="mb-8">
			<NoteForm
				idPrefix="create"
				submitLabel="Create Note"
				submitting={creating}
				onSubmit={handleCreate}
			/>
		</div>

		<!-- Edit Note Modal -->
		{#if editingNote}
			<div class="fixed inset-0 bg-black/40 flex items-center justify-center z-20">
				<div class="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
					<div class="flex justify-between items-center mb-4">
						<h2 class="text-xl font-semibold">Edit Note</h2>
						<button class="text-gray-500 hover:text-gray-800" onclick={() => (editingNote = null)}>
							✕
						</button>
					</div>
					<NoteForm
						idPrefix="edit"
						initialTitle={editingNote.title}
						initialContent={editingNote.content}
						submitLabel="Save Changes"
						submitting={savingEdit}
						onSubmit={handleEditSave}
					/>
				</div>
			</div>
		{/if}

		<!-- Delete Confirmation Modal -->
		{#if showDeleteModal && noteToDelete}
			<div class="fixed inset-0 bg-black/40 flex items-center justify-center z-30">
				<div class="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-2xl">
					<h2 class="text-xl font-semibold mb-3">Delete note?</h2>
					<p class="text-gray-600 dark:text-gray-300 mb-6">
						Are you sure you want to delete "<span class="font-semibold">{noteToDelete.title}</span
						>"?
					</p>
					<div class="flex justify-end gap-3">
						<button
							class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-slate-800"
							onclick={cancelDelete}
						>
							Cancel
						</button>
						<button
							class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
							onclick={confirmDelete}
						>
							Delete
						</button>
					</div>
				</div>
			</div>
		{/if}

		<!-- Loading / error / empty / list -->
		{#if loading}
			<!-- Skeleton loading cards -->
			<div class="py-8">
				<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
					{#each Array(6) as _, i}
						<div
							class="bg-white dark:bg-slate-800/80 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-slate-700 animate-pulse"
						>
							<div class="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded mb-4"></div>
							<div class="h-3 w-full bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
							<div class="h-3 w-5/6 bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
							<div class="h-3 w-4/6 bg-gray-200 dark:bg-slate-700 rounded mb-6"></div>
							<div class="h-3 w-24 bg-gray-200 dark:bg-slate-700 rounded"></div>
						</div>
					{/each}
				</div>
			</div>
		{:else if error}
			<div class="text-center py-24">
				<div class="text-red-500 text-2xl mb-4">⚠️ {error}</div>
			</div>
		{:else if notes.length === 0}
			<div class="text-center py-24">
				<div
					class="w-32 h-32 bg-gradient-to-r from-indigo-400 to-pink-400 rounded-3xl mx-auto mb-8 animate-pulse"
				></div>
				<h2 class="text-3xl font-bold text-gray-600 dark:text-gray-400 mb-4">
					{debouncedSearch ? 'No results found' : 'No notes yet'}
				</h2>
				<p class="text-xl text-gray-500 dark:text-gray-500">
					{debouncedSearch
						? 'Try a different search term.'
						: 'Create your first note to get started ✨'}
				</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
				{#each notes as note (note.id)}
					<NoteCard {note} onEdit={handleEditClick} onDelete={requestDelete} />
				{/each}
			</div>

			{#if hasMore}
				<div class="flex justify-center mb-8">
					<button
						class="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
						onclick={() => loadNotes(false)}
						disabled={loadingMore}
					>
						{loadingMore ? 'Loading…' : 'Load more'}
					</button>
				</div>
			{/if}
		{/if}
	</div>

	<!-- Undo Toast -->
	{#if lastDeletedNote}
		<div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
			<div class="bg-slate-900 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-4">
				<span>Note "{lastDeletedNote.title}" deleted.</span>
				<button class="underline font-semibold" onclick={undoDelete}> Undo </button>
			</div>
		</div>
	{/if}

	<!-- Footer -->
	<footer
		class="mt-12 border-t border-gray-200 dark:border-gray-800 pt-6 text-center text-sm text-gray-500 dark:text-gray-400"
	>
		<p class="mb-2">
			Built by
			<a
				href="https://portfolio-nine-orcin-33.vercel.app/"
				target="_blank"
				rel="noreferrer"
				class="text-indigo-600 dark:text-indigo-400 underline-offset-2 hover:underline"
			>
				Ankit Dimri
			</a>
		</p>
		<p>
			Source code:
			<a
				href="https://github.com/AnkitDimri4/inlabels-notes-app"
				target="_blank"
				rel="noreferrer"
				class="text-indigo-600 dark:text-indigo-400 underline-offset-2 hover:underline"
			>
				GitHub repository
			</a>
		</p>
	</footer>
</main>
