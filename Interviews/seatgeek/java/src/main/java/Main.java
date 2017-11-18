import java.io.IOException;
import java.util.ArrayList;

import net.sourceforge.argparse4j.ArgumentParsers;
import net.sourceforge.argparse4j.inf.ArgumentParser;
import net.sourceforge.argparse4j.inf.ArgumentParserException;
import net.sourceforge.argparse4j.inf.Namespace;

public class Main {

    private static final ArgumentParser PARSER = ArgumentParsers.newArgumentParser("main").description("Process some integers.");

    static {
        PARSER.addArgument("--manifest");
        PARSER.addArgument("--input");
        PARSER.addArgument("--section");
        PARSER.addArgument("--row");
    }

    // executable for normalize
    public static void main(String[] args) throws ArgumentParserException, IOException {
        Namespace res = PARSER.parseArgs(args);
        
        String manifest = res.getString("manifest");
        Normalizer normalizer = new Normalizer(manifest);
        normalizer.readManifest();

        String input = getStringOrNull(res, "input");
        String section = getStringOrNull(res, "section");
        String row = getStringOrNull(res, "row");

        if (input != null) {
            SampleCSVParser csvParser = new SampleCSVParser(input);
            ArrayList<SampleRecord> samples = csvParser.readInput();
            normalizer.normalize(samples);
            outputSamples(samples);
        } else if (section != null && row != null) {
            NormalizationResult r = normalizer.normalize(section, row);
            String output = String.format("Input:\n    [section] %s\t[row] %s\nOutput:\n    [section_id] %d\t[row_id] %d\nValid?:\n    %b",
                    section, row, r.sectionId, r.rowId, r.valid);
            System.out.println(output);
        }
    }

    public static void outputSamples(ArrayList<SampleRecord> samples) {
        for (SampleRecord sample : samples) {
            System.out.println(sample.toJson());
        }
    }

    private static String getStringOrNull(Namespace res, String key) {
        if (res.getString(key) != null) {
            return res.getString(key);
        }
        return null;
    }
}
