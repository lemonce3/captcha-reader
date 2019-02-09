const sharp = require('sharp');
const path = require('path');
const config = require('../../config.json');
const { exec } = require('child_process');
const Randexp = require('randexp');
const randexp = new Randexp('[A-Z3-8]{4}');
const fs = require('fs');


function captchaProcessed(data) {
	const captchaName = randexp.gen();
	const folderPath = path.resolve(config.captchaPath, captchaName);

	fs.mkdir(folderPath, err => {
		if (err) {
			throw err;
		}
	});

	const fileName = captchaName + '_' + Date.now().toString() + '.png';
	const captchaPath = path.resolve(config.captchaPath, captchaName, fileName);
	sharp(Buffer.from(data.split(',')[1], 'base64'))
		.threshold(150, true)
		.resize(160, 60)
		.png()
		.toBuffer((err, data) => { 
			if (err) {
				throw err;
			}
			fs.writeFile(captchaPath, data, (err) => {
				if (err) throw err;				
			});
		});
	
	return folderPath;
}

function captchaRecognition(folderPath) {
	return new Promise(resolve => {
		const pyPath = path.resolve(config.train.projectPath);
		const child = exec(`python ${config.train.fileName} ${folderPath}`, { cwd: pyPath });
		child.stdout.on('data', function(data) {
			resolve({result: data.toLowerCase().replace('\r\n', '')});
		});
	});
}

module.exports = {
	processed: captchaProcessed,
	recognition: captchaRecognition
};