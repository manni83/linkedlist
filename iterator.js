/**
 * @fileOverview Implementation of an iterator for a linked list
 *               data structure
 */


/**************************************************
 * Iterator class
 *
 * Represents an instantiation of an iterator to be used
 * within a linked list.  The iterator will provide the ability
 * to iterate over all nodes in a list by keeping track of the
 * postition of a 'currentNode'.  This 'currentNode' pointer
 * will keep state until a reset() operation is called at which
 * time it will reset to point the head of the list.
 *
 * Even though this iterator class is inextricably linked
 * (no pun intended) to a linked list instatiation, it was removed
 * from within the linked list code to adhere to the best practice
 * of separation of concerns.
 *
 ***************************************************/

/**
 * Creates an iterator instance to iterate over the linked list provided.
 *
 * @constructor
 * @param {object} theList the linked list to iterate over
 */
class Iterator {
    constructor(theList) {
        this.list = theList || null;
        this.stopIterationFlag = false;

        // a pointer the current node in the list that will be returned.
        // initially this will be null since the 'list' will be empty
        this.currentNode = null;
    }

    /* Functions attached to the Iterator prototype.  All iterator instances
     * will share these methods, meaning there will NOT be copies made for each
     * instance.
     */
    /**
     * Returns the next node in the iteration.
     *
     * @returns {object} the next node in the iteration.
     */
    next() {
        const current = this.currentNode;
        // a check to prevent error if randomly calling next() when
        // iterator is at the end of the list, meaining the currentNode
        // will be pointing to null.
        //
        // When this function is called, it will return the node currently
        // assigned to this.currentNode and move the pointer to the next
        // node in the list (if it exists)
        if (this.currentNode !== null) {
            this.currentNode = this.currentNode.next;
        }

        return current;
    }

    /**
     * Determines if the iterator has a node to return
     *
     * @returns true if the iterator has a node to return, false otherwise
     */
    hasNext() {
        return this.currentNode !== null;
    }

    /**
     * Resets the iterator to the beginning of the list.
     */
    reset() {
        this.currentNode = this.list.getHeadNode();
    }

    /**
     * Returns the first node in the list and moves the iterator to
     * point to the second node.
     *
     * @returns the first node in the list
     */
    first() {
        this.reset();
        return this.next();
    }

    /**
     * Sets the list to iterate over
     *
     * @param {object} theList the linked list to iterate over
     */
    setList(theList) {
        this.list = theList;
        this.reset();
    }

    /**
     * Iterates over all nodes in the list and calls the provided callback
     * function with each node as an argument.
     * Iteration will break if interrupt() is called
     *
     * @param {function} callback the callback function to be called with
     *                   each node of the list as an arg
     */
    each(callback) {
        this.reset();
        let el;
        while (this.hasNext() && !this.stopIterationFlag) {
            el = this.next();
            callback(el);
        }
        this.stopIterationFlag = false;
    }

    /*
     * ### REVERSE ITERATION (TAIL -> HEAD) ###
     */

    /**
     * Returns the first node in the list and moves the iterator to
     * point to the second node.
     *
     * @returns the first node in the list
     */
    last() {
        this.reset_reverse();
        return this.next_reverse();
    }

    /**
     * Resets the iterator to the tail of the list.
     */
    reset_reverse() {
        this.currentNode = this.list.getTailNode();
    }

    /**
     * Returns the next node in the iteration, when iterating from tail to head
     *
     * @returns {object} the next node in the iteration.
     */
    next_reverse() {
        const current = this.currentNode;
        if (this.currentNode !== null) {
            this.currentNode = this.currentNode.prev;
        }

        return current;
    }

    /**
     * Iterates over all nodes in the list and calls the provided callback
     * function with each node as an argument,
     * starting from the tail and going towards the head.
     * The iteration will break if interrupt() is called.
     *
     * @param {function} callback the callback function to be called within
     *                    each node as an arg
     */
    each_reverse(callback) {
        this.reset_reverse();
        let el;
        while (this.hasNext() && !this.stopIterationFlag) {
            el = this.next_reverse();
            callback(el);
        }
        this.stopIterationFlag = false;
    }

    /*
     * ### INTERRUPT ITERATION ###
     */

    /**
     * Raises interrupt flag (that will stop each() or each_reverse())
     */

    interrupt() {
        this.stopIterationFlag = true;
    }
}

module.exports = Iterator;
