import java.util.ArrayList;

public class Normalizer {

    private final String manifestPath;

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
        // TODO your code goes here
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
        NormalizationResult r = new NormalizationResult();
        r.sectionId = -1;
        r.rowId = -1;
        r.valid = false;

        // TODO your code goes here
        return r;
    }

    public void normalize(ArrayList<SampleRecord> samples) {
        for (SampleRecord sample : samples) {
            NormalizationResult result = normalize(sample.input.section, sample.input.row);
            sample.output.sectionId = result.sectionId;
            sample.output.rowId = result.rowId;
            sample.output.valid = result.valid;
        }
    }
}
