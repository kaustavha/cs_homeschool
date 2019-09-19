/*
Formatted text in Slab is represented in JSON for consistency and specificity. A simplified version for a nested list might look something like this:

[
  {text: "One", indent: 0},
  {text: "Two", indent: 0},
  {text: "Alpha", indent: 1},
  {text: "I", indent: 2},
  {text: "II", indent: 2},
  {text: "Three", indent: 0}
]

Which the front end should render to:

1. One
2. Two
  a. Alpha
    i. I
    ii. II
3. Three

It is sometimes necessary to convert this JSON representation into HTML for exporting, emails, or pasting into other applications. Write the function that handles this conversion. The above output would look like this:

<ol>
  <li>One</li>
  <li>Two
    <ol>
      <li>Alpha
        <ol>
          <li>I</li>
          <li>II</li>
        </ol>
      </li>
    </ol>
  </li>
  <li>Three</li>
</ol>

You may ignore whitespace and newline.
*/

/**
 * 
 * @param {Array<Object>} list
 * Strategy: Create 2 linked lists, left and right; left is populated to the right, right is populated to the left
 * 1 As new items come in, create nodes representing text and tags and push to left
 * 2 If new item has higher indent,
 *     move /li node from left to right
 *     push ol to left. /ol to right and repeat strat 1
 * 3 If new item has lower indent rewind right list, addback nodes, reset pointer
 * 4 Read back 2 lists left to right
 */
function conversion(list) {
    class Node {
        constructor(txt, indent, right, left) {
            this.text = txt;
            this.indent = indent;
            this.right = right;
            this.left = left;
        }
    }

    let curIndent=0,
        leftroot = new Node("<ol>", curIndent, null, null),
        rightroot = new Node("</ol>", curIndent, null, null),
        left = leftroot;

    let addLeft = (txt) => {
        let leftNode = new Node(txt, curIndent, null, leftroot);
        leftroot.right = leftNode;
        leftroot = leftNode;
    }
    let addRight = (txt) => {
        let rightNode = new Node(txt, curIndent, rightroot, null);
        rightroot.left = rightNode;
        rightroot = rightNode;
    }
    let moveLeftToRight = () => {
        let leftNode = leftroot.left;
        leftroot.left = null;
        rightroot.left = leftroot;
        rightroot.left.right = rightroot;
        rightroot.left.left = null;
        leftroot = leftNode;
    }

    let createStacks = (ele) => {
        if (ele.indent === curIndent) {
            addLeft("<li>")
            addLeft(ele.text)
            addLeft("</li>")
        } else if (ele.indent > curIndent) {
            curIndent++;
            moveLeftToRight();
            addLeft("<ol>");
            addRight("</ol>");
            return createStacks(ele);
        } else if (ele.indent < curIndent) {
            let tempRight = rightroot, templeft;
            while (rightroot.indent > ele.indent) {
                templeft = rightroot;
                rightroot = rightroot.right;
            }
            addRight("</li>");
            addRight(ele.text);
            addRight("<li>");
            templeft.right = rightroot
            rightroot.left = templeft;
            rightroot = tempRight;
            return;
        }
    }

    list.forEach((ele, i) => { 
        createStacks(ele)
    });
    while (left && left.text) {
        console.log(left.text);
        left = left.right;
    }
    while (rightroot && rightroot.text) {
        console.log(rightroot.text);
        rightroot = rightroot.right;
    }
}

conversion([
    {text: "One", indent: 0},
    {text: "Two", indent: 0},
    {text: "Alpha", indent: 1},
    {text: "I", indent: 2},
    {text: "II", indent: 2},
    {text: "Three", indent: 0}
]);

// https://htmlformatter.com/

// This solution matches expected answer
