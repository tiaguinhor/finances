import {Page, NavController, Modal, Alert, Events} from 'ionic-angular';
import {ModalLancamentosPage} from '../modal-lancamentos/modal-lancamentos';
import {DAOLancamentos} from '../../dao/dao-lancamentos';
import {DataUtil} from '../../util/data-util';
import {DataFilter} from '../../components/data-filter';
import {RelatorioPage} from '../relatorio/relatorio';

@Page({
	templateUrl: 'build/pages/lancamentos/lancamentos.html',
	directives: [DataFilter]
})
export class LancamentosPage {
	static get parameters(){
		return [[NavController], [Events]];
	}

	constructor(nav, events){
		this.nav = nav;
		this.events = events;
		this.currentDate = new Date();
		this.dao = new DAOLancamentos();
		this.getListLancamentos();
	}

	getListLancamentos(){
		let dataUtil = new DataUtil();
		let dataInicio = dataUtil.getFirstDay(this.currentDate);
		let dataFim = dataUtil.getLastDay(this.currentDate);

		this.dao.getList(dataInicio, dataFim, (list) =>{
			this.listLancamentos = list;
		});
	}

	updateDate(data){
		this.currentDate = data;
		this.getListLancamentos();
		this.updateSaldo();
	}

	insert(){
		let modal = Modal.create(ModalLancamentosPage);

		modal.onDismiss((data) =>{
			if(data){
				this.dao.insert(data, (list) =>{
					this.updateDate(new Date(list));
				})
			}
		});

		this.nav.present(modal);
	}

	edit(lancamento){
		let modal = Modal.create(ModalLancamentosPage, {parameter: lancamento});

		modal.onDismiss((data) =>{
			if(data){
				this.dao.edit(lancamento, (list) =>{
					this.updateDate(new Date(list));
				});
			}
		});

		this.nav.present(modal);
	}

	remove(lancamento){
		let confirm = Alert.create({
			title: "Excluir",
			body: "Deseja realmente excluir o lançamento "+lancamento.description+"?",
			buttons: [
				{
					text: "Sim",
					handler: () =>{
						this.dao.remove(lancamento, (list) =>{
							this.updateDate(new Date(list));
						});
					}
				},
				{
					text: "Não"
				}
			]
		});

		this.nav.present(confirm);
	}

	getDate(data){
		let dataUtil = new DataUtil();
		return dataUtil.parseString(data);
	}

	getStatus(status){
		return (status) ? "Pago" : "Não Pago";
	}

	getAction(action){
		return (action == 'entrada')
	}

	updateSaldo(){
		this.dao.getSaldo((data) =>{
			this.events.publish('saldo:updated', data);
		});
	}

	paymentButtonText(lancamento){
		return (lancamento.pay) ? "Reabrir" : "Pagar";
	}
	
	changePaymentStatus(lancamento){
		lancamento.pay = (lancamento.pay) ? 0 : 1;

		this.dao.edit(lancamento, (data) =>{
			this.updateDate(new Date(lancamento.date));
		});
	}

	onClickMonth(){
		this.nav.push(RelatorioPage, {parameter: this.currentDate});
	}
}
