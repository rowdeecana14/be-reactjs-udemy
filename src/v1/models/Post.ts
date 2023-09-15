import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    tag: {
      type: String,
      require: true,
    },
  },
  { 
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    modelName: 'Post',  
    collection: 'posts' 
  },
);

const Post = mongoose.model("posts", schema);

export default Post;
