import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GraphColorService {

  constructor() { 
    //eslint : no-empty-function
  }
  /**
   * Below color list is for available-amount-import and export,Bills Outstanding widget
   */
  firstSetColorArray = ['#694ED6', '#56C271', '#C137A2', '#5BC1D7', '#F0B323'];
  secondSetColorArray = ['#694ED6', '#56C271', '#C137A2', '#5BC1D7', '#F0B323'];

  /**
   * Below color list is for bank-approval-and- rejection widget
   */
  colorsList: any[] = [
  'rgba(210,102,187,1)',
  'rgba(85,193,217,1)',
  'rgba(125,211,146,1)',
  'rgba(252,236,197,1)',
  'rgba(243,198,90,1)',
  'rgba(63,134,150,1)',
  'rgba(112,112,112,1)',
  'rgba(193,55,162,1)',
  'rgba(168,125,24,1)',
  'rgba(147,150,59,1)',
  'rgba(128,209,148,1)',
  'rgba(128,178,209,1)',
  'rgba(180,166,234,1)',
  'rgba(223,154,208,1)',
  'rgba(105,78,214,1)',
  'rgba(206,206,206,1)'
   ];

  borderColorsList: any[] = [
   'rgba(210,215,85,0)',
   'rgba(132,208,225,0)',
   'rgba(234,63,116,0)',
   'rgba(255,167,109,0)',
   'rgba(243,198,90,0)',
   'rgba(63,134,150,0)',
   'rgba(112,112,112,0)',
   'rgba(193,55,162,0)',
   'rgba(168,125,24,0)',
   'rgba(147,150,59,0)',
   'rgba(128,209,148,0)',
   'rgba(128,178,209,0)',
   'rgba(180,166,234,0)',
   'rgba(223,154,208,0)',
   'rgba(105,78,214,0)',
   'rgba(206,206,206,0)'
   ];
}
