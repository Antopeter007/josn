import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { SidenavService } from '../../../../common/services/side-nav.service';

@Component({
  selector: 'app-sub-menu',
  templateUrl: './sub-menu.component.html',
  styleUrls: ['./sub-menu.component.scss'],
})
export class SubMenuComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('rightSidenav') public sidenav: MatSidenav;
  @Input() subMenu: any[];
   constructor(protected sidenavService: SidenavService,
               protected router: Router) { }

  ngOnInit() {
    //eslint : no-empty-function
   }

  ngAfterViewInit() {
    this.sidenavService.setSidenav(this.sidenav);
  }

  // Will be used for comparing object changes of Submenu
  ngOnChanges() {
    //eslint : no-empty-function
   }

  onbutton(url: string) {
    url = url.indexOf('#') > -1 ? url.split('#')[1] : url;
    this.router.navigateByUrl(url);
  }

}
