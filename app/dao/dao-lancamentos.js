import {Storage, SqlStorage} from 'ionic-angular';

export class DAOLancamentos {
	constructor(){
		let storage = new Storage(SqlStorage);

		storage.query("CREATE TABLE IF NOT EXISTS lancamentos (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, value REAL, date INTEGER, conta TEXT, action TEXT, pay INTEGER)").then((data) =>{
			console.log("Tabela criada");
		}, (error) =>{
			console.log("Erro :" + JSON.stringify(error.err));
		});
	}

	getList(dataInicio, dataFim, successCallback){
		let storage = new Storage(SqlStorage);

		storage.query("SELECT * FROM lancamentos where date >= ? and date <= ?", [dataInicio.getTime(), dataFim.getTime()]).then((data) =>{
			let list = [];

			for(var i = 0; i < data.res.rows.length; i++){
				let row = data.res.rows.item(i);
				let lancamento = {
					id: row.id,
					description: row.description,
					value: row.value,
					date: row.date,
					conta: row.conta,
					action: row.action,
					pay: row.pay
				};

				list.push(lancamento);
			}

			successCallback(list);
		}, (error) =>{
			console.log("Erro :" + JSON.stringify(error.err));
		});
	}

	insert(lancamento, successCallback){
		let storage = new Storage(SqlStorage);

		storage.query("INSERT INTO lancamentos (description, value, date, conta, action, pay) VALUES (?, ?, ?, ?, ?, ?)", [lancamento.description, lancamento.value, lancamento.date, lancamento.conta, lancamento.action, lancamento.pay]).then((data) =>{
			successCallback(lancamento);
		}, (error) =>{
			console.log("Erro :" + JSON.stringify(error.err));
		});
	}

	edit(lancamento, successCallback){
		let storage = new Storage(SqlStorage);

		storage.query("UPDATE lancamentos SET description = ?, value = ?, date = ?, conta = ?, action = ?, pay = ? WHERE id = ?", [lancamento.description, lancamento.value, lancamento.date, lancamento.conta, lancamento.action, lancamento.pay, lancamento.id]).then((data) =>{
			successCallback(lancamento);
		}, (error) =>{
			console.log("Erro :" + JSON.stringify(error.err));
		});
	}

	remove(lancamento, successCallback){
		let storage = new Storage(SqlStorage);

		storage.query("DELETE FROM lancamentos WHERE id = ?", [lancamento.id]).then((data) =>{
			successCallback(lancamento);
		}, (error) =>{
			console.log("Erro :" + JSON.stringify(error.err));
		});
	}

	getSaldo(successCallback){
		let storage = new Storage(SqlStorage);

		storage.query(`
			SELECT TOTAL(value) as saldo, action FROM lancamentos WHERE pay = 1 AND action = 'entrada'
			UNION
			SELECT TOTAL(value) as saldo, action FROM lancamentos WHERE pay = 1 AND action = 'saida'
		`).then((data) =>{
			for(var i = 0; i < data.res.rows.length; i++){
				let saldo = 0;
				let row = data.res.rows.item(i);

				if(row.action == 'entrada')
					saldo += row.saldo;
				else
					saldo -= row.saldo;

				successCallback(saldo);
			}
		}, (error) =>{
			console.log("Erro :" + JSON.stringify(error.err));
		});
	}

	getListGroupByConta(dataInicio, dataFim, action, successCallback){
		let storage = new Storage(SqlStorage);

		storage.query("SELECT conta, TOTAL(value) as saldo FROM lancamentos WHERE data >= ? AND data <= ? AND action = ? AND pay = 1 GROUP BY conta", [dataInicio.getTime(), dataFim.getTime(), action]).then((data) =>{
			let list = [];

			for(var i = 0; i < data.res.rows.length; i++){
				let row = data.res.rows.item(i);
				let conta = {
					conta: row.conta,
					saldo: row.saldo,
					percentual: 0
				};

				list.push(conta);
			}

			successCallback(list);
		});
	}
}