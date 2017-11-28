import java.io.*;
import java.util.*;
import java.util.regex.*;

/**
*
* Description:
* Creates a map of numbers in section names and validates input against that
*
* Algorithm:
* Read manifest file
* Create Map manifestData of integer K -> [manifest row data]
* K is any whole integer value in manifest.row.section_name, or the section_name string if none exists
* On input (section_name, row)
* Derive integer k from section_name
* search manifestData for matching k
*   Search list of valid entries with that k
*   Create a list of matching valid entries with that k and row
*   return top entry if its closer match than others and is unique in its similiarity to input
*
* 
**/


public class Normalizer {
    private final String manifestPath;
    Map<String, List<NormalizerInput>> manifestData = new HashMap<>();
    private static final String DELIMITER = ",";

    public Normalizer(String manifestPath) {
        this.manifestPath = manifestPath;
    }

    /**
     * reads a manifest file
     * manifest should be a CSV containing the following columns
     * * section_id
     * * section_name
     * * row_id
     * * row_name
     */
    public void readManifest() {

        BufferedReader bf;
        try {
            bf = new BufferedReader(new InputStreamReader(
                    new FileInputStream(this.manifestPath)));
            String line = bf.readLine();

            // 1st line is csv def so start at 2nd
            line = bf.readLine();
            while (line != null) {

                NormalizerInput normIn = new NormalizerInput(line, DELIMITER);
                List<NormalizerInput> rows;

                // Get number in section name if any for grouping optimization
                String numeric = extractInt(normIn.section_name);

                if (manifestData.containsKey(numeric)) {
                    rows = manifestData.get(numeric);
                } else {
                    rows = new ArrayList<>();
                }
                rows.add(normIn);
                manifestData.put(numeric, rows);

                line = bf.readLine();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }


        System.out.println("Reading from " + manifestPath);
    }

    /**
     * normalize a single (section, row) input
     * Given a (Section, Row) input, returns (section_id, row_id, valid)
     * where
     * section_id = int or None
     * row_id = int or None
     * valid = True or False
     * Arguments:
     * section {[type]} -- [description]
     * row {[type]} -- [description]
     */
    public NormalizationResult normalize(String section, String row) {
        // initialize return data structure
        NormalizationResult res = new NormalizationResult();

        // match any section with numbers
        String numeric = extractInt(section);
        if (manifestData.containsKey(numeric)) {

            List<NormalizerInput> matches = new ArrayList();
            List s = manifestData.get(numeric);
            Iterator<NormalizerInput> iter = s.iterator();
            while (iter.hasNext()) {
                NormalizerInput seenSect = iter.next();
                if (strOrNumMatch(row, seenSect.row_name)) {
                    matches.add(seenSect);
                }
            }

            NormalizerInput match;
            if (matches.size() > 0) {
                if (matches.size() > 1) {
                    res = findBestMatch(matches, section);
                } else {
                    match = matches.get(0);
                    res.sectionId = match.section_id;
                    res.rowId = match.row_id;
                    res.valid = true;
                }

            }

        }

        return res;
    }


    public void normalize(ArrayList<SampleRecord> samples) {
        for (SampleRecord sample : samples) {
            NormalizationResult result = normalize(sample.input.section, sample.input.row);
            sample.output.sectionId = result.sectionId;
            sample.output.rowId = result.rowId;
            sample.output.valid = result.valid;
        }
    }

    // UTILS

    // parseline parses individual lines into expected normalizer input
    // this represetns rows and such provided by the venue and therefore
    // it isnt programmed very defensibly. Expects valid data to match/test against

    String extractInt(String str) {
        Matcher matcher = Pattern.compile("\\d+").matcher(str);

        if (!matcher.find()) {
            return str;
        }
        return matcher.group();
    }


    // checks stored rows against input row handling integers and strings
    boolean strOrNumMatch(String str1, String str2) {
        if (str1.equalsIgnoreCase(str2)) return true;
        if (str1.matches("\\d+") && str2.matches("\\d+"))
            if (Integer.parseInt(str1) == Integer.parseInt(str2)) return true;
        return false;
    }

    // Given a stored section name and a test input section name returns the number of shared words/letters
    int getStrDiff(String str1, String str2) {
        int score = 0;
        String[] words1 = str1.split(" ");
        String[] words2 = str2.split(" ");
        Set<String> matches = new HashSet<>();
        for (String s1 : words1) {
            for (String s2 : words2) {
                if (s1.equalsIgnoreCase(s2)) matches.add(s1.toLowerCase());
            }
        }

        // do letter match
        for (char c1 : str1.toLowerCase().toCharArray()) {
            for (char c2 : str2.toLowerCase().toCharArray()) {
                if (c1 == c2) {
                    score++;
                    continue;
                }

            }
        }

        return matches.size()*10 + score;
    }

    NormalizationResult findBestMatch(List<NormalizerInput> matches, String section) {
        NormalizationResult res = new NormalizationResult();
        Iterator<NormalizerInput> iter = matches.iterator();
        int maxScore = 0;
        int curScore = 0;
        // if multiple matches qualify well see same score repeatedly
        Set<Integer> seenScores = new HashSet<>();
        NormalizerInput result = new NormalizerInput();
        while (iter.hasNext()) {
            NormalizerInput curMatch = iter.next();
            curScore = getStrDiff(curMatch.section_name, section);
            seenScores.add(curScore);
            if (curScore > maxScore) {
                maxScore = curScore;
                result = curMatch;
            }
        }

        if (!(seenScores.size() == 1 && matches.size() > 1)) {
            res.sectionId = result.section_id;
            res.rowId = result.row_id;
            res.valid = true;
        }
        return res;
    }

}
