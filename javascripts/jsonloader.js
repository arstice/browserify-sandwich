"use strict";

// JSON -> Object(s)
const JsonLoader = (file) => new Promise((resolve, reject) => {
	var jsonLoader = new XMLHttpRequest();
	jsonLoader.onerror = () => reject();
	jsonLoader.onload = () => {
		if (jsonLoader.status == 200) {
			let response = JSON.parse(jsonLoader.responseText);
			resolve(response);
		} else {
			reject();
		}
	};
	jsonLoader.open("GET", `../data/${file}.json`);
	jsonLoader.send();
});

module.exports = JsonLoader;