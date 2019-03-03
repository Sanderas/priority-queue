const Node = require('./node');

class MaxHeap {
	constructor() {
		this.root = null;
		this.parentNodes = [];
		this.arrayOfHeap = [];
		this.lastInsertedNode = null;
		this.parentOfLastInsertedNode = null;
		this.positionOfLastInsertedNode = null;
		this.length = 0;
		this.isLastCallOfShiftNodeUp = false;
		this.isLastCallOfShiftNodeDown = false;
		this.arrayOfOrderInsertedNodes = [];
	}

	push(data, priority) {
		let node = new Node(data, priority);
		this.insertNode(node);
		this.shiftNodeUp(node);
		this.arrayOfOrderInsertedNodes.push(node);
		if (this.parentOfLastInsertedNode) {
            if (this.parentOfLastInsertedNode.left.data === this.lastInsertedNode.data) {
                this.positionOfLastInsertedNode = 'left';
            }
            else {
                this.positionOfLastInsertedNode = 'right';
            }
        }
	}

	pop() {
		//there are a lot of tests. Let write this last turn
		if (this.root) {
			let detached = this.detachRoot();
			this.restoreRootFromLastInsertedNode(detached);
			this.shiftNodeDown(this.root);
			this.length -= 1;
			return detached.data;
		}
	}

	detachRoot() {
		if (this.root) {
			let detachedRoot = this.root;
			this.root = null;
			this.parentNodes.splice(0, 1);
			return detachedRoot;
		}
	}

    restoreRootFromLastInsertedNode(detached) {

        if (this.length > 1) {
            while (!this.parentOfLastInsertedNode) {
                //we need to change last inserted node and position of last inserted node
                this.arrayOfOrderInsertedNodes.splice(this.arrayOfOrderInsertedNodes.length - 1, 1);
                this.lastInsertedNode = this.arrayOfOrderInsertedNodes[this.arrayOfOrderInsertedNodes.length - 1];
                this.parentOfLastInsertedNode = this.arrayOfOrderInsertedNodes[this.arrayOfOrderInsertedNodes.length - 1].parent;
                if (this.parentOfLastInsertedNode) {
                    if (this.parentOfLastInsertedNode.left.data === this.lastInsertedNode.data) {
                        this.positionOfLastInsertedNode = 'left';
                    }
                    else {
                        this.positionOfLastInsertedNode = 'right';
                    }
                }
            }


            this.parentOfLastInsertedNode[this.positionOfLastInsertedNode] = null;
            this.root = this.lastInsertedNode;
            this.root.left = detached.left;
            if (this.root.left) {
                this.root.left.parent = this.root;
            }
            this.root.right = detached.right;
            if (this.root.right) {
                this.root.right.parent = this.root;
            }
            this.root.parent = null;
            this.parentNodes = [];
            this.setParentNodes();

            this.arrayOfOrderInsertedNodes.splice(this.arrayOfOrderInsertedNodes.length - 1, 1);

            if (this.arrayOfOrderInsertedNodes.length > 0) {
                this.lastInsertedNode = this.arrayOfOrderInsertedNodes[this.arrayOfOrderInsertedNodes.length - 1];
                this.parentOfLastInsertedNode = this.arrayOfOrderInsertedNodes[this.arrayOfOrderInsertedNodes.length - 1].parent;

                if (this.parentOfLastInsertedNode) {
                    if (this.parentOfLastInsertedNode.left) {
                        if (this.parentOfLastInsertedNode.left.data === this.lastInsertedNode.data) {
                            this.positionOfLastInsertedNode = 'left';
                        }
                    }
                    else {
                        this.positionOfLastInsertedNode = 'right';
                    }
                }
                else {
                    this.positionOfLastInsertedNode = 'center';
                }
            }
        }
    }

    size() {
        return this.length;
    }

    isEmpty() {
        return this.length ? false : true;
    }

	clear() {
		this.root = null;
		this.parentNodes = [];
		this.length = 0;
	}

