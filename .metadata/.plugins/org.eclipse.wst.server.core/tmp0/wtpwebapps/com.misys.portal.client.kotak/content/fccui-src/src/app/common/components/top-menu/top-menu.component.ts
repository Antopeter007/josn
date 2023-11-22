import { Component, OnInit, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'fcc-common-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {

  @Input() topMenuObject: MenuItem[] = [];
  @Input() displayTopMenu = true;
  constructor() {
    //eslint : no-empty-function
  }

  ngOnInit() {
    //eslint : no-empty-function
  }

  setMenuObject(topMenuObj: MenuItem[]) {
    this.topMenuObject = topMenuObj;
  }

  setDisplayTopMenu(displayTopMenu: boolean) {
    this.displayTopMenu = displayTopMenu;
  }
}
