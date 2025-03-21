import { connectToDatabase } from './mongodb';
import Note from '@/models/Note';

const defaultNotes = [
  {
    title: 'Welcome to Notes App',
    content:
      'This is a sample note to help you get started. You can edit or delete this note, or create new ones of your own!'
  },
  {
    title: 'Using MongoDB',
    content:
      "Your notes are now stored in MongoDB! This means your data persists between sessions and can be accessed from anywhere. Try adding some notes and see how they're saved automatically."
  },
  {
    title: 'Tips for Organizing Notes',
    content:
      'Here are some tips for keeping your notes organized:\n\n- Use clear, descriptive titles\n- Keep notes concise and focused on a single topic\n- Review and update your notes regularly\n- Delete notes you no longer need'
  }
];

export async function seedDatabase() {
  try {
    await connectToDatabase();

    const count = await Note.countDocuments();

    if (count === 0) {
      console.log('Seeding database with default notes...');
      await Note.insertMany(defaultNotes);
      console.log('Database seeded successfully!');
    } else {
      console.log('Database already has notes, skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
