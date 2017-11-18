import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class SampleCSVParser {

    private static final String DELIMITER = ",";

    public static final List<String> BOOLEANS = Arrays.asList("true", "t", "yes", "y", "1");

    private final String inputPath;

    public SampleCSVParser(String inputPath) {
        this.inputPath = inputPath;
    }

    public ArrayList<SampleRecord> readInput() throws IOException {
        ArrayList<SampleRecord> samples = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new FileReader(inputPath))) {
            br.lines().forEach(line -> {
                String[] rc = line.split(DELIMITER);

                if (rc[0].equals("section")) {
                    return;
                }

                SampleRecord record = new SampleRecord();
                // section_id,section_name,row_id,row_name
                record.input.section = rc[0];
                record.input.row = rc[1];
                record.expected.sectionId = toInt(rc[2]);
                record.expected.rowId = toInt(rc[3]);
                record.expected.valid = toBoolean(rc[4]);
                samples.add(record);
            });
        }

        return samples;
    }

    public static boolean toBoolean(String s) {
        return BOOLEANS.contains(s.toLowerCase());
    }

    public static int toInt(String s) {
        try {
            return Integer.parseInt(s);
        } catch (Exception e) {
            return -1;
        }
    }
}
