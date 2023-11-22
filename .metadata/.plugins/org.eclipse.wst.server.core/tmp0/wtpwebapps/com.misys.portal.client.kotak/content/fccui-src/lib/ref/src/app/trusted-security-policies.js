import DOMPurify from 'dompurify';
if (navigator.userAgent.indexOf('Chrome') !== -1 ||
(navigator.userAgent.indexOf('Edg') !== -1 || navigator.userAgent.indexOf('Edge') !== -1)) {

 window.trustedTypes.createPolicy('default', {
        createHTML: (string) => {
            if(window.location.href.includes('/screen/')){
                return string;
            }
            else{
                let congig= {
                    ADD_ATTR :['src','alt'],
                    ALLOWED_TAGS: ['#text','body','img','remove','strong','span','a','table','td','tr','tbody','thead','tfoot','th','li','ul','ol','br','p'], 
                    ALLOWED_ATTR: ['href,src,alt,title,style,rows,rowspan,width,height,rel,align,cite,cols,colspan,target'],
                    KEEP_CONTENT: true
            }
                return DOMPurify.sanitize(string, congig );
            }
        },
        createScriptURL: (string) => {return string; },
        createScript: (string) => {return string },
    });
}
