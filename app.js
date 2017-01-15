const fs = require('fs');
const config = require('./config');
const readFile = function(dir) {
	return new Promise((success, fail) => {
		fs.readFile(dir, (err, data) => {
			if (err) return fail(err);
			success(data.toString())
		})
	})
}
const rewriteFile = function(dir, data) {
	let option = {
		flag: 'w'
	};
	return new Promise((success, fail) => {
		fs.writeFile(dir, data, option, err => {
			if (err) return fail(err);
			console.log(`rewrite file ${dir} success`);
			success(data);
		})
	})
}

const buildFile = async function(dir) {
	try {
		let html = await readFile(dir);
		let tags = html.match(/<script [^>]*>/g);
		tags.forEach(tag => {
			if (tag.indexOf(config.dir.controller) === -1 && tag.indexOf(config.dir.util) === -1) {
				return false;
			}
			tag = tag.replace(/t=[0-9]{13}/g, '');
			let replace = tag.replace('.js', `.js?t=${Date.now()}`);
			html = html.replace(tag, replace);
		});
		await rewriteFile(dir, html);
	} catch (err) {
		console.log(err);
	}
}

const init = async function() {
	try {
		let commonDir = config.views ? config.views : '.';
		config.files.forEach(dir => {
			dir = `${commonDir}${dir}`
			buildFile(dir)
		})
	} catch (err) {
		console.log(err);
	}
}

init()