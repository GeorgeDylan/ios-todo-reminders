import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    IonContent,
    IonList,
    IonLabel,
    IonItem,
    IonIcon,
    IonModal,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonRouterOutlet,
    IonInput,
    IonRadio,
    IonRadioGroup,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { informationCircleOutline, trashOutline, listCircle } from 'ionicons/icons';
import { ToDoList } from 'src/app/interfaces/interfaces';
import { ApiService } from 'src/app/services/api.service';
import { ModalController, PopoverController } from '@ionic/angular';
import { ListModalComponent } from '../modal/modal.component';

@Component({
    selector: 'app-popover',
    templateUrl: 'popover.component.html',
    styleUrls: ['./popover.component.scss'],
    standalone: true,
    imports: [
        IonCol,
        IonRow,
        IonGrid,
        IonCardContent,
        IonCard,
        IonTitle,
        IonButton,
        IonButtons,
        IonToolbar,
        IonHeader,
        IonModal,
        IonIcon,
        IonItem,
        IonLabel,
        IonList,
        IonContent,
        CommonModule,
        FormsModule,
        IonRadio,
        IonRadioGroup,
        IonInput,
    ],
    providers: [ModalController],
})
export class PopoverComponent implements OnDestroy {
    @Input() list!: ToDoList;
    presentingElement: HTMLIonRouterOutletElement;
    colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'];

    constructor(private routerOutlet: IonRouterOutlet, private api: ApiService, private modalController: ModalController, private popoverController: PopoverController) {
        addIcons({ informationCircleOutline, trashOutline, listCircle });
        console.log('Popover Open', this.list);
        this.presentingElement = this.routerOutlet.nativeEl;
    }

    async ngOnDestroy() {
        console.log('Popover Destroyed', this.list);
    }

    editList() {
        console.log('editList', this.list);
    }

    deleteList() {
        console.log('deleteList', this.list);
    }

    async openModal() {
        const modal = await this.modalController.create({
            component: ListModalComponent, // The standalone modal component
            presentingElement: this.presentingElement,
            componentProps: {
                list: this.list, // Pass the list object to the modal
            },
        });

        await modal.present();

        const { data } = await modal.onWillDismiss();

        if (data) {
            console.log('Modal dismissed with data:', data);
            // Handle any data returned from the modal (e.g., updated list)
            this.list = data.list; // Update the list in the parent component
        }

        // Close the popover after the modal is dismissed
        this.popoverController.dismiss();
    }
}
