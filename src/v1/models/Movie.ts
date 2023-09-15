import mongoose from "mongoose";
import moment from "moment";
import { STATUSES } from "../utils/enums/MovieEnum";

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
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
    // updated: { type: Date, default: Date.now },
  },
  { 
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    modelName: 'Movie',  
    collection: 'movies' 
  },
);

const Movie = mongoose.model("Movie", schema);

export default Movie;
