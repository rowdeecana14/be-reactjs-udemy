import mongoose from "mongoose";
import moment from "moment";
import { STATUSES, ACTIONS } from "../utils/enums/MovieEnum";

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    summary: {
      type: String,
      require: true,
    },
    url: {
      type: String,
      require: true
    },
    status: {
      type: String,
      require: true,
      enum: Object.values(STATUSES), 
      default: STATUSES.Pending, 
    },
    release_at: {
      type: String,
      require: true,
      set: function (value: string) {
        if (value) {
          return moment(value).format("YYYY-MM-DD");
        }
        return value;
      },
    },
    action: {
      type: String,
      require: true,
      enum: Object.values(ACTIONS), 
      default: ACTIONS.Created, 
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: false,
      default: null, 
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: false,
      default: null, 
    },
    deleted_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
    collection: 'movies' 
  },
);

const Movie = mongoose.model("Movie", schema);

export default Movie;
