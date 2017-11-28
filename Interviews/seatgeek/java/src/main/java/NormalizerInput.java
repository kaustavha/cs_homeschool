public class NormalizerInput {
    public Integer section_id;
    public String section_name;
    public Integer row_id;
    public String row_name;
    public NormalizerInput() {
        section_id = null;
        section_name = null;
        row_name = null;
        row_id = null;
    }
    public NormalizerInput(String line, String DELIMITER) {
        String[] lineArr = line.split(DELIMITER);
        section_id = Integer.parseInt(lineArr[0]);
        section_name = lineArr[1];
        if (lineArr.length == 4) {
            row_id = Integer.parseInt(lineArr[2]);
            row_name = lineArr[3];
        } else {
            row_id = null;
            row_name = null;
        }
    }
}
