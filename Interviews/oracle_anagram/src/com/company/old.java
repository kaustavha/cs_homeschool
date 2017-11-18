//
//class Main {
//    public static boolean main(String w1, String w2) {
//        if (w1.length() != w2.length()) return false;
//        boolean out = true;
//        Map<Character, Integer> store = new HashMap<Character, Integer>(w1.length());
//        for (char c : w1) {
//            if (store.contains(c)) {
//                store[c]++;
//            } else {
//                store.put(c, 1);
//            }
//        }
//        for (char c : w2) {
//            if (!store[c] || store[c] < 1) {
//                out = false;
//                return out;
//            } else {
//                store[c]--;
//            }
//        }
//        return out;
//    }
//}
//
//a, a
//        '' ''
//        awwa, waaw
//        abc, aa
//        awwa, awwwa
//        awa, waw
//
//
//        String[]
//        act, tap, cat, catt, pat
//
//        act, tap, cat, pat
//
//        {a:1, c: 1, t:1} : ['act']
//        'act':
//
//public static Map main(String[] args) {
//        Map<String, LinkedList> store = new HashMap<String, LinkedList>(args.length());
//        for (String w : args) {
//        String sorted = String.valueOf(Array.sort(w.toCharArray()));
//        if (store.contains(sorted)) {
//        store[sorted].add(w);
//        } else {
//        store[sorted] = new LinkedList([w]);
//        }
//        }
//        return store;
//        }
//
//public static boolean isSame(Map m1, Map m2) {
//        boolean out = true;
//        for (char c : m1) {
//        if (!m2.contains(c) || m2[c] < 1) {
//        out = false;
//        return out;
//        } else {
//        m2[c]--;
//        }
//        }
//        return out;
//        }
//
//public static boolean isInStore(Map m1, Map store) {
//        for (Map m : store) {
//        if (isSame(m, m1)) return true;
//        }
//        return false;
//        }
//
//public static Map main(String[] args) {
//        Map<Map, LinkedList> store = new HashMap<Map, LinkedList>(args.length());
//        for (String w : args) {
//        Map<Character, Integer> wordStore = new HashMap<Character, Integer>(w1.length());
//
//        for (char c : w) { //-> char , str
//        if (wordStore.contains(c)) {
//        wordStore[c]++;
//        } else {
//        wordStore.put(c, 1);
//        }
//        }
//
//        // String sorted = String.valueOf(Array.sort(w.toCharArray()));
//        if (isInStore(wordStore, store)) {
//        store[wordStore].add(w); //
//        } else {
//        store[wordStore] = new LinkedList([w]);
//        }
//        }
//        return store;
//        }
//
//
