(async function() {
    let [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    
    chrome.cookies.getAll({"url":tab.url}, cookies => {
        chrome.runtime.getPlatformInfo(platformInfo => {
            var area = document.createElement('textarea');
            area.style.position = 'absolute';
            area.style.border = '0';
            area.style.padding = '0';
            area.style.margin = '0';
            area.style.height = '1px';
            area.style.top = '-10px';
            
            const data = {
                cookies: cookies,
                userAgent: navigator.userAgent
            };
            
            area.innerText = JSON.stringify(data);
            
            document.body.appendChild(area, document.body.firstChild);
            area.focus();
            area.select();
            document.execCommand("copy");
            document.body.removeChild(area);
        });
    });
})();
