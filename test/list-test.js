/* globals describe it beforeEach afterEach */
var chai = require('chai');
var LinkedList = require('../');

var expect = chai.expect;

describe('Linked List', function () {
    var list = null;

    // Utility function to populate the list with dummy data.
    // The number of nodes added will be specified by the 'numNodes'
    // parameter.
    var populateList = function (aList, numNodes) {
        for (var i = 0; i < numNodes; i++) {
            aList.pushBack('test item ' + (i + 1));
        }
    };

    beforeEach(function () {
        list = new LinkedList();
    });

    afterEach(function () {
        list = null;
    });

    it('initially contains zero items', function () {
        expect(list.isEmpty()).to.be.true;
        expect(list.size()).to.equal(0);
    });

    it('clears the list and set head and tail to null', function () {
        populateList(list, 10);
        expect(list.size()).to.equal(10);
        list.clear();
        expect(list.size()).to.equal(0);
        expect(list.getHeadNode()).to.not.exist;
        expect(list.getTailNode()).to.not.exist;
    });

    it('returns an array of all the data in the list', function () {
        list.pushBack({
            id: 1,
            name: 'test item 1'
        });
        list.pushBack({
            id: 2,
            name: 'test item 2'
        });
        list.pushBack({
            id: 3,
            name: 'test item 3'
        });
        var listArray = list.toArray(false);
        expect(listArray).to.be.an('array');
        expect(listArray.length).to.equal(3);
    });

    it('returns an array of all the data in the list in reverse', function () {
        list.pushBack({
            id: 1,
            name: 'test item 1'
        });
        list.pushBack({
            id: 2,
            name: 'test item 2'
        });
        list.pushBack({
            id: 3,
            name: 'test item 3'
        });
        var listArray = list.toArray(true);
        expect(listArray).to.be.an('array');
        expect(listArray[0].id).to.equal(3);
        expect(listArray.length).to.equal(3);
    });

    describe('iterator functionality', function () {
        it('exists when a list is instantiated', function () {
            expect(list.iterator).to.exist;
        });

        it('iterator currentNode is null when first instantiated',
            function () {
                expect(list.iterator.next()).to.not.exist;
            });

        it('returns the tail node when iterator.last() is called', function () {
            populateList(list, 10);
            var last = list.iterator.last();
            expect(last).to.equal(list.getTailNode());
        });

        it('returns the head node when iterator.first() is called',
            function () {
                populateList(list, 10);
                var first = list.iterator.first();
                expect(first).to.equal(list.getHeadNode());
            });

        it('returns correct boolean value for hasNext()', function () {
            populateList(list, 3);
            list.iterator.reset();

            expect(list.iterator.hasNext()).to.be.true;
            // get first element
            list.iterator.next();

            expect(list.iterator.hasNext()).to.be.true;
            // get second element
            list.iterator.next();

            expect(list.iterator.hasNext()).to.be.true;
            // get third element
            list.iterator.next();

            // should be no more element in list
            expect(list.iterator.hasNext()).to.be.false;
        });

        it('returns correct boolean value for hasNext() in reverse order', function () {
            populateList(list, 3);
            list.iterator.reset_reverse();

            expect(list.iterator.hasNext()).to.be.true;
            list.iterator.next_reverse();

            expect(list.iterator.hasNext()).to.be.true;
            list.iterator.next_reverse();

            expect(list.iterator.hasNext()).to.be.true;
            list.iterator.next_reverse();

            expect(list.iterator.hasNext()).to.be.false;
        });

        it('iterates through elements from head to tail when calling iterator.each()', function () {
            populateList(list, 3);
            var array = [];
            //expected result
            var expectedArray = ['test item 1', 'test item 2', 'test item 3'];
            var dummyCallback = function (node) {
                array.push(node.getData());
            };
            list.iterator.reset();
            list.iterator.each(dummyCallback);
            expect(array).to.eql(expectedArray);
        });

        it('iterates through elements from tail to head when calling iterator.each_reverse()', function () {
            populateList(list, 3);
            var array = [];
            var expectedArray = ['test item 3', 'test item 2', 'test item 1'];
            var dummyCallback = function (node) {
                array.push(node.getData());
            };
            list.iterator.reset_reverse();
            list.iterator.each_reverse(dummyCallback);
            expect(array).to.eql(expectedArray);
        });

        it('stops in the middle of iteration if iterator.interrupt() is called', function () {
            populateList(list, 5);
            var count = 0;
            var dummyCallback = function () {
                count += 1;
                if (count === 3) {
                    list.iterator.interrupt();
                }
            };

            // head to tail
            list.iterator.reset();
            list.iterator.each(dummyCallback);
            expect(count).to.equal(3);

            // tail to head
            count = 0;
            list.iterator.reset_reverse();
            list.iterator.each_reverse(dummyCallback);
            expect(count).to.equal(3);
        });
    });

    describe('pushBack functionality', function () {
        it('sets the head node equal to the tail node when first item ' +
            'is inserted', function () {
                list.pushBack('test item 1');
                expect(list.getHeadNode()).to.eql(list.getTailNode());
                expect(list.size()).to.equal(1);
            });

        it('inserts items to the back of the list', function () {
            populateList(list, 5);
            expect(list.isEmpty()).to.be.false;
            expect(list.size()).to.equal(5);
            var tail = list.getTailNode();
            expect(tail.getData()).to.equal('test item 5');
        });

        it('inserts items to the front of the list', function () {
            list.pushBack('test item 1');
            list.pushBack('test item 2');
            list.pushFront('new item 0');
            expect(list.getHeadNode().data).to.equal('new item 0');
            expect(list.getHeadNode().hasPrev()).to.be.false;
            expect(list.size()).to.equal(3);
        });

        it('inserts item at a particular index', function () {
            populateList(list, 3);
            list.pushBack('test item 5');
            expect(list.size()).to.equal(4);
            var success = list.insert(3, 'test item 4');
            expect(success).to.be.true;
            expect(list.size()).to.equal(5);
            var node = list.at(3);
            expect(node.getData()).to.equal('test item 4');
        });

        it('inserts new head node when inserting at index 0', function () {
            populateList(list, 3);
            expect(list.size()).to.equal(3);
            var success = list.insert(0, 'test item 0');
            expect(success).to.be.true;
            expect(list.size()).to.equal(4);
            var node = list.getHeadNode();
            expect(node.getData()).to.equal('test item 0');
        });

        it('returns false when trying to pushBack at index out of bounds', function () {
            populateList(list, 3);
            var success = list.insert(5, 'test item 4');
            expect(success).to.be.false;
        });
    });

    describe('remove functionality', function () {
        it('returns null if remove is called on an empty list',
            function () {
                var node = list.popBack();
                expect(node).to.not.exist;
            });

        it('removes items from the back of the list', function () {
            populateList(list, 3);
            expect(list.isEmpty()).to.be.false;
            expect(list.size()).to.equal(3);
            var node = list.popBack();
            expect(node.getData()).to.equal('test item 3');
            expect(list.size()).to.equal(2);
            var last = list.getTailNode();
            expect(last.getData()).to.equal('test item 2');
            expect(last.hasNext()).to.be.false;
        });

        it('returns null if popFront is called on an empty list',
            function () {
                var node = list.popFront();
                expect(node).to.not.exist;
            });

        it('removes items from the front of the list', function () {
            populateList(list, 3);
            expect(list.isEmpty()).to.be.false;
            expect(list.size()).to.equal(3);
            var node = list.popFront();
            expect(node.getData()).to.equal('test item 1');
            expect(list.size()).to.equal(2);
            var first = list.getHeadNode();
            expect(first.getData()).to.equal('test item 2');
            expect(first.hasPrev()).to.be.false;
        });

        it('removes item from the front of a list with only one node', function () {
            list.pushBack('test item 1');
            var node = list.popFront();
            expect(node.getData()).to.equal('test item 1');
            expect(list.size()).to.equal(0);
        });
    });

    describe('find functionality', function () {

        it('returns the index of node containing the provided data',
            function () {
                populateList(list, 3);
                var index = list.indexOf('test item 1');
                expect(index).to.equal(0);

                index = list.indexOf('test item 2');
                expect(index).to.equal(1);

                index = list.indexOf('test item 3');
                expect(index).to.equal(2);
            });

        it('returns -1 for the index of node with the given data if the' +
            'node does not exist',
            function () {
                populateList(list, 3);
                var index = list.indexOf('not found');
                expect(index).to.equal(-1);
            });

        it('returns node at given index', function () {
            list.pushBack('test item 1');
            list.pushBack('test item 2');
            var node = list.at(0);
            expect(node).to.be.an('object');
            expect(node.getData()).to.equal('test item 1');

            node = list.at(1);
            expect(node).to.be.an('object');
            expect(node.getData()).to.equal('test item 2');
        });

        it('returns -1 when at() is called w/ index > than list size',
            function () {
                var node = list.at(0);
                expect(node).to.not.be.an('object');
                expect(node).to.equal(-1);
            });
    });
});
