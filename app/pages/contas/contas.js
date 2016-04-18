import {Page, Modal, NavController, Alert} from 'ionic-angular';
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
		this.nav = nav;
		this.dao = new DAOContas();
		this.dao.getList((list) =>{
			this.listContas = list;
		});
	}

	insert(){
		let modal = Modal.create(ModalContasPage);

		modal.onDismiss((data) =>{
			if(data){
				this.dao.insert(data, (list) =>{
					this.listContas.push(list);

					Toast.showShortBottom("Conta inserida com sucesso.").subscribe((toast) =>{
						console.log(toast);
					});
				});
			}
		});

		this.nav.present(modal);
	}

	edit(conta){
		let modal = Modal.create(ModalContasPage, {parameter: conta});

		modal.onDismiss((data) =>{
			if(data){
				this.dao.edit(data, (list) =>{
					Toast.showShortBottom("Conta alterada com sucesso.").subscribe((toast) =>{
						console.log(toast);
					});
				});
			}
		});

		this.nav.present(modal);
	}

	remove(conta){
		let confirm = Alert.create({
			title: "Excluir",
			body: "Deseja realmente excluir a conta "+conta.description+"?",
			buttons: [
				{
					text: "Sim",
					handler: () =>{
						this.dao.remove(conta, (list) =>{
							let pos = this.listContas.indexOf(list);
							this.listContas.splice(pos, 1);

							Toast.showShortBottom("Conta removida com sucesso.").subscribe((toast) =>{
								console.log(toast);
							});
						});
					}
				},
				{text: "Não"}
			]
		});

		this.nav.present(confirm);
	}
}
