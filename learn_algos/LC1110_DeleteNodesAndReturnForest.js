/**
 * 1110. Delete Nodes And Return Forest
 * Given the root of a binary tree, each node in the tree has a distinct value.

After deleting all nodes with a value in to_delete, we are left with a forest (a disjoint union of trees).

Return the roots of the trees in the remaining forest.  You may return the result in any order.
 * 
 * 
 * 
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number[]} to_delete
 * @return {TreeNode[]}
 */
var delNodes = function(root, to_delete) {
    let roots = [];
    function found(node, to_delete) {
        return (to_delete.indexOf(node.val) > -1)
    }
    
    function goRight(root, parentRef, selfNode, to_delete) {

        if (found(selfNode, to_delete)) {
            // roots.push(root);
                 if (parentRef && parentRef.right) parentRef.right = null;
            
            if (selfNode.right) goRight(root, null, selfNode.right, to_delete)
            if (selfNode.left) goLeft(root, null, selfNode.left, to_delete)
        } else {
            if (!parentRef) {
                roots.push(selfNode);
                if (selfNode.right) goRight(selfNode.right, selfNode, selfNode.right, to_delete)
                if (selfNode.left) goLeft(selfNode.left, selfNode, selfNode.left, to_delete)
                return;
            }
            if (selfNode.right) goRight(root, selfNode, selfNode.right, to_delete)
            if (selfNode.left) goLeft(root, selfNode, selfNode.left, to_delete)
        }
    }
    
    function goLeft(root, parentRef, selfNode, to_delete) {
        if (found(selfNode, to_delete)) {
                // roots.push(root)
                if (parentRef && parentRef.left) parentRef.left = null;
            
            if (selfNode.right) goRight(selfNode.right, null, selfNode.right, to_delete)
            if (selfNode.left) goLeft(selfNode.left, null, selfNode.left, to_delete)
        } else {
            if (!parentRef) {
                roots.push(selfNode);
                if (selfNode.right) goRight(selfNode, selfNode, selfNode.right, to_delete)
                if (selfNode.left) goLeft(selfNode, selfNode, selfNode.left, to_delete)
                return;
            }
            if (selfNode.right) goRight(root, selfNode, selfNode.right, to_delete)
            if (selfNode.left) goLeft(root, selfNode, selfNode.left, to_delete)
        }
    }
    if (found(root, to_delete)) {
        if (root.right) goRight(root.right, null, root.right, to_delete);
        if (root.left) goLeft(root.left, null, root.left, to_delete);
        return roots;
    }
    
    roots.push(root);
    if (root.right) goRight(root, root, root.right, to_delete);
    if (root.left) goLeft(root, root, root.left, to_delete);
    return roots; 
};