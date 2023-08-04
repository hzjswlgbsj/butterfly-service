import { LinValidator } from "../../core/lin-validator-v2";

export const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const setParam = (model: any, v: LinValidator, keys: string[]) => {
  keys.map((key: string) => {
    let value = v.get(`body.${key}`);
    if (!value) {
      value = v.get(`path.${key}`);
    }
    if (!value) {
      value = v.get(`query.${key}`);
    }
    model[key] = value ? value : "";
  });
};
