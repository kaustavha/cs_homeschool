package com.company;

import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Anagram
        AnagramTester a = new AnagramTester();

        System.out.println("Testing compare functions, should be all true: ");
        
        System.out.println(a.compare("awwa", "waaw"));
        System.out.println(a.compare("a","a"));
        System.out.println(!a.compare("abc", "aa"));
        System.out.println(!a.compare("awa", "waw"));
        System.out.println(a.compare("", ""));

        System.out.println("Testing compareConcise function: ");

        System.out.println(a.compareConcise("awwa", "waaw"));
        System.out.println(a.compareConcise("a","a"));
        System.out.println(!a.compareConcise("abc", "aa"));
        System.out.println(!a.compareConcise("awa", "waw"));
        System.out.println(a.compareConcise("", ""));

        System.out.println("Test grouping funcs: ");

        String[] testArr1 = {"act", "tap", "cat", "catt", "pat"};
        String[] testArr2 = {"awwa", "waaw", "awa", "waw", "wct", "wccc", "wwwa"};

        System.out.println(a.group(testArr1));
        System.out.println(a.groupWithMaps(testArr1));

        System.out.println(a.group(testArr2));
        System.out.println(a.groupWithMaps(testArr2));
    }
    static class AnagramTester {
        public boolean compare(String w1, String w2) {
            if (w1.length() != w2.length()) return false;
            Map<Character, Integer> store = stringToMap(w1);
            Map<Character, Integer> store2 = stringToMap(w2);
            if (store.equals(store2)) return true;
            return false;
        }

        // Same speed as above but more concise, no extra funcs, uses array instead
        public boolean compareConcise(String w1, String w2) {
            if (w1.length() != w2.length()) return false;
            int[] count = new int[26];
            for (int i = 0; i<w1.length(); i++) {
                int c = (int)w1.charAt(i)-97;
                int d = (int)w2.charAt(i)-97;
                count[c]++;
                count[d]--;
            }
            for (int i : count) {
                if (i != 0) return false;
            }
            return true;
        }

        // Groups by strings O(kn) where k=26 or alphabet length * length of strings
        public Map<String, LinkedList> group(String[] args) {
            Map<String, LinkedList> store = new HashMap<>(args.length);
            for (String s : args) {
                String sorted = sort(s);
                if (!store.containsKey(sorted)) store.put(sorted, new LinkedList());
                LinkedList l = store.get(sorted);
                l.add(s);
            }
            return store;
        }

        // Groups by mapping O(kn) where k is string length
        public Map<Map<Character, Integer>, LinkedList> groupWithMaps(String[] args) {
            Map<Map<Character, Integer>, LinkedList> ret = new HashMap<>();
            for (String s : args) {
                Map<Character, Integer> wordStore = stringToMap(s);
                if (!ret.containsKey(wordStore)) ret.put(wordStore, new LinkedList());
                LinkedList l = ret.get(wordStore);
                l.add(s);
            }
            return ret;
        }

        private Map<Character, Integer> stringToMap(String s) {
            char[] sc = s.toCharArray();
            Map<Character, Integer> ws = new HashMap<>();
            for (char c : sc) {
                if (!ws.containsKey(c)) ws.put(c, 0);
                ws.put(c, ws.get(c) + 1);
            }
            return ws;
        }

        // possibly faster than javas basic sort method for our use case
        // O(k+N) where k is alphabet length 26, vs O(n log n)
        private char[] pigeonholeSort(char[] ca) {
            int[] holes = new int[26];
            char[] res = new char[ca.length];
            for (char c : ca) {
                int v = (int) c;
                v = v - 97;
                holes[v]++;
            }
            int pos = 0;
            for (int i = 0; i<26; i++) {
                int count = holes[i];
                for (int j = 0; j<count; j++) {
                    res[pos] = (char)(i+97); // convert back to char
                    pos++;
                }
            }
            return res;
        }

        // basic sort wrapper
        private String sort(String s) {
            char[] c = s.toCharArray();
            // Arrays.sort(c);
            // Use pigeonsort instead
            c = pigeonholeSort(c);
            StringBuilder sb = new StringBuilder();
            for (int i=0;i<c.length; i++) {
                sb.append(c[i]);
            }
            return sb.toString();
        }
    }
}
