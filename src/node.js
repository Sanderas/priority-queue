class Node {
    constructor(data, priority) {
        this.data = data;
        this.priority = priority;
        this.left = null;
        this.right = null;
        this.parent = null;
    }

    appendChild(node) {
        if (!this.left && !this.right) {
            this.left = node;
            node.parent = this;
        }
        else if (this.left && !this.right) {
            if (node.priority != this.left.priority || node.data != this.left.data) {
                this.right = node;
                node.parent = this;
            }
        }
    }

    removeChild(node) {
        if (node.priority === this.left.priority && node.data === this.left.data) {
            this.left = null;
            node.parent = null;
        }
        else if (node.priority === this.right.priority && node.data === this.right.data) {
            this.right = null;
            node.parent = null;
        }
        else {
            throw new Error();
        }
    }

    remove() {
    	if (this.parent) {
    		this.parent.removeChild(this);
		}
    }

    swapWithParent() {
    	if (this.parent) {
            let childLeft = this.left,
                childRight = this.right,
                childParent = this.parent,
                parentLeft = this.parent.left,
                parentRight = this.parent.right,
                parentParent = this.parent.parent;

            if (this.parent.left && this.parent.right) {
                if (this.priority === this.parent.left.priority) {
                    this.swapNodeWithLeft(childLeft, childRight, childParent, parentLeft, parentRight, parentParent);
                }
                else if (this.priority === this.parent.right.priority) {
                    this.swapNodeWithRight(childLeft, childRight, childParent, parentLeft, parentRight, parentParent);
                }
            }
            else if (this.parent.left && !this.parent.right) {
                if (this.priority === this.parent.left.priority) {
                    this.swapNodeWithLeft(childLeft, childRight, childParent, parentLeft, parentRight, parentParent);
                }
            }
            else if (!this.parent.left && this.parent.right) {
                if (this.priority === this.parent.right.priority) {
                    this.swapNodeWithRight(childLeft, childRight, childParent, parentLeft, parentRight, parentParent);
                }
            }

        }
    }

    swapNodeWithLeft(childLeft, childRight, childParent, parentLeft, parentRight, parentParent) {
        this.parent = parentParent;
        if (this.parent) {
            this.switchParentChild(childParent);
        }
        this.left = childParent;
        this.right = parentRight;
        this.left.parent = this;
        if (this.right) {
            this.right.parent = this;
        }
        this.left.left = childLeft;
        if (this.left.left) {
            this.left.left.parent = this.left;
        }
        this.left.right = childRight;
        if (this.left.right) {
            this.left.right.parent = this.left;
        }
    }

    swapNodeWithRight(childLeft, childRight, childParent, parentLeft, parentRight, parentParent) {
        this.parent = parentParent;
        if (this.parent) {
            this.switchParentChild(childParent);
        }
        this.left = parentLeft;
        this.right = childParent;
        this.right.parent = this;
        if (this.left) {
            this.left.parent = this;
        }
        this.right.left = childLeft;
        if (this.right.left) {
            this.right.left.parent = this.right;
        }
        this.right.right = childRight;
        if (this.right.right) {
            this.right.right.parent = this.right;
        }
    }

    switchParentChild(childParent) {
        if (this.parent.left.priority === childParent.priority) {
            this.parent.left = this;
        }
        else {
            this.parent.right = this;
        }
	}
}

module.exports = Node;
