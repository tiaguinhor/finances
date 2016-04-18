import {Storage, SqlStorage} from 'ionic-angular';

export class DAOContas {
	constructor(){
		let storage = new Storage(SqlStorage);

		storage.query("CREATE TABLE IF NOT EXISTS contas(id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT)").then((data) =>{
			console.log('Tabela criada.');
		}, (error) =>{
			console.log('Erro: ' + JSON.stringify(error.err));
		});
	}

	getList(successCallback){
		let storage = new Storage(SqlStorage);

		storage.query("SELECT * FROM contas").then((data) =>{
			let list = [];

			for(var i = 0; i < data.res.rows.length; i++){
				let item = {};

				item.id = data.res.rows.item(i).id;
				item.description = data.res.rows.item(i).description;

				list.push(item);
			}

			successCallback(list);
		}, (error) =>{
			console.log('Erro: ' + JSON.stringify(error.err));
		});
	}

	insert(conta, successCallback){
		// this.list.push(conta);
		let storage = new Storage(SqlStorage);

		storage.query("INSERT INTO contas (description) VALUES (?)", [conta.description]).then((data) =>{
			conta.id = data.res.insertId;
			successCallback(conta);
		}, (error) =>{
			console.log('Erro: ' + JSON.stringify(error.err));
		});
	}

	edit(conta, successCallback){
		let storage = new Storage(SqlStorage);

		storage.query("UPDATE contas SET description = ? WHERE id = ?", [conta.description, conta.id]).then((data) =>{
			successCallback(conta);
		}, (error) =>{
			console.log('Erro: ' + JSON.stringify(error.err));
		});
	}

	remove(conta, successCallback){
		let storage = new Storage(SqlStorage);

		storage.query("DELETE FROM contas WHERE id = ?", [conta.id]).then((data) =>{
			successCallback(conta);
		}, (error) =>{
			console.log('Erro: ' + JSON.stringify(error.err));
		});
	}
}