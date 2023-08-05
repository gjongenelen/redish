export class Lock {

    private readonly queue: (() => void)[] = [];
    private acquired = false;

    public async acquire(): Promise<void> {
        console.warn(`acquire() called`)
        if (!this.acquired) {
            console.warn(`lock set to true`)
            this.acquired = true;
            return new Promise<void>(res => res());
        } else {
            console.warn(`lock already true, queueing`)
            return new Promise<void>((resolve, _) => {
                this.queue.push(resolve);
            });
        }
    }

    public release() {
        if (!this.acquired) {
            console.error("Lock is not acquired")
            return;
        }

        const continuation = this.queue.shift();
        if (!continuation) {
            console.warn(`lock set to false, exiting`)
            this.acquired = false;
            return;
        }
        console.warn("continuing queue")

        continuation();
    }
}