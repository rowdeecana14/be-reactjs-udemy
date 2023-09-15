import fs from 'fs';
import path from "path";

const models: any = {};
const base = path.basename(__filename);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== base &&
      [".js", ".ts"].includes(file.slice(-3))
    );
  })
  .forEach(async (file) => {
    const name = file.replace('.ts', '').replace('.ts', '');
    const model = await import(`./${file}`);
    models[name] = model.default;
  });

export default models;