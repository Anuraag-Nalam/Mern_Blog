class MerkleTree {
    constructor() {
        this.leaves = [];
        this.tree = [];
    }

    addLeaf(hash) {
        this.leaves.push(hash);
        this.buildTree();
    }

    buildTree() {
        this.tree = [this.leaves];
        let currentLevel = this.leaves;

        while (currentLevel.length > 1) {
            const nextLevel = [];

            for (let i = 0; i < currentLevel.length; i += 2) {
                const left = currentLevel[i];
                const right = currentLevel[i + 1] || left; // Handle odd number of nodes
                const parentHash = this.hashNodes(left, right);
                nextLevel.push(parentHash);
            }

            this.tree.push(nextLevel);
            currentLevel = nextLevel;
        }
    }

    hashNodes(left, right) {
        return crypto.createHash('sha256').update(left + right).digest('hex');
    }

    getRootHash() {
        if (this.tree.length === 0) return null;
        return this.tree[this.tree.length - 1][0];
    }

    findLeaf(hash) {
        return this.leaves.includes(hash);
    }
}
