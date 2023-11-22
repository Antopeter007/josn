import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { SidenavService } from '../../../../common/services/side-nav.service';
import { MenuService } from '../../../../common/services/menu.service';
import { CommonService } from '../../../../common/services/common.service';
import { FccGlobalConstantService } from '../../../../common/core/fcc-global-constant.service';
import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConstant } from '../../../../common/core/fcc-global-constants';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, AfterViewInit {
  // Remove JSON once integrated with API
  bankMenuJSON = [];
  subMenu: any = [];
  selectedMenu: any;
  SideNavClicked = false;
  dir = localStorage.getItem('langDir');
  menuLabel = Object.keys(this.bankMenuJSON);
  @ViewChild('rightSidenav') public sidenav: MatSidenav;
  constructor(protected sidenavService: SidenavService,
              protected menuService: MenuService,
              protected router: Router,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected commonService: CommonService,
              protected translate: TranslateService) {}

  ngOnInit(): void {
    this.initMenuObject();
  }

  ngAfterViewInit() {
    this.sidenavService.setSidenav(this.sidenav);
  }

  onMenuClick(menu, menuIndex) {
    if (menu.url) {
      this.router.navigateByUrl(menu.url);
    }
    this.selectedMenu = menu;
    if (menu.subMenus) {
      this.subMenu = menu.subMenus;
      this.sidenavService.open(menuIndex);
    } else {
      this.sidenavService.close();
    }
  }

  initMenuObject() {
    this.menuService
      .getMenu(this.fccGlobalConstantService.getMenuPath())
      .subscribe(resp => {
        if (resp.response === 'REST_API_SUCCESS') {
          this.bankMenuJSON = resp.menus;
          this.selectedMenu = this.bankMenuJSON[0];
        } else {
          this.commonService.clearCachedResponses();
        }
      });
  }

  onSubmenuClick(menu) {
    const isAngularUrl = menu && menu.subMenuUrl.indexOf('#') > -1;
    if (isAngularUrl) {
      const url = menu.subMenuUrl.split('#')[1];
      window.scroll(0, 0);
      this.router.navigateByUrl(url);
    } else {
      const urlContext = this.commonService.getContextPath();
      const dojoUrl = urlContext + this.fccGlobalConstantService.servletName + menu.subMenuUrl;
      this.router.navigate([]).then(() => {
        window.open(dojoUrl, FccGlobalConstant.SELF);
      });
    }
    this.sidenavService.close();
  }

  @HostListener('click')
  clickInsideNav() {
    this.SideNavClicked = true;
  }

  @HostListener('document:click')
  clickOutsideNav() {
    if (!this.SideNavClicked) {
      this.sidenav.close();
    }
    this.SideNavClicked = false;
  }
}
