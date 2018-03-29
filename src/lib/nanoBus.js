define([], function () {
    class NanoBus {
        constructor() {
            this.queue = [];
            this.runInterval = 0;
            this.messageReceivers = {};
        }

        processQueue() {
            let processing = this.queue;
            this.queue = [];
            processing.forEach((message) => {
                var receivers = this.messageReceivers[message.id];
                if (!receivers) {
                    return;
                }
                receivers.forEach((receiver) => {
                    try {
                        receiver(message.payload);
                    } catch (ex) {
                        console.error('Error processing message: ' + ex.message, ex);
                    }
                });
            });
        }

        run() {
            if (this.queue.length === 0) {
                return;
            }
            // TODO: convert to use animation frames...
            window.setTimeout(() => {
                this.processQueue();
                // just in case any new messages crept in.
                // if (this.queue.length > 0) {
                //     this.run();
                // }
            }, this.runInterval);
        }

        send(id, payload) {
            this.queue.push({
                id: id,
                payload: payload
            });
            this.run();
        }

        on(id, handler) {
            if (!this.messageReceivers[id]) {
                this.messageReceivers[id] = [];
            }
            this.messageReceivers[id].push(handler);
        }

    }

    return NanoBus;
});
