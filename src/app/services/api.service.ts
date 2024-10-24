import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ToDoList } from '../interfaces/interfaces';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(private storage: Storage) {}

    async getToDoLists() {
        return (await this.storage.get('lists')) || [];
    }

    updateToDoLists(lists: ToDoList[]) {
        this.storage.set('lists', lists);
    }

    async updateToDoList(list: ToDoList) {
        this.storage.set(
            'lists',
            (await this.storage.get('lists')).map((l: ToDoList) => (l.id === list.id ? list : l))
        );
    }
}
