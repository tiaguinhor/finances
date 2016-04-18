export class DataUtil {
	parseData(data){
		let parts = data.split('-');
		return new Date(parts[0], parts[1] - 1, parts[2]);
	}

	parseString(data){
		return new Date(data).toLocaleDateString();
	}

	formatDate(dataMiliseconds){
		let inicio = "00";
		let data = new Date(dataMiliseconds);
		let ano = data.getFullYear();
		let mes = (inicio + (data.getMonth() + 1)).slice(-2); //0001 = 01
		let dia = (inicio + data.getDate()).slice(-2);

		return ano + '-' + mes + '-' + dia;
	}

	getMonthName(data){
		let meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

		return meses[data.getMonth()];
	}

	getFirstDay(data){
		let ano = data.getFullYear();
		let mes = data.getMonth();

		return new Date(ano, mes, 1);
	}

	getLastDay(data){
		let ano = data.getFullYear();
		let mes = data.getMonth() + 1; //+1 para ir ao proximo mes

		return new Date(ano, mes, 0); //0 retorna ultimo dia do mes anterior
	}
}