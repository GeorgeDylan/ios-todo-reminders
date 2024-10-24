import { Component, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import {
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonIcon,
    IonInput,
    IonItem,
    IonRadioGroup,
    IonRadio,
    IonGrid,
    IonRow,
    IonCol,
    IonModal,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';

@Component({
    selector: 'app-list-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    standalone: true,
    imports: [
        IonModal,
        CommonModule,
        FormsModule,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonButton,
        IonTitle,
        IonContent,
        IonCard,
        IonCardContent,
        IonIcon,
        IonInput,
        IonItem,
        IonRadioGroup,
        IonRadio,
        IonGrid,
        IonRow,
        IonCol,
    ],
})
export class ListModalComponent {
    @Input() list: any; // Input from parent component
    @ViewChild('input', { static: false }) input!: IonInput;
    // @ViewChild('modal') modal!: IonModal;

    colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'];

    constructor(private modalController: ModalController, private api: ApiService) {}

    closeModal() {
        this.modalController.dismiss(); // Dismiss the modal without returning data
    }

    updateList() {
        this.api.updateToDoList(this.list);
    }

    async focusInput() {
        console.log('focusInput', this.input);
        await this.input.setFocus();
    }
}
