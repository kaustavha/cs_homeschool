
import java.io.*;
import java.util.*;
class ST {
    BufferedReader in;
    PrintStream out;

    class SuffixTree {
        final int oo = Integer.MAX_VALUE/2;
        Node [] nodes;
        char [] text;
        int root, position = -1,
                currentNode,
                needSuffixLink,
                remainder;

        int active_node, active_length, active_edge;

        class Node {

            /*
               There is no need to create an "Edge" class.
               Information about the edge is stored right in the node.
               [start; end) interval specifies the edge,
               by which the node is connected to its parent node.
            */

            int start, end = oo, link;
            public TreeMap<Character, Integer> next = new TreeMap<Character, Integer>();

            public Node(int start, int end) {
                this.start = start;
                this.end = end;
            }

            public int edgeLength() {
                return Math.min(end, position + 1) - start;
            }
        }

        public SuffixTree(int length) {
            nodes = new Node[2* length + 2];
            text = new char[length];
            root = active_node = newNode(-1, -1);
        }

        private void addSuffixLink(int node) {
            if (needSuffixLink > 0)
                nodes[needSuffixLink].link = node;
            needSuffixLink = node;
        }

        char active_edge() {
            return text[active_edge];
        }

        boolean walkDown(int next) {
            if (active_length >= nodes[next].edgeLength()) {
                active_edge += nodes[next].edgeLength();
                active_length -= nodes[next].edgeLength();
                active_node = next;
                return true;
            }
            return false;
        }

        int newNode(int start, int end) {
            nodes[++currentNode] = new Node(start, end);
            return currentNode;
        }

        public void addChar(char c) throws Exception {
            text[++position] = c;
            needSuffixLink = -1;
            remainder++;
            while(remainder > 0) {
                if (active_length == 0) active_edge = position;
                if (!nodes[active_node].next.containsKey(active_edge())){
                    int leaf = newNode(position, oo);
                    nodes[active_node].next.put(active_edge(), leaf);
                    addSuffixLink(active_node); //rule 2
                } else {
                    int next = nodes[active_node].next.get(active_edge());
                    if (walkDown(next)) continue;   //observation 2
                    if (text[nodes[next].start + active_length] == c) { //observation 1
                        active_length++;
                        addSuffixLink(active_node); // observation 3
                        break;
                    }
                    int split = newNode(nodes[next].start, nodes[next].start + active_length);
                    nodes[active_node].next.put(active_edge(), split);
                    int leaf = newNode(position, oo);
                    nodes[split].next.put(c, leaf);
                    nodes[next].start += active_length;
                    nodes[split].next.put(text[nodes[next].start], next);
                    addSuffixLink(split); //rule 2
                }
                remainder--;

                if (active_node == root && active_length > 0) {  //rule 1
                    active_length--;
                    active_edge = position - remainder + 1;
                } else
                    active_node = nodes[active_node].link > 0 ? nodes[active_node].link : root; //rule 3
            }
        }

        /*
            printing the Suffix Tree in a format understandable by graphviz. The output is written into
            st.dot file. In order to see the suffix tree as a PNG image, run the following command:
            dot -Tpng -O st.dot
         */

        String edgeString(int node) {
            return new String(Arrays.copyOfRange(text, nodes[node].start, Math.min(position + 1, nodes[node].end)));
        }

        void printTree() {
            out.println("digraph {");
            out.println("\trankdir = LR;");
            out.println("\tedge [arrowsize=0.4,fontsize=10]");
            out.println("\tnode1 [label=\"\",style=filled,fillcolor=lightgrey,shape=circle,width=.1,height=.1];");
            out.println("//------leaves------");
            printLeaves(root);
            out.println("//------internal nodes------");
            printInternalNodes(root);
            out.println("//------edges------");
            printEdges(root);
            out.println("//------suffix links------");
            printSLinks(root);
            out.println("}");
        }

        void printLeaves(int x) {
            if (nodes[x].next.size() == 0)
                out.println("\tnode"+x+" [label=\"\",shape=point]");
            else {
                for (int child : nodes[x].next.values())
                    printLeaves(child);
            }
        }

        void printInternalNodes(int x) {
            if (x != root && nodes[x].next.size() > 0)
                out.println("\tnode"+x+" [label=\"\",style=filled,fillcolor=lightgrey,shape=circle,width=.07,height=.07]");

            for (int child : nodes[x].next.values())
                printInternalNodes(child);
        }

        void printEdges(int x) {
            for (int child : nodes[x].next.values()) {
                out.println("\tnode"+x+" -> node"+child+" [label=\""+edgeString(child)+"\",weight=3]");
                printEdges(child);
            }
        }

        void printSLinks(int x) {
            if (nodes[x].link > 0)
                out.println("\tnode"+x+" -> node"+nodes[x].link+" [label=\"\",weight=1,style=dotted]");
            for (int child : nodes[x].next.values())
                printSLinks(child);
        }
        
        void traverse(Node node, int[] suffixArr, int idx) {
          if (node == null) return;
          for (int i=0; i<nodes.children.length(); i++) {
            traverse(node.children[i], suffixArr, idx);
          }
        }
    }

    public ST(String line) throws Exception {
        out = System.out;
        SuffixTree st = new SuffixTree(line.length());
        for (int i = 0; i < line.length(); i++)
            st.addChar(line.charAt(i));
        st.printTree();
    }

    // public static void main(String ... args) throws Exception{
    //     new ST();
    // }
}
class Main {
  public static void main(String[] args) throws Exception {
    ST st = new ST("Banana");
  }
}
