const ingredient = {
  name: 'test',
  count: 123,
  food: true
};

const payload = { ...ingredient, name: 'new name', testKey: 123543 };
console.log(payload);

const testArr = [1, 2, 3, 4];
// const newArr = [testArr, 'value']
// console.log(newArr)


const ingredients = [1, 2, 3, 4];
const index = 2;

const [el] = ingredients.splice(index, 1);
console.log(ingredients.splice(index - 1, 0, el));
console.log(ingredients);
