import {Page, NavController, Modal, Alert} from 'ionic-angular';
import {ModalLancamentosPage} from '../modal-lancamentos/modal-lancamentos';
import {DAOLancamentos} from '../../dao/dao-lancamentos';
import {DataUtil} from '../../util/data-util';
import {DataFilter} from '../../components/data-filter';

@Page({
	templateUrl: 'build/pages/lancamentos/lancamentos.html',
	directives: [DataFilter]
})
export class LancamentosPage {
	static get parameters(){
		return [[NavController]];
	}

	constructor(nav){
		this.nav = nav;
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
		this.getListLancamentos();
	}

	insert(){
		let modal = Modal.create(ModalLancamentosPage);

		modal.onDismiss((data) =>{
			if(data){
				this.dao.insert(data, (list) =>{
					this.listLancamentos.push(list);
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
					//
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
							let pos = this.listLancamentos.indexOf(list);
							this.listLancamentos.splice(pos, 1);
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
}
