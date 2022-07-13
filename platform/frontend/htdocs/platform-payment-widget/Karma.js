class Karma {
    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    widget(id, type, details) {
        if (type === undefined) {
            throw new Error(`Invalid companyId`);
        }

        let container = this.createContainerIfNeed(details);
        if (!container) {
            throw new Error(`Unable to find container`);
        }

        if (details.isWaitCallback === undefined) {
            details.isWaitCallback = true;
        }

        let iframe = document.createElement('iframe');
        iframe.setAttribute('style', 'height:100%;width:100%;');
        container.appendChild(iframe);

        return new Promise((resolve, reject) => {
            iframe.onload = () => resolve();
            iframe.onerror = event => reject(event.toString());
            iframe.oninvalid = event => reject(event.toString());
            // let url = `https://payment-widget-dev.project-karma.com`;
            let url = `http://localhost:4200`;
            url += `?id=${id}&type=${type}`;
            if (details) {
                url += `&details=${JSON.stringify(details)}`;
            }
            iframe.src = url;
        });
    }

    // --------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    // --------------------------------------------------------------------------

    createContainerIfNeed(details) {
        let onFail = details.onFail;
        let onSuccess = details.onSuccess;
        
        delete details.onFail;
        delete details.onSuccess;

        let messageHandler = event => {
            // if (event.origin !== "http://example.com") return;
            let data = event.data;
            switch (data.function) {
                case 'failedHandler':
                    if (onFail) {
                        onFail(data.message);
                    }
                    if (!details.containerId) {
                        closeHandler();
                    }
                    break;
                case 'completedHandler':
                    if (onSuccess) {
                        onSuccess(data.message);
                    }
                    if (!details.containerId && !details.isWaitCallback) {
                        closeHandler();
                    }
                    break;
            }
        };
        window.addEventListener('message', messageHandler, false);

        let containerId = details.containerId;
        if ((containerId, document.getElementById(containerId))) {
            return document.getElementById(containerId);
        }

        let closeHandler = () => {
            backdrop.removeEventListener('click', closeHandler);
            document.body.removeChild(backdrop);
        };

        let backdrop = document.createElement('div');
        backdrop.setAttribute(
            'style',
            'background-color:rgba(0,0,0,0.5);position:fixed;top:0;bottom:0;left:0;right:0;display:flex;align-items:center;justify-content:center;'
        );
        backdrop.addEventListener('click', closeHandler);
        document.body.appendChild(backdrop);

        let container = document.createElement('div');
        container.setAttribute('style', `width:454px;height:576px;`);
        container.addEventListener('click', event => event.stopPropagation());
        backdrop.appendChild(container);
        return container;
    }

    runInitCallbacks() {
        let karmaApiInitCallbacks = window.karmaApiInitCallbacks;
        if (karmaApiInitCallbacks && karmaApiInitCallbacks.length) {
            setTimeout(function () {
                let callback;
                while ((callback = karmaApiInitCallbacks.shift())) {
                    try {
                        callback();
                    } catch (e) {
                        console.error(e);
                    }
                }
            }, 0);
        }
    }
}

if (typeof window['Karma'] === 'undefined') {
    window.Karma = new Karma();
    window.Karma.runInitCallbacks();
}
