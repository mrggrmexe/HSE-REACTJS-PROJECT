export function generateGoods(count = 57) {
  const names = ["Apple", "Banana", "Orange", "Mango", "Pear", "Peach", "Kiwi", "Grapes", "Pineapple"];

  return Array.from({ length: count }, (_, i) => {
    const id = String(i + 1);
    const name = `${names[i % names.length]} #${id}`;
    const releaseDate = new Date(2024, i % 12, 1 + (i % 28)).toISOString().slice(0, 10);
    const price = Number((1.2 + (i % 15) * 0.35).toFixed(2));

    return {
      id,
      name,
      releaseDate,
      price,
      description: `Fresh ${name}. Delivered in season.`,
      stock: 10 + (i % 30)
    };
  });
}

export const GOODS = generateGoods(57);

