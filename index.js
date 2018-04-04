/**
 * @fileOverview Implementation of a doubly linked-list data structure
 */

const isEqual = require('lodash.isequal');
const _ = require('lodash');
const Node = require('./node');
const Iterator = require('./iterator');

/**************************************************
 * Doubly linked list class
 *
 * Implementation of a doubly linked list data structure.  This
 * implementation provides the general functionality of adding nodes to
 * the front or back of the list, as well as removing node from the front
 * or back.  This functionality enables this implemention to be the
 * underlying data structure for the more specific stack or queue data
 * structure.
 *
 ***************************************************/

/**
 * Creates a LinkedList instance.  Each instance has a head node, a tail
 * node and a size, which represents the number of nodes in the list.
 *
 * @constructor
 */
class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;

        // add iterator as a property of this list to share the same
        // iterator instance with all other methods that may require
        // its use.  Note: be sure to call this.iterator.reset() to
        // reset this iterator to point the head of the list.
        this.iterator = new Iterator(this);
    }

    /* Functions attached to the Linked-list prototype.  All linked-list
     * instances will share these methods, meaning there will NOT be copies
     * made for each instance.  This will be a huge memory savings since there
     * may be several different linked lists.
     */
    /**
     * Creates a new Node object with 'data' assigned to the node's data
     * property
     *
     * @param {object|string|number} data The data to initialize with the
     *                                    node
     * @returns {object} Node object intialized with 'data'
     */
    createNewNode(data) {
        return new Node(data);
    }

    /**
     * Returns the first node in the list, commonly referred to as the
     * 'head' node
     *
     * @returns {object} the head node of the list
     */
    getHeadNode() {
        return this.head;
    }

    /**
     * Returns the last node in the list, commonly referred to as the
     * 'tail'node
     *
     * @returns {object} the tail node of the list
     */
    getTailNode() {
        return this.tail;
    }

    /**
     * Determines if the list is empty
     *
     * @returns {boolean} true if the list is empty, false otherwise
     */
    isEmpty() {
        return (this.length === 0);
    }

    /**
     * Returns the size of the list, or number of nodes
     *
     * @returns {number} the number of nodes in the list
     */
    size() {
        return this.length;
    }

    /**
     * Clears the list of all nodes/data
     */
    clear() {
        while (!this.isEmpty()) {
            this.popBack();
        }
    }

    //################## INSERT methods ####################

    /**
     * Inserts a node with the provided data to the end of the list
     *
     * @param {object|string|number} data The data to initialize with the
     *                                    node
     * @returns {boolean} true if insert operation was successful
     */
    pushBack(data) {
        const newNode = this.createNewNode(data);
        if (this.isEmpty()) {
            this.head = this.tail = newNode;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
        this.length += 1;

        return true;
    }

    /**
     * Inserts a node with the provided data to the front of the list
     *
     * @param {object|string|number} data The data to initialize with the
     *                                    node
     * @returns {boolean} true if pushBack operation was successful
     */
    pushFront(data) {
        if (this.isEmpty()) {
            this.pushBack(data);
        } else {
            const newNode = this.createNewNode(data);

            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode;

            this.length += 1;
        }

        return true;
    }

    /**
     * Inserts a node with the provided data at the index indicated.
     *
     * @param {number} index The index in the list to insert the new node
     * @param {object|string|number} data The data to initialize with the node
     */
    insert(index, data) {
        let current = this.getHeadNode();
        const newNode = this.createNewNode(data);
        let position = 0;

        // check for index out-of-bounds
        if (index < 0 || index > this.size() - 1) {
            return false;
        }

        // if index is 0, we just need to insert the first node
        if (index === 0) {
            this.pushFront(data);
            return true;
        }

        while (position < index) {
            current = current.next;
            position += 1;
        }

        current.prev.next = newNode;
        newNode.prev = current.prev;
        current.prev = newNode;
        newNode.next = current;

        this.length += 1;

        return true;
    }

    //################## REMOVE methods ####################

    /**
     * Removes the tail node from the list
     *
     * There is a significant performance improvement with the operation
     * over its singly linked list counterpart.  The mere fact of having
     * a reference to the previous node improves this operation from O(n)
     * (in the case of singly linked list) to O(1).
     *
     * @returns the node that was removed
     */
    popBack() {
        if (this.isEmpty()) {
            return null;
        }

        // get handle for the tail node
        const nodeToRemove = this.getTailNode();

        // if there is only one node in the list, set head and tail
        // properties to null
        if (this.size() === 1) {
            this.head = null;
            this.tail = null;

            // more than one node in the list
        } else {
            this.tail = this.getTailNode().prev;
            this.tail.next = null;
        }
        this.length -= 1;

        return nodeToRemove;
    }

    /**
     * Removes the head node from the list
     *
     * @returns the node that was removed
     */
    popFront() {
        if (this.isEmpty()) {
            return null;
        }

        let nodeToRemove;

        if (this.size() === 1) {
            nodeToRemove = this.popBack();
        } else {
            nodeToRemove = this.getHeadNode();
            this.head = this.head.next;
            this.head.prev = null;
            this.length -= 1;
        }

        return nodeToRemove;
    }

    /**
     * Removes the node at the index provided
     *
     * @param {number} index The index of the node to remove
     * @returns the node that was removed
     */
    remove(item, index) {
        const nodeToRemove = this.at(index);

        // check for index out-of-bounds
        if (index < 0 || index > this.size() - 1) {
            return null;
        }

        // if index is 0, we just need to remove the first node
        if (index === 0) {
            return this.popFront();
        }

        // if index is size-1, we just need to remove the last node,
        // which popBack() does by default
        if (index === this.size() - 1) {
            return this.popBack();
        }

        nodeToRemove.prev.next = nodeToRemove.next;
        nodeToRemove.next.prev = nodeToRemove.prev;
        nodeToRemove.next = nodeToRemove.prev = null;

        this.length -= 1;

        return nodeToRemove;
    }

    //################## FIND methods ####################

    /**
     * Returns the index of the first node containing the provided data.  If
     * a node cannot be found containing the provided data, -1 is returned.
     *
     * @param {object|string|number} nodeData The data of the node to find
     * @returns the index of the node if found, -1 otherwise
     */
    indexOf(nodeData) {
        this.iterator.reset();
        let current;

        let index = 0;

        // iterate over the list (keeping track of the index value) until
        // we find the node containg the nodeData we are looking for
        while (this.iterator.hasNext()) {
            current = this.iterator.next();
            if (isEqual(current.getData(), nodeData)) {
                return index;
            }
            index += 1;
        }

        // only get here if we didn't find a node containing the nodeData
        return -1;
    }


    /**
     * Returns the node at the location provided by index
     *
     * @param {number} index The index of the node to return
     * @returns the node located at the index provided.
     */
    at(index) {
        // if idx is out of bounds or fn called on empty list, return -1
        if (this.isEmpty() || index > this.size() - 1) {
            return -1;
        }

        // else, loop through the list and return the node in the
        // position provided by idx.  Assume zero-based positions.
        let node = this.getHeadNode();
        let position = 0;

        while (position < index) {
            node = node.next;
            position += 1;
        }

        return node;
    }

    /**
     * Determines whether or not the list contains the provided nodeData
     *
     * @param {object|string|number} nodeData The data to check if the list
     *        contains
     * @returns the true if the list contains nodeData, false otherwise
     */
    contains(nodeData) {
        if (this.includes(nodeData)) {
            return true;
        } else {
            return false;
        }
    }

    //################## UTILITY methods ####################

    /**
     * Utility function to iterate over the list and call the fn provided
     * on each node, or element, of the list
     *
     * @param {object} fn The function to call on each node of the list
     * @param {bool} reverse Use or not reverse iteration (tail to head), default to false
     */
    forEach(fn, reverse = false) {
        if (reverse) {
            this.iterator.reset_reverse();
            this.iterator.each_reverse(fn);
        } else {
            this.iterator.reset();
            this.iterator.each(fn);
        }
    }

    reverse() {
        this.iterator.reset_reverse();
    }

    /**
     * Returns an array of all the data contained in the list
     *
     * @returns {array} the array of all the data from the list
     */
    toArray(reverse) {
        let listArray = [];
        this.forEach(node => {
            listArray.push(node.getData());
        });
        if (reverse) {
            listArray = _.reverse(listArray)
        }
        return listArray;
    }

    /**
     * Interrupts iteration over the list
     */
    interruptEnumeration() {
        this.iterator.interrupt();
    }
}

module.exports = DoublyLinkedList;