export class Lock {

    private readonly queue: (() => void)[] = [];
    private acquired = false;

    public async acquire(): Promise<void> {
        if (!this.acquired) {
            this.acquired = true;
            return new Promise<void>(res => res());
        } else {
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
            this.acquired = false;
            return;
        }

        continuation();
    }
}