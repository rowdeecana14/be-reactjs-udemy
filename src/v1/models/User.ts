import mongoose from "mongoose";
import { STATUSES } from "../utils/enums/UserEnum";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: false,
      default: null,
    },
    status: {
      type: String,
      require: false,
      enum: Object.values(STATUSES),
      default: STATUSES.Inactive,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      require: false,
      default: null, 
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      require: false,
      default: null, 
    },
    deleted_by: {
      type: mongoose.Schema.Types.ObjectId,
      require: false,
      default: null, 
    },
    created_at: {
      type: Date,
      require: true,
      default: Date.now, 
    },
    updated_at: {
      type: Date,
      require: false,
      default: null, 
    },
    deleted_at: {
      type: Date,
      require: false,
      default: null, 
    },
  },
  { 
    modelName: 'User',  
    collection: 'users' 
  },
);

const User = mongoose.model("User", schema);

export default User;