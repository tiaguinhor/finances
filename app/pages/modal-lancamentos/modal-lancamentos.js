import {Page, NavController, ViewController, NavParams} from 'ionic-angular';
import {DAOContas} from '../../dao/dao-contas';
import {DataUtil} from '../../util/data-util';

@Page({
	templateUrl: 'build/pages/modal-lancamentos/modal-lancamentos.html',
})
export class ModalLancamentosPage {
	static get parameters(){
		return [[NavController], [ViewController], [NavParams]];
	}

	constructor(nav, view, params){
		this.nav = nav;
		this.view = view;

		this.lancamento = params.get("parameter") || {};
		this.lancamento.date = this._getDate(this.lancamento.date);

		this.dao = new DAOContas();
		this.dao.getList((list) =>{
			this.contas = list;
		});
	}

	_getDate(data){
		let dataUtil = new DataUtil();
		return dataUtil.formatDate(data);
	}

	cancel(){
		this.view.dismiss();
	}

	save(){
		let dataUtil = new DataUtil();
		let data = dataUtil.parseData(this.lancamento.date);

		this.lancamento.value = parseFloat(this.lancamento.value);
		this.lancamento.date = data.getTime();
		this.lancamento.pay = (this.lancamento.pay) ? 1 : 0;

		this.view.dismiss(this.lancamento);
	}
}
