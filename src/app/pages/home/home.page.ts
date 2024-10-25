import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
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
    IonModal,
    IonRouterOutlet,
    IonAvatar,
    IonCard,
    IonCardContent,
    IonInput,
    IonNote,
    InputCustomEvent,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonReorderGroup,
    ItemReorderEventDetail,
    IonReorder,
    IonRadio,
    IonRadioGroup,
    IonRow,
    IonCol,
    IonGrid,
    IonItemGroup,
    IonText,
    IonFooter,
    IonSelect,
    IonSelectOption,
    IonListHeader,
    IonSearchbar,
} from '@ionic/angular/standalone';
import { OverlayEventDetail } from '@ionic/core/components';
import { addIcons } from 'ionicons';
import { addCircleOutline, addCircle, listCircleOutline, pin, share, trash, eyeOutline, trashOutline, archive, heart, listCircle, menuOutline, removeCircle } from 'ionicons/icons';
import { ToDoItem, ToDoList } from 'src/app/interfaces/interfaces';
import { ApiService } from 'src/app/services/api.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    standalone: true,
    imports: [
        IonSearchbar,
        IonListHeader,
        IonFooter,
        IonText,
        IonItemGroup,
        IonGrid,
        IonCol,
        IonRow,
        IonRadioGroup,
        IonRadio,
        IonReorder,
        IonReorderGroup,
        IonItemOption,
        IonItemOptions,
        IonItemSliding,
        IonNote,
        IonInput,
        IonCardContent,
        IonCard,
        IonAvatar,
        IonModal,
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
        RouterModule,
        IonSelect,
        IonSelectOption,
    ],
})
export class HomePage implements AfterViewInit {
    @ViewChild('modal', { static: true }) modal!: IonModal;
    @ViewChild('reminderModal', { static: true }) reminderModal!: IonModal;
    @ViewChild('input', { static: false }) input!: IonInput;
    @ViewChild('reminderInput', { static: false }) reminderInput!: IonInput;
    masterEdit = true;
    masterEditIcon = true;
    lists: ToDoList[] = [];
    presentingElement: HTMLIonRouterOutletElement;
    newList = { name: '', color: 'primary' };
    newReminder: ToDoItem = { id: 0, todo: '', completed: false, parent_id: undefined, parent_name: undefined, parent_color: undefined };
    colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'];
    isModalOpen = false;
    isReminderModalOpen = false;
    private routerSubscription?: Subscription;

    constructor(private routerOutlet: IonRouterOutlet, private api: ApiService, private router: Router) {
        addIcons({ removeCircle, listCircle, menuOutline, trashOutline, addCircle, listCircleOutline, addCircleOutline, eyeOutline, archive, heart, trash, pin, share });
        this.getLists();
        this.presentingElement = this.routerOutlet.nativeEl;
    }

    // Testing
    ngAfterViewInit() {
        // Automatically open the modal on component load
        // this.presentModal();
        // this.reminderModal.present();

        this.routerSubscription = this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
            if (event.url === '/home') {
                this.getLists();
            }
        });
    }

    async presentModal() {
        await this.modal.present();
    }
    // End Testing

    async getLists() {
        this.lists = await this.api.getToDoLists();
    }

    inputChanged(event: InputCustomEvent) {
        console.log('inputChanged', event);
        this.api.updateToDoLists(this.lists);
    }

    viewList(list: ToDoList) {
        console.log('viewList', list);
        this.router.navigate(['/list', list.id]);
    }

    deleteList(list: ToDoList) {
        this.lists = this.lists.filter((l) => l.id !== list.id);
        this.api.updateToDoLists(this.lists);
    }

    handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
        // The `from` and `to` properties contain the index of the item
        // when the drag started and ended, respectively
        console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

        const itemToMove = this.lists.splice(ev.detail.from, 1)[0];
        this.lists.splice(ev.detail.to, 0, itemToMove);
        this.api.updateToDoLists(this.lists);

        // Finish the reorder and position the item in the DOM based on
        // where the gesture ended. This method can also be called directly
        // by the reorder group
        ev.detail.complete();
    }

    async focusInput(input: any) {
        console.log('focusInput', this.input);
        await input.setFocus();
    }

    createList() {
        console.log('createList', this.newList);

        this.lists.push({ id: this.lists.length + 1, name: this.newList.name, items: [], color: this.newList.color });
        this.api.updateToDoLists(this.lists);
    }

    initList() {
        this.newList = { name: '', color: 'primary' };
    }

    initReminder() {
        let topList = this.lists[0];
        console.log('toplist', topList);
        this.newReminder = { id: undefined, todo: '', completed: false, parent_id: topList?.id, parent_name: topList?.name, parent_color: topList?.color };
    }

    createReminder() {
        this.lists.find((list) => list.id === this.newReminder.parent_id)?.items.push(this.newReminder);
        this.api.updateToDoLists(this.lists);
    }

    showDelete(slidingItem: IonItemSliding) {
        if (this.masterEdit) {
            slidingItem.open('end'); // Slide open towards the start
        }
    }

    trackByFn(index: number, item: ToDoList) {
        return item.id; // or any unique identifier
    }

    toggleMasterEdit() {
        if (this.masterEdit) {
            this.masterEditIcon = false;
            setTimeout(() => {
                this.masterEdit = false; // Hide icons after slide-out
            }, 50);
            // Adjust delay as needed
        } else {
            this.masterEdit = true;
            setTimeout(() => {
                this.masterEditIcon = true;
            }, 50);
        }
    }
}
