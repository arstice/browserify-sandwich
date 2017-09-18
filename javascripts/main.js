"use strict";

let totalPrice = 0;

// JsonLoader :: File -> Promise
const JsonLoader = require("./jsonloader");

// TransformOldObjectToIngredientObject :: OldObject -> IngredientObject
// Transform existing object structure to one more suited to what we're doing
const TransformOldObjectToIngredientObject = (oldObject) => {
	let keyName = Object.keys(oldObject)[0];
	let ingredients = Object.keys(oldObject[keyName]);
	return {
		"name": keyName,
		"ingredients": ingredients
	};
};

// CreateInputFromIngredient :: Ingredient -> String
// Returns an HTML string with a uniquely-ID'd checkbox and a label
const CreateInputFromIngredient = (ingredient) => {
	return `<input class="ingredient" id="${ingredient}" type="checkbox"> <h5 id="${ingredient}-label">${ingredient}: ${ingredient.value}<br>`;
};

// CreateHtmlBlockFromIngredientObject :: IngredientObject -> HtmlBlock
// Returns a card to be added to the DOM
const CreateHtmlBlockFromIngredientObject = (ingredientObject) => {
	let header = `<section class="ingredient-card"><h2>${ingredientObject.name}</h2>`;
	let body = ingredientObject.ingredients.map(CreateInputFromIngredient);
	let footer = "</section>";
	return header.concat(body.join("")).concat(footer);
};

// MapIngredientObjects :: [IngredientObject] -> [HtmlBlock]
const MapIngredientObjects = (ingredientObjects) => {
	return ingredientObjects.map(CreateHtmlBlockFromIngredientObject);
};

// FunctionalCore :: [JsonObject] -> [HtmlBlock]
const FunctionalCore = (jsonObjects) => {
	let ingredientObjects = jsonObjects.map(TransformOldObjectToIngredientObject);
	return MapIngredientObjects(ingredientObjects);
};

const WrapFunctionalCore = (jsonObjects) => new Promise((resolve, reject) => {
	if (Array.isArray(jsonObjects)) {
		resolve(FunctionalCore(jsonObjects));
	} else {
		reject();
	}
});

// Print the cards we've created to the DOM
// AttachHtmlBlocksToDom :: [HtmlBlock] -> DOM elements
const AttachHtmlBlocksToDom = (HtmlBlocks) => {
	HtmlBlocks.forEach((HtmlBlock) => {
		document.getElementById("menu").innerHTML += HtmlBlock;
	});
};

// main :: oldHtml -> [jsonFile] -> ()
const main = () => {
	const jsonFiles = ["breads", "meats", "cheeses", "veggies", "condiments"];

	// [jsonFile] -> either err oldObject
	let getJsonObjectsPromise = Promise.all(jsonFiles.map((jsonFile) => JsonLoader(jsonFile)))
		.then(WrapFunctionalCore)
		.then(AttachHtmlBlocksToDom);
};

main();

// // When a checkbox is clicked, add or remove the price of its ingredient from the total and output the new total
// const ingredientClick = (e) => {

// 	if (e.target.checked) {
// 		totalPrice += document.getElementById(`${e.target.id}-label`).parseFloat();
// 	} else {
// 		totalPrice -= document.getElementById(`${e.target.id}-label`).parseFloat();
// 	}
// 	document.getElementById("total").innerHTML = totalPrice.toFixed(2);
// };

// // These three functions get an array of all elements of class "ingredient" and add a change listener to each ingredient's checkbox
// const reduceDomElementToId = (nextIteration, arrayElementKeyValue) => {
// 	nextIteration.push(arrayElementKeyValue.id); 
// 	return nextIteration;
// };

// const mapIngredientElementsForArray = (ingrElement) => {
// 	return Object.values(ingrElement).reduce(reduceDomElementToId, []);
// };

// mapIngredientElementsForArray(document.getElementsByClassName("ingredient")).forEach(function(value){
// 	document.getElementById(`${value}`).addEventListener("change", ingredientClick);
// });