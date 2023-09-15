import mongoose from "mongoose";
import { ACTIONS, MODULES } from "../utils/enums/LogEnum";

const schema = new mongoose.Schema(
  {
    user: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      require: true,
    },
    module: {
      type: String,
      enum: Object.values(MODULES),
      require: true,
    },
    action: {
      type: String,
      enum: Object.values(ACTIONS),
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      require: true
    },
    created_at: {
      type: Date,
      default: Date.now, 
      require: true,
    },
  },
  {
    modelName: "Log",
    collection: "logs",
  }
);

const Log = mongoose.model("Log", schema);

export default Log;
