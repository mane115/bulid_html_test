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
		let link = html.match(/<link [^>]*>/g);
		let timeStamp = Date.now();
		if (tags && tags.length > 0) {
			tags.forEach(tag => {
				var tempTag = tag;
				if (tag.indexOf(config.dir.controller) === -1 && tag.indexOf(config.dir.util) === -1) {
					return;
				}
				if (tag.indexOf('t=') !== -1) {
					tag = tag.replace(/t=[0-9]{13}/g, '');
				}
				if (tag.indexOf('js?"') !== -1 || tag.indexOf("js?'") !== -1) {
					tag = tag.replace('js?', 'js')
				}
				let replace = tag.replace('.js', `.js?t=${timeStamp}`);
				html = html.replace(tempTag, replace);
			});
		}
		if (link && link.length > 0) {
			link.forEach(tag => {
				var tempTag = tag;
				if (tag.indexOf(config.dir.css) === -1) {
					return;
				}
				if (tag.indexOf('t=') !== -1) {
					tag = tag.replace(/t=[0-9]{13}/g, '');
				}
				if (tag.indexOf('css?"') !== -1 || tag.indexOf("css?'") !== -1) {
					tag = tag.replace('css?', 'css')
				}
				let replace = tag.replace('.css', `.css?t=${timeStamp}`);
				html = html.replace(tempTag, replace);
			});
		}
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