	insertNode(node) {
		if (!this.root) {
			this.root = node;
			this.lastInsertedNode = this.root;
            this.positionOfLastInsertedNode = 'root';
		}
		else {
            let pointer = this.root,
				property = 'left';

            function searchNullElem(arr, node, self) {
				let newArr = [],
					isNullElemFound = false;
				for (let i = 0; i < arr.length; i++) {
					if (!arr[i]['left']) {
						arr[i]['left'] = node;
						node.parent = arr[i];
						self.lastInsertedNode = node;
                        self.parentOfLastInsertedNode = node.parent;
                        isNullElemFound = true;
						break;
					}
					else if (!arr[i]['right']) {
						arr[i]['right'] = node;
						node.parent = arr[i];
                        self.lastInsertedNode = node;
                        self.parentOfLastInsertedNode = node.parent;
                        isNullElemFound = true;
						break;
					}
					else {
                        newArr.push(arr[i]['left']);
                        newArr.push(arr[i]['right']);
					}
				}
				if (!isNullElemFound) {
                    searchNullElem(newArr, node, self);
				}
            }

            searchNullElem([pointer], node, this);
		}
		this.length += 1;
		this.parentNodes = [];
        this.setParentNodes();
	}

	shiftNodeUp(node) {
		if (node.parent) {
            if (node.parent.priority < node.priority) {
                node.swapWithParent();
                this.parentOfLastInsertedNode = node.parent;
            }
            else {
            	this.isLastCallOfShiftNodeUp = true;
			}
        }
		else {
			this.root = node;
            this.isLastCallOfShiftNodeUp = true;
        }
        if (this.isLastCallOfShiftNodeUp) {
            this.isLastCallOfShiftNodeUp = false;
            this.parentNodes = [];
            this.setParentNodes();
		}
		else {
            this.shiftNodeUp(node);
		}
	}

	shiftNodeDown(node) {
		if (node) {
            if (node.left && node.right) {
                if (node.left.priority > node.right.priority && node.priority < node.left.priority) {
                    this.swapNodeWithLeftChild(node);
                }
                else if (node.left.priority < node.right.priority && node.priority < node.right.priority) {
                    this.swapNodeWithRightChild(node);
                }
                else {
                    this.parentNodes = [];
                    this.setParentNodes();
                    return;
                }
            }
            else if (node.left && !node.right) {
                if (node.priority < node.left.priority) {
                    this.swapNodeWithLeftChild(node);
                }
                else {
                    this.parentNodes = [];
                    this.setParentNodes();
                    return;
                }
            }
            else if (!node.left && node.right) {
                if (node.priority < node.right.priority) {
                    this.swapNodeWithRightChild(node);
                }
                else {
                    this.parentNodes = [];
                    this.setParentNodes();
                    return;
                }
            }
            else {
                this.parentNodes = [];
                this.setParentNodes();
                return;
            }

            this.shiftNodeDown(node);
        }
	}

	swapNodeWithLeftChild(node) {
        let isRoot = false;
        if (node.data === this.root.data) {
            isRoot = true;
        }
        node.left.swapWithParent();
        if (isRoot) {
            this.root = node.parent;
        }
	}

    swapNodeWithRightChild(node) {
        let isRoot = false;
        if (node.data === this.root.data) {
            isRoot = true;
        }
        node.right.swapWithParent();
        if (isRoot) {
            this.root = node.parent;
        }
    }

	setParentNodes() {

        function levelStride(arr, heap) {
            let newArr = [];
            for (let i = 0; i < arr.length; i++) {
                if (!arr[i]['left'] || !arr[i]['right']) {
                    heap.parentNodes.push(arr[i]);
                }
                if (arr[i]['left']) {
                    newArr.push(arr[i]['left']);
                }
                if (arr[i]['right']) {
                    newArr.push(arr[i]['right']);
                }
            }
            if (newArr.length) {
                levelStride(newArr, heap);
            }
        }

        levelStride([this.root], this);
	}


}

module.exports = MaxHeap;
