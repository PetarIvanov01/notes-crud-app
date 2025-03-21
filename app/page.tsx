'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/notes');

        if (!response.ok) {
          throw new Error('Failed to fetch notes');
        }

        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error('Error fetching notes:', error);
        toast({
          title: 'Error',
          description: 'Failed to load notes. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;

    try {
      if (editingId) {
        const response = await fetch(`/api/notes/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title, content })
        });

        if (!response.ok) {
          throw new Error('Failed to update note');
        }

        const updatedNote = await response.json();

        setNotes(
          notes.map((note) => (note._id === editingId ? updatedNote : note))
        );

        toast({
          title: 'Success',
          description: 'Note updated successfully!'
        });
      } else {
        const response = await fetch('/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title, content })
        });

        if (!response.ok) {
          throw new Error('Failed to create note');
        }

        const newNote = await response.json();

        setNotes([newNote, ...notes]);

        toast({
          title: 'Success',
          description: 'Note created successfully!'
        });
      }

      setTitle('');
      setContent('');
      setEditingId(null);
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: 'Error',
        description: editingId
          ? 'Failed to update note.'
          : 'Failed to create note.',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (note: Note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note._id);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/notes/${deleteId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      setNotes(notes.filter((note) => note._id !== deleteId));

      toast({
        title: 'Success',
        description: 'Note deleted successfully!'
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete note.',
        variant: 'destructive'
      });
    } finally {
      setShowDeleteDialog(false);
      setDeleteId(null);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-3 sm:p-5">
      <div className="container mx-auto max-w-[800px] w-full">
        <header className="py-6 sm:py-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Notes App
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-400 mt-2">
            Manage your notes effortlessly.
          </p>
        </header>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 mb-6 shadow-lg w-full">
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="title"
                className="text-sm sm:text-base font-medium text-white"
              >
                Note Title
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 p-2.5 border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
            <div>
              <Label
                htmlFor="content"
                className="text-sm sm:text-base font-medium text-white"
              >
                Note Content
              </Label>
              <Textarea
                id="content"
                placeholder="Write your note here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-[100px] mt-1 p-2.5 border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-violet-600 to-violet-700 text-white px-4 py-2.5 rounded-md shadow-md hover:shadow-lg transition-all duration-200 hover:from-violet-700 hover:to-violet-800 w-full sm:w-auto"
              >
                {editingId ? 'Update Note' : 'Save Note'}
              </Button>
              {(title || content || editingId) && (
                <Button
                  onClick={handleCancel}
                  variant="destructive"
                  className="bg-gradient-to-r from-rose-600 to-rose-700 text-white px-4 py-2.5 rounded-md shadow-md hover:shadow-lg transition-all duration-200 hover:from-rose-700 hover:to-rose-800 w-full sm:w-auto"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
          <h2 className="text-lg sm:text-xl font-semibold p-4 border-b border-slate-800 text-white">
            Your Notes
          </h2>
          <div className="max-h-[400px] sm:max-h-[500px] overflow-y-auto p-4 w-full">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
              </div>
            ) : notes.length === 0 ? (
              <p className="text-center text-slate-400 py-8">
                No notes yet. Create your first note above!
              </p>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <div
                    key={note._id}
                    className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">
                      {note.title}
                    </h3>
                    <p className="text-slate-300 mb-4 text-sm sm:text-base">
                      {note.content}
                    </p>
                    <div className="flex flex-col xs:flex-row gap-2">
                      <Button
                        onClick={() => handleEdit(note)}
                        className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-3 py-2 rounded-md shadow-md hover:shadow-lg transition-all duration-200 hover:from-indigo-700 hover:to-indigo-800 w-full xs:w-auto"
                        size="sm"
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(note._id)}
                        variant="destructive"
                        size="sm"
                        className="bg-gradient-to-r from-rose-600 to-rose-700 text-white px-3 py-2 rounded-md shadow-md hover:shadow-lg transition-all duration-200 hover:from-rose-700 hover:to-rose-800 w-full xs:w-auto"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="bg-slate-900 border border-slate-800 max-w-[90%] sm:max-w-[400px] rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-white">Confirm Deletion</DialogTitle>
              <DialogDescription className="text-slate-400">
                Are you sure you want to delete this note?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-start">
              <Button
                onClick={confirmDelete}
                variant="destructive"
                className="bg-gradient-to-r from-rose-600 to-rose-700 text-white px-4 py-2.5 rounded-md shadow-md hover:shadow-lg transition-all duration-200 hover:from-rose-700 hover:to-rose-800 w-full sm:w-auto"
              >
                Yes, Delete
              </Button>
              <Button
                onClick={() => setShowDeleteDialog(false)}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2.5 rounded-md shadow-md hover:shadow-lg transition-all duration-200 hover:from-emerald-700 hover:to-emerald-800 w-full sm:w-auto"
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
