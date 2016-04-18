import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {IONIC_DIRECTIVES} from 'ionic-angular/config/directives';
import {DataUtil} from '../util/data-util';

@Component({
	selector: "data-filter",
	directives: IONIC_DIRECTIVES,
	inputs: ['startDate'],
	outputs: ['changeDate'],
	template: `<ion-row>
		<ion-col width-10>
			<button favorite clear round (click)="previousMonth()">
				<ion-icon name="arrow-dropleft-circle"></ion-icon>
			</button>
		</ion-col>

		<ion-col width-80>
			<h5 favorite text-center>{{mesSelecionado}}</h5>
		</ion-col>

		<ion-col width-10>
			<button favorite clear round (click)="nextMonth()">
				<ion-icon name="arrow-dropright-circle"></ion-icon>
			</button>
		</ion-col>
	</ion-row>`
})

export class DataFilter{
	constructor(){
		this.changeDate = new EventEmitter();
	}

	_updateMonth(){
		let dataUtil = new DataUtil();
		let ano = this.startDate.getFullYear();
		this.mesSelecionado = dataUtil.getMonthName(this.startDate)+' - '+ano;
		this._executeChangeDate();
	}

	_executeChangeDate(){
		this.changeDate.next(this.startDate);
	}

	ngOnInit(){
		this._updateMonth();
	}

	previousMonth(){
		this.startDate.setMonth(this.startDate.getMonth() - 1);
		this._updateMonth();
	}

	nextMonth(){
		this.startDate.setMonth(this.startDate.getMonth() + 1);
		this._updateMonth();
	}
}