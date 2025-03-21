import mongoose, { Schema, type Document } from "mongoose"

export interface INote extends Document {
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

const NoteSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for this note"],
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    content: {
      type: String,
      required: [true, "Please provide content for this note"],
    },
  },
  {
    timestamps: true,
  },
)

// Check if the model is already defined to prevent overwriting during hot reloads
export default mongoose.models.Note || mongoose.model<INote>("Note", NoteSchema)

