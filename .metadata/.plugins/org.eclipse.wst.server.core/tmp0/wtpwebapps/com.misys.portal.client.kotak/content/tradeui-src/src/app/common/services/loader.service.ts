import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { LoaderState } from '../components/loader/loader';

@Injectable({ providedIn: 'root' })

export class LoaderService {

    private readonly loaderSubject = new Subject<LoaderState>();

    loaderState = this.loaderSubject.asObservable();

    constructor() { }

    show() {
        this.loaderSubject.next({show: true} as LoaderState);
    }

    hide() {
        this.loaderSubject.next({show: false} as LoaderState);
    }
}
