import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    InputCustomEvent,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonIcon,
    IonItem,
    IonLabel,
    IonButtons,
    IonButton,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonInput,
    IonCheckbox,
    IonBackButton,
    IonListHeader,
    IonText,
    IonFooter,
    IonPopover,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline, trashOutline, addCircle, ellipsisHorizontalCircleOutline } from 'ionicons/icons';
import { ToDoItem, ToDoList } from 'src/app/interfaces/interfaces';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from './popover/popover.component';
@Component({
    selector: 'app-list',
    templateUrl: './list.page.html',
    styleUrls: ['./list.page.scss'],
    standalone: true,
    imports: [
        IonPopover,
        IonFooter,
        IonText,
        IonListHeader,
        IonBackButton,
        IonCheckbox,
        IonInput,
        IonItemOption,
        IonItemOptions,
        IonItemSliding,
        IonButton,
        IonButtons,
        IonLabel,
        IonItem,
        IonIcon,
        IonList,
        IonContent,
        IonHeader,
        IonTitle,
        IonToolbar,
        CommonModule,
        FormsModule,
    ],
    providers: [PopoverController],
})
export class ListPage {
    @ViewChildren('input') inputs!: QueryList<IonInput>;

    id: any = null;
    list?: ToDoList;

    constructor(private route: ActivatedRoute, private api: ApiService, private popoverController: PopoverController) {
        this.id = this.route.snapshot.paramMap.get('id');
        addIcons({ ellipsisHorizontalCircleOutline, addCircleOutline, addCircle, trashOutline });
        this.getList(this.id);
    }

    async getList(id: any) {
        const lists = await this.api.getToDoLists();
        this.list = lists.find((list: ToDoList) => list.id == id);
        console.log('got list', this.list);
        if (this.list && !this.list?.items.length) this.list.items = [];
    }

    addItem() {
        this.list?.items.push({ id: this.list?.items.length + 1, todo: '', completed: false });

        setTimeout(() => {
            this.focusLastInput();
        }, 0);
    }

    inputChanged(event: any) {
        console.log('inputChanged', event);
        this.api.updateToDoList(this.list!);
    }

    deleteItem(item: ToDoItem) {
        this.list!.items = this.list!.items.filter((l) => l.id !== item.id);
        this.api.updateToDoList(this.list!);
    }

    trackByFn(index: number, item: ToDoItem) {
        return item.id; // or any unique identifier
    }

    async openPopover(ev: Event) {
        console.log('opnPopover', ev);
        const popover = await this.popoverController.create({
            component: PopoverComponent, // Your popover content component
            event: ev, // Pass the event to open the popover near the clicked button
            translucent: true,
            arrow: false,
            componentProps: {
                list: this.list,
            },
        });

        await popover.present();

        // Listen for when the popover is dismissed
        popover.onDidDismiss().then(() => {
            console.log('Popover dismissed');
            // Clean up references to allow garbage collection
            popover.dismiss();
        });
    }

    focusLastInput() {
        const inputsArray = this.inputs.toArray();
        if (inputsArray.length > 0) {
            inputsArray[inputsArray.length - 1].setFocus();
        }
    }
}
