
export class Lock {

    private readonly queue: (()=>void)[] = [];
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

    public async release(): Promise<void> {
        if (this.queue.length === 0 && this.acquired) {
            this.acquired = false;
            return;
        }

        const continuation = this.queue.shift();
        return new Promise((res: ()=>void) => {
            continuation!();
            res();
        });
    }
}