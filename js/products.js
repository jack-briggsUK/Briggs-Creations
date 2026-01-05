// js/products.js

window.products = [
  {
    id: "red-squirrel",
    title: "Red Squirrel",
    artist: "Charlotte Briggs",
    description:
      "A detailed illustration capturing the quiet curiosity of a red squirrel in the Lake District woodland.",
    price: 35.0,
    size: "A3",
    paper: "260gsm matt",
    image: "../assets/Red_Squirrel.jpg",
    alt: "Red Squirrel in the style of Charlotte Briggs",
  },
  {
    id: "hedgehog",
    title: "Hedgehog",
    artist: "Charlotte Briggs",
    description:
      "A soft, atmospheric illustration of a barn owl drifting through dusk.",
    price: 35.0,
    size: "A3",
    paper: "260gsm matt",
    image: "../assets/Hedgehog.jpg",
    alt: "Hedgehog in the style of Charlotte Briggs",
  },
  {
    id: "robin",
    title: "Robin",
    artist: "Charlotte Briggs",
    description:
      "A peaceful moment by the water’s edge, inspired by Lake District rivers.",
    price: 35.0,
    size: "A3",
    paper: "260gsm matt",
    image: "../assets/Robin.jpg",
    alt: "Robin in the style of Charlotte Briggs",
  },
  {
    id: "wild-rabbit",
    title: "Wild Rabbit",
    artist: "Charlotte Briggs",
    description:
      "A peaceful moment by the water’s edge, inspired by Lake District rivers.",
    price: 35.0,
    size: "A3",
    paper: "260gsm matt",
    image: "../assets/Wild_Rabbit.jpg",
    alt: "Wild Rabbit in the style of Charlotte Briggs",
  }
];

window.getProductById = function (id) {
  return window.products.find(product => product.id === id);
};
