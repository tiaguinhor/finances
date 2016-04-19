import {Page, NavController, NavParams} from 'ionic-angular';
import {DataUtil} from '../../util/data-util';
import {DAOLancamentos} from '../../dao/dao-lancamentos';

@Page({
	templateUrl: 'build/pages/relatorio/relatorio.html',
})

export class RelatorioPage {
	static get parameters(){
		return [[NavController], [NavParams]];
	}

	constructor(nav, params){
		this.nav = nav;
		this.dao = new DAOLancamentos();
		this.currentDate = params.get("parameter");
		this.action = "entrada";
		this._getList(this.action);
	}

	_getList(action){
		let dataUtil = new DataUtil();
		let dataInicio = dataUtil.getFirstDay(this.currentDate);
		let dataFim = dataUtil.getLastDay(this.currentDate);

		this.dao.getListGroupByConta(dataInicio, dataFim, action, (list) =>{
			this.listContas = list;
		});
	}

	_calcTotal(){
		let total = 0;

		for(var i = 0; i < this.listContas.length; i++){
			total += this.listContas[i].saldo;
		}

		return total;
	}

	_calcPercentual(){
		let total = this._calcTotal();

		for(var i = 0; i < this.listContas.length; i++){
			this.listContas[i].percentual = (this.listContas[i].saldo / total) * 100;
		}
	}

	onSelect(action){
		this._getList(action);
	}
}
