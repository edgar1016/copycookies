(async function() {
    let [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});

    const tabUrl = tab.url;

    // Promise to retrieve cookies with partition key
    const cookiesWithPartitionKeyPromise = new Promise((resolve, reject) => {
        chrome.cookies.getAll({ 
            url: tabUrl, 
            partitionKey: { 
                topLevelSite: new URL(tabUrl).origin 
            } 
        }, cookies => {
            resolve(cookies);
        });
    });

    // Promise to retrieve cookies without partition key
    const cookiesWithoutPartitionKeyPromise = new Promise((resolve, reject) => {
        chrome.cookies.getAll({ 
            url: tabUrl 
        }, cookies => {
            resolve(cookies);
        });
    });

    // Wait for both promises to resolve
    const [cookiesWithPartitionKey, cookiesWithoutPartitionKey] = await Promise.all([
        cookiesWithPartitionKeyPromise,
        cookiesWithoutPartitionKeyPromise
    ]);

    // Combine cookies from both arrays
    const allCookies = [...cookiesWithPartitionKey, ...cookiesWithoutPartitionKey];

    chrome.runtime.getPlatformInfo(platformInfo => {
        var area = document.createElement('textarea');
        area.style.position = 'absolute';
        area.style.border = '0';
        area.style.padding = '0';
        area.style.margin = '0';
        area.style.height = '1px';
        area.style.top = '-10px';

        const data = {
            cookies: allCookies,
            userAgent: navigator.userAgent
        };

        area.innerText = JSON.stringify(data);

        document.body.appendChild(area, document.body.firstChild);
        area.focus();
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
    });
})();
