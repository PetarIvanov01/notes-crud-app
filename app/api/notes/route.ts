import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { seedDatabase } from '@/lib/seed';
import Note from '@/models/Note';

// GET all notes
export async function GET() {
  try {
    await connectToDatabase();

    await seedDatabase();

    const notes = await Note.find({}).sort({ createdAt: -1 });
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const note = await Note.create({ title, content });
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
}
