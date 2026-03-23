import type { Note } from '$lib/types';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function fetchNotes(): Promise<Note[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch notes');
  return res.json();
}

export async function createNote(data: Pick<Note, 'title' | 'content'>): Promise<Note> {
  const body = {
    ...data,
    createdAt: new Date().toISOString()
  };

  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) throw new Error('Failed to create note');
  return res.json();
}

export async function updateNote(id: number | string, data: Partial<Note>): Promise<Note> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error('Failed to update note');
  return res.json();
}

export async function deleteNote(id: number | string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE'
  });

  if (!res.ok) throw new Error('Failed to delete note');
}
