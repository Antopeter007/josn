export const layoutGridObj = [
    {
       layoutOfType : 'layout1',
       firstLayout: {
             width: '12',
             height: '',
             division: '',
             child: [
                {
                    width: '3',
                    height: '',
                    smallDevice : '12',
                    mediumDevice: '3',
                    largeDevice: '3',
                    xtraLargeDevice: '3',
                    division: 'vertical',
                    child : []
                },
                {
                    width: '9',
                    height: '',
                    smallDevice : '12',
                    mediumDevice: '12',
                    largeDevice: '9',
                    xtraLargeDevice: '9',
                    division: 'vertical',
                    child: [
                      {
                          width: '12',
                          height: '3',
                          division: 'horizontal',
                          smallDevice : '12',
                          mediumDevice: '4',
                          largeDevice: '4',
                          xtraLargeDevice: '4',
                      },
                      {
                          width: '12',
                          height: '9',
                          division: 'horizontal',
                          smallDevice : '12',
                          mediumDevice: '12',
                          largeDevice: '12',
                          xtraLargeDevice: '12 ',
                      }
                   ]
                }
             ]
          }
    },
      {
        layoutOfType : 'layout2',
         firstLayout: {
                 width: '12',
                 height: '',
                 division: '',
                 child: [
                    {
                        width: '9',
                        height: '',
                        smallDevice : '12',
                        mediumDevice: '3',
                        largeDevice: '3',
                        xtraLargeDevice: '3',
                        division: 'vertical',
                        child: [
                            {
                                width: '12',
                                height: '3',
                                division: 'horizontal',
                                smallDevice : '12',
                                mediumDevice: '4',
                                largeDevice: '4',
                                xtraLargeDevice: '4',
                            },
                            {
                                width: '12',
                                height: '9',
                                division: 'horizontal',
                                smallDevice : '12',
                                mediumDevice: '12',
                                largeDevice: '12',
                                xtraLargeDevice: '12 ',
                            }
                         ]
                    },
                    {
                        width: '3',
                        height: '',
                        smallDevice : '12',
                        mediumDevice: '12',
                        largeDevice: '9',
                        xtraLargeDevice: '9',
                        division: 'vertical',
                        child: []
                    }
                 ]
              }
        },

       {
        layoutOfType : 'layout3',
        firstLayout: {
              width: 'p-col-10 p-offset-1',
              height: '',
              division: '',
              child: [
                  {
                        width: '12',
                        height: '',
                        smallDevice : '12',
                        mediumDevice: '12',
                        largeDevice: '9',
                        xtraLargeDevice: '9',
                        division: 'vertical',
                        child: []
                  },
                  {
                        width: '12',
                        height: '',
                        smallDevice : '12',
                        mediumDevice: '12',
                        largeDevice: '9',
                        xtraLargeDevice: '9',
                        division: 'vertical',
                        child: []
                    },
                  {
                          width: '12',
                          height: '',
                          smallDevice : '12',
                          mediumDevice: '12',
                          largeDevice: '9',
                          xtraLargeDevice: '9',
                          division: 'vertical',
                          child: []
                   }
              ]
           }
        },

       {
        layoutOfType : 'layout4',
        firstLayout: {
              width: '12',
              height: '',
              division: '',
              child: [
                  {
                        width: '2',
                        height: '',
                        smallDevice : '1',
                        mediumDevice: '1',
                        largeDevice: '2',
                        xtraLargeDevice: '2',
                        division: 'vertical',
                        child: []
                  },
                  {
                        width: '7',
                        height: '',
                        smallDevice : '11',
                        mediumDevice: '11',
                        largeDevice: '7',
                        xtraLargeDevice: '7',
                        division: 'vertical',
                        child: []
                    },
                    {
                          width: '3',
                          height: '',
                          smallDevice : '3',
                          mediumDevice: '3',
                          largeDevice: '3',
                          xtraLargeDevice: '3',
                          division: 'vertical',
                          child: []
                    }
              ]
           }
        },
       {
        layoutOfType : 'layout5',
        firstLayout: {
              width: 'p-col-10 p-offset-1',
              height: '',
              division: '',
              child: [
                  {
                        width: '12',
                        height: '',
                        smallDevice : '12',
                        mediumDevice: '9',
                        largeDevice: '9',
                        xtraLargeDevice: '9',
                        division: 'vertical',
                        child: []
                  },
                  {
                          width: '12',
                          height: '',
                          smallDevice : '12',
                          mediumDevice: '9',
                          largeDevice: '9',
                          xtraLargeDevice: '9',
                          division: 'vertical',
                          child: []
                   }
              ]
           }
        }

  ];

export const firstChild = ['fc_width', 'fc_height', 'fc_division', 'fc_smallDevice', 'fc_mediumDevice' ,
'fc_largeDevice', 'fc_xtraLargeDevice'];
export const secondChild = ['sc_width', 'sc_height', 'sc_division', 'sc_smallDevice', 'sc_mediumDevice' ,
'sc_largeDevice', 'sc_xtraLargeDevice'];
export const childProp = ['width', 'height', 'division', 'smallDevice', 'mediumDevice', 'largeDevice', 'xtraLargeDevice'];