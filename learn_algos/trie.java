class Trie {
    /** Initialize your data structure here. */
    private Node root;
    public Trie() {
        root = new Node();
        root.val = ' ';
    }
    class Node {
        char val;
        boolean isWord;
        Map<Character,Node> kids = new HashMap<Character, Node>(26);
        Node(){}
        Node(char c) {
            val = c;
        }
    }
    /** Inserts a word into the trie. */
    public void insert(String word) {
        Node pre = root;
        for (int i=0;i<word.length();i++) {
            char c = word.charAt(i);
            if (pre.kids.get(c) == null)
                pre.kids.put(c, new Node(c));
            pre = pre.kids.get(c);
        }
        pre.isWord = true;
        
    }
    
    /** Returns if the word is in the trie. */
    public boolean search(String word) {
        Node pre = root;
        for (int i=0;i<word.length();i++) {
            char c = word.charAt(i);
            if (pre.kids.get(c) == null)
                return false;
            pre = pre.kids.get(c);
        }
        if (pre.isWord) return true;
        return false;
    }
    
    /** Returns if there is any word in the trie that starts with the given prefix. */
    public boolean startsWith(String prefix) {
        Node pre = root;
        for (int i=0;i<prefix.length();i++) {
            char c = prefix.charAt(i);
            if (pre.kids.get(c) == null)
                return false;
            pre = pre.kids.get(c);
        }
        return true;
        
    }
}

/**
 * Your Trie object will be instantiated and called as such:
 * Trie obj = new Trie();
 * obj.insert(word);
 * boolean param_2 = obj.search(word);
 * boolean param_3 = obj.startsWith(prefix);
 */