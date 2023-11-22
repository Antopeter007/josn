import { CommonService } from './../../services/common.service';
import { CollaborationUsersService } from './../../services/collaborationUsers.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user.model';
import { DynamicDialogRef } from 'primeng';

@Component({
  selector: 'fcc-common-collaboration-users-dialog',
  templateUrl: './collaboration-users.dialog.component.html',
  styleUrls: ['./collaboration-users.dialog.component.scss']
})
export class CollaborationUsersDialogComponent implements OnInit {

  listOfUsers: User[] = [];
  filteredListOfUsers: User[] = [];
  firstName: string;
  lastName: string;
  loginId: string;

  constructor(protected collaborationUsersService: CollaborationUsersService, public commonService: CommonService,
              public ref: DynamicDialogRef) { }

  ngOnInit(): void {
    this.getUsers();
  }

  public getFilteredListOfUsers(): void {
    this.filteredListOfUsers = this.listOfUsers.filter(d => (!this.firstName && !this.lastName && !this.loginId) ||
                                        (this.firstName === d.FIRSTNAME && !this.lastName && !this.loginId) ||
                                        (!this.firstName && this.lastName === d.LASTNAME && !this.loginId) ||
                                        (!this.firstName && !this.lastName && this.loginId === d.LOGINID) ||
                                        (this.firstName === d.FIRSTNAME && this.lastName === d.LASTNAME && !this.loginId) ||
                                        (this.firstName === d.FIRSTNAME && !this.lastName && this.loginId === d.LOGINID) ||
                                        (!this.firstName && this.lastName === d.LASTNAME && this.loginId === d.LOGINID) ||
                                        (this.firstName === d.FIRSTNAME && this.lastName === d.LASTNAME
                                        && this.loginId === d.LOGINID));
  }

  public getUsers(): void {
    this.collaborationUsersService.getUsers('user_collaboration').subscribe(data => {
      this.listOfUsers = data.items;
      this.filteredListOfUsers = this.listOfUsers;
    });
   }

}
