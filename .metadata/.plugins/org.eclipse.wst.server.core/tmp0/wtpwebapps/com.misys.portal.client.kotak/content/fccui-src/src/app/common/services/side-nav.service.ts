import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SidenavService {

    private sidenav: MatSidenav;
    public subMenu$ = new BehaviorSubject([]);
    public menuIndex;

    public setSidenav(sidenav: MatSidenav) {
        this.sidenav = sidenav;
    }

    public open(menuIndex) {
        if (this.menuIndex === menuIndex) {
            this.sidenav.toggle();
            return;
        }
        this.menuIndex = menuIndex;
        return this.sidenav.open();
    }


    public close() {
        return this.sidenav.close();
    }

    public toggle(): void {
        this.sidenav.toggle();
   }
}
