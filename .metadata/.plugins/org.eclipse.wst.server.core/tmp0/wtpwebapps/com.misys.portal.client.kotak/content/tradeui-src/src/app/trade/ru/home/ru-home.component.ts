import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit} from '@angular/core';



@Component({
  selector: 'fcc-ru-home',
  templateUrl: './ru-home.component.html'
})
export class RUHomeComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.navigate();
  }

  navigate() {
    let mode;
    let tnxType;
    let refId;
    let tnxId;
    let option;
    let subTnxType;
    let templateid;
    let operation;
    let subproductcode;
    let prodStatCode;
    let tnxStatCode;
    let productcode;
    this.activatedRoute.queryParams.subscribe(params => {
      mode = params.mode;
      tnxType = params.tnxtype;
      refId = params.referenceid;
      tnxId = params.tnxid;
      option = params.option;
      subTnxType = params.subtnxtype;
      templateid = params.templateid;
      operation = params.operation;
      subproductcode = params.subproductcode;
      prodStatCode = params.prodStatCode;
      tnxStatCode = params.tnxStatCode;
      productcode = params.productcode;
    });
  }
}
