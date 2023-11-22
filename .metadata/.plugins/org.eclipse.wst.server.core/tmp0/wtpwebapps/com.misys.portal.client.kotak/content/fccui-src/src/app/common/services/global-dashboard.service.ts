import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class GlobalDashboardServcie {

    constructor() {
        //eslint : no-empty-function
    }

    getLayoutControls(layoutData) {
        const attributeName = Object.keys(layoutData.firstLayout);
        const layoutName = layoutData.layoutOfType;
        let style = {};
        let domNodes = {};
        let colWidth = {};
        let navigation = {};
        attributeName.forEach((attribute) => {
            switch (attribute) {
                case 'styles':
                    style = this.getStyles(layoutData.firstLayout[attribute]);
                    break;
                case 'domNodes':
                    domNodes = this.getDomNodes(layoutData.firstLayout[attribute]);
                    break;
                case 'child':
                    colWidth = this.getColWidth(layoutData.firstLayout[attribute]);
                    break;
                case 'navigation':
                    navigation = layoutData.firstLayout[attribute];
                    break;
                default:
                    break;
            }
        });
        return new DashboardControl({ ...style, ...domNodes, colWidth, navigation, layoutName });
    }

    private getStyles(style) {
        const layoutStyles = {};
        layoutStyles[`layoutClass`] = style.layoutClass || '';
        layoutStyles[`hideBodyScroll`] = style.hideBodyScroll || false;
        layoutStyles[`widgetClass`] = style.widgetClass || '';
        layoutStyles[`addWidgetIcon`] = style.addWidgetIcon || '';
        layoutStyles[`overlayClass`] = style.overlayClass || '';
        layoutStyles[`addWidgetClass`] = style.addWidgetClass || '';
        layoutStyles[`addWidgetChildClass`] = style.addWidgetChildClass || '';
        layoutStyles[`widgetCardClass`] = style.widgetCardClass || '';
        layoutStyles[`widgetChildCardClass`] = style.widgetChildCardClass || '';
        layoutStyles[`cardIcon`] = style.cardIcon || '';
        layoutStyles[`checkIcon`] = style.checkIcon || '';
        layoutStyles[`panelBGColor`] = style.panelBGColor || '';
        layoutStyles[`gridClass`] = style.gridClass || '';
        layoutStyles[`actionClass`] = style.actionClass || '';
        layoutStyles[`centerPanelStyle`] = style.centerPanelStyle || '';
        layoutStyles[`leftPanelStyle`] = style.leftPanelStyle || '';
        layoutStyles[`rigthPanelStyle`] = style.rigthPanelStyle || '';
        layoutStyles[`dynamicClass`] = style.dynamicClass || '';

        return layoutStyles;
    }

    private getDomNodes(domNodes) {
        const layoutNodes = {};
        layoutNodes[`displaySideNav`] = domNodes.displaySideNav || '';
        layoutNodes[`customizeOptionCenter`] = domNodes.customizeOptionCenter || '';
        return layoutNodes;
    }

    private getColWidth(colLayout) {
        const dashboardLayout = [];
        colLayout.forEach((element) => {
            const paramObj = { width : `p-col-${element.width}`, smallDevice : `p-sm-${element.smallDevice}`,
                            mediumDevice : `p-md-${element.mediumDevice}`,
                            largeDevice : `p-lg-${element.largeDevice}`, xtraLargeDevice : `p-xl-${element.xtraLargeDevice}`,
                            cdkClass: element.cdkClass, alwaysVisible: element.alwaysVisible };
            dashboardLayout.push(paramObj);
          });
        return dashboardLayout;
    }

}

// eslint-disable-next-line max-classes-per-file
class DashboardControl {
    params = {};
    constructor( params: any = {}) {
        this.params = params;
    }
}

