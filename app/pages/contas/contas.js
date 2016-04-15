import {Page, Modal, NavController} from 'ionic-angular';
import {DAOContas} from '../../dao/dao-contas';
import {ModalContasPage} from '../modal-contas/modal-contas'
import {Toast} from 'ionic-native';

@Page({
	templateUrl: 'build/pages/contas/contas.html'
})

export class ContasPage {
	static get parameters(){
		return [[NavController]];
	}

	constructor(nav){
		this.dao = new DAOContas();
		this.dao.getList((list) =>{
			this.listContas = list;
		});
		this.nav = nav;
	}

	insert(){
		let modal = Modal.create(ModalContasPage);

		modal.onDismiss((data) =>{
			if(data){
				this.dao.insert(data, (list) =>{
					this.listContas.push(list);
				});
			}
		});

		this.nav.present(modal);
	}

	edit(conta){
		let modal = Modal.create(ModalContasPage, {parameter: conta});

		modal.onDismiss((data) =>{
			if(data){
				this.dao.edit(data);
			}
		});

		this.nav.present(modal);
	}

	remove(conta){
		this.dao.remove(conta, (list) =>{
			let pos = this.listContas.indexOf(list);
			this.listContas.splice(pos, 1);
		});
	}
}
